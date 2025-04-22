import type { NextApiRequest, NextApiResponse } from "next";
import sgMail from "@sendgrid/mail";

// Configure SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  id?: string; // Optional document ID from Firestore
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check if SendGrid API key is configured
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured. Email will not be sent.");
    return res.status(200).json({
      success: true,
      emailSent: false,
      message: "Contact form submitted but email notification not configured"
    });
  }

  try {
    const { name, email, message } = req.body as ContactFormData;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prepare email message
    const msg = {
      to: process.env.EMAIL_TO || "support@7pailabs.com",
      from: process.env.EMAIL_FROM || "no-reply@shrlink.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #718096; font-size: 0.875rem; margin-top: 20px;">This message was sent from the shrlink contact form.</p>
        </div>
      `,
    };

    try {
      // Send email using SendGrid
      await sgMail.send(msg);
      return res.status(200).json({
        success: true,
        emailSent: true,
        message: "Email sent successfully"
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Still return success since the form data was saved to Firestore
      return res.status(200).json({
        success: true,
        emailSent: false,
        message: "Contact form submitted but email notification failed"
      });
    }
  } catch (error) {
    console.error("Error processing contact form:", error);
    return res.status(500).json({
      message: "Failed to process contact form submission",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}