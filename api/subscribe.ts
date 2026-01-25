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
        return res.status(200).json({ 
          success: true, 
          message: "You're already on the waitlist!" 
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
