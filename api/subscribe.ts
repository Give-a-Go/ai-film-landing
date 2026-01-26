import type { VercelRequest, VercelResponse } from "@vercel/node";

// Helper function to find a contact by email
async function findContactByEmail(
  email: string,
  listId: string,
  apiKey: string
): Promise<any> {
  const response = await fetch(
    `https://emailoctopus.com/api/1.6/lists/${listId}/contacts?email_address=${encodeURIComponent(
      email
    )}&api_key=${apiKey}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to find contact: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data && data.data.length > 0 ? data.data[0] : null;
}

// Helper function to update contact tags
async function updateContactTags(
  contactId: string,
  tags: string[],
  listId: string,
  apiKey: string
): Promise<void> {
  const response = await fetch(
    `https://emailoctopus.com/api/1.6/lists/${listId}/contacts/${contactId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        tags: tags,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      `Failed to update contact: ${data.error?.message || response.statusText}`
    );
  }
}

// Helper function to append tag to existing contact
async function appendTagToExistingContact(
  email: string,
  newTag: string,
  listId: string,
  apiKey: string
): Promise<void> {
  try {
    // Find the contact by email
    const contact = await findContactByEmail(email, listId, apiKey);

    if (!contact) {
      console.error("Contact not found despite MEMBER_EXISTS error");
      return;
    }

    // Get existing tags
    const existingTags = contact.tags || [];

    // Add new tag if not already present
    if (!existingTags.includes(newTag)) {
      existingTags.push(newTag);

      // Update contact with merged tags
      await updateContactTags(contact.id, existingTags, listId, apiKey);
      console.log(`Successfully appended tag "${newTag}" to ${email}`);
    } else {
      console.log(`Tag "${newTag}" already exists for ${email}`);
    }
  } catch (error) {
    console.error("Error appending tag to existing contact:", error);
    // Don't throw - we want to return success to the user even if tag update fails
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate email
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Get environment variables
  const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;
  const listId = process.env.EMAIL_OCTOPUS_LIST_ID;

  if (!apiKey || !listId) {
    console.error("Missing EMAIL_OCTOPUS_API_KEY or EMAIL_OCTOPUS_LIST_ID");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Call EmailOctopus API
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${listId}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          email_address: email,
          status: "SUBSCRIBED",
          tags: ["ai-film-making-hackathon-v2"],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific EmailOctopus errors
      if (data.error && data.error.code === "MEMBER_EXISTS_WITH_EMAIL_ADDRESS") {
        // Append tag to existing contact
        await appendTagToExistingContact(
          email,
          "ai-film-making-hackathon-v2",
          listId,
          apiKey
        );

        return res.status(200).json({
          success: true,
          message: "You're already on the waitlist!",
        });
      }

      console.error("EmailOctopus API error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Failed to subscribe to waitlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully added to waitlist!",
    });
  } catch (error) {
    console.error("Error subscribing to EmailOctopus:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}
