import express from "express";
import { sendEmail } from "../utils/emailUtils.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, orderNumber, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Please provide name, email, and message." });
    }

    // Always log the submission so nothing is lost even if email fails
    console.log("📬 Contact Form Submission:");
    console.log(`  From: ${name} <${email}>`);
    console.log(`  Order: ${orderNumber || "N/A"}`);
    console.log(`  Message: ${message}`);

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Order Number:</strong> ${orderNumber || "N/A"}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    const adminEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

    if (adminEmail) {
        try {
            await sendEmail({
                email: adminEmail,
                subject: `New Contact Request from ${name}`,
                html,
            });
            console.log("✅ Contact form email sent to:", adminEmail);
        } catch (emailError) {
            // Log the error but don't fail the request — submission was already logged above
            console.error("⚠️ Contact email failed (submission still logged above):", emailError.message);
        }
    } else {
        console.warn("⚠️ No admin email configured (EMAIL_FROM / SMTP_USER). Submission logged above.");
    }

    // Always return success — the user's message was received
    res.status(200).json({ message: "Message sent successfully!" });
});

export default router;
