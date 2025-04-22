import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Configure email transporter with timeout settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com", // Replace with your email or use env variable
    pass: process.env.EMAIL_PASSWORD || "your-app-password", // Use app password for Gmail
  },
  // Add timeout settings to prevent long waits
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 5000,    // 5 seconds
  socketTimeout: 10000      // 10 seconds
});

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

  try {
    const { name, email, message } = req.body as ContactFormData;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Skip storing in Firestore again since it's already done in the service
    // This prevents duplication and speeds up the process

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_FROM || "your-app@example.com",
      to: process.env.EMAIL_TO || "support@7pailabs.com", // Replace with recipient email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ 
        success: true,
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