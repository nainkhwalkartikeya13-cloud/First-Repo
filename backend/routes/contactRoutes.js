import express from "express";
import { sendEmail } from "../utils/emailUtils.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, orderNumber, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Please provide name, email, and message." });
        }

        const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Order Number:</strong> ${orderNumber || "N/A"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

        // Send email to the store owner (admin)
        // using the owner's email from environment variables, or fallback to the generic sender
        const adminEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;

        await sendEmail({
            email: adminEmail,
            subject: `New Contact Request from ${name}`,
            html,
        });

        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ message: "Failed to send message. Please try again later." });
    }
});

export default router;
