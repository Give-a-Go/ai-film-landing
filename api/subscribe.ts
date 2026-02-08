import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    // Call EmailOctopus API v2 upsert endpoint (create or update contact)
    // This endpoint automatically handles both new and existing contacts
    const response = await fetch(
      `https://api.emailoctopus.com/lists/${listId}/contacts`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          tags: {
            "ai-film-making-hackathon-v2": true
          },
        }),
      }
    );

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      // Handle EmailOctopus API v2 errors (RFC 7807 format)
      const errorDetail = data.detail || data.title || "Failed to subscribe to waitlist";
      console.error("EmailOctopus API v2 error:", data);
      
      return res.status(response.status).json({
        error: errorDetail,
      });
    }

    // Success - check if contact was created or updated
    const isExisting = response.status === 200;
    const message = isExisting 
      ? "You're already on the waitlist! Your interest has been noted."
      : "Successfully added to waitlist!";

    return res.status(200).json({
      success: true,
      message: message,
    });
  } catch (error) {
    console.error("Error subscribing to EmailOctopus:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}
