import nodemailer from "nodemailer";

// ─── Primary: Brevo HTTP API (works on Railway — no SMTP port blocking) ────────
const sendViaBrevoAPI = async (options) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "AEROLITH", email: process.env.EMAIL_FROM || "noreply@aerolith.com" },
      to: [{ email: options.email }],
      subject: options.subject,
      htmlContent: options.html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${err}`);
  }
};

// ─── Fallback: Nodemailer SMTP (for local dev only) ────────────────────────────
const sendEmail = async (options) => {
  // Use Brevo HTTP API in production (avoids SMTP port blocking on Railway)
  if (process.env.BREVO_API_KEY) {
    console.log(`📧 Using Brevo HTTP API → ${options.email} | ${options.subject}`);
    await sendViaBrevoAPI(options);
    console.log("✅ Email sent via Brevo API to:", options.email);
    return;
  }

  // FALLBACK: SMTP via nodemailer (local dev)
  let transporter;
  if ((process.env.EMAIL_HOST && process.env.EMAIL_USER) || (process.env.SMTP_HOST && process.env.SMTP_USER)) {
    const smtpHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const useSecure = smtpPort === 465;

    console.log(`📧 Using SMTP: ${smtpHost}:${smtpPort} user=${smtpUser}`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: useSecure,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
    });
  } else {
    console.log("⚠️ No email config found — logging only (no email sent)");
    return;
  }

  console.log("📤 Sending email to:", options.email, "| Subject:", options.subject);

  const mailOptions = {
    from: `AEROLITH <noreply@aerolith.com>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // SEND EMAIL
  await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully to:", options.email);
};

export { sendEmail };

export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #212A2C; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FFFFFF; }
        .header { text-align: center; padding-bottom: 40px; border-bottom: 1px solid #F0F0F0; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: -0.02em; color: #212A2C; text-decoration: none; }
        .content { padding: 40px 0; line-height: 1.6; }
        .title { font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #212A2C; }
        .button { display: inline-block; background-color: #212A2C; color: #FFFFFF !important; padding: 16px 32px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 4px; margin: 20px 0; text-transform: uppercase; letter-spacing: 0.1em; }
        .footer { padding-top: 40px; border-top: 1px solid #F0F0F0; color: #767676; font-size: 12px; text-align: center; }
        .tagline { font-style: italic; color: #999; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">AEROLITH</a>
        </div>
        <div class="content">
          <h1 class="title">Welcome to the inner circle, ${user.username}.</h1>
          <p>Thank you for joining AEROLITH. We believe that luxury shouldn't come at the cost of the planet. By choosing us, you're supporting sustainable craftsmanship and transparent design.</p>
          <p>Your journey towards conscious style starts here.</p>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" class="button">Explore the Collection</a>
          </div>
        </div>
        <div class="footer">
          <p class="tagline">Eco-friendly. Carbon Neutral. Better Things, In a Better Way.</p>
          <p>&copy; ${new Date().getFullYear()} AEROLITH. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: "Welcome to AEROLITH",
    html,
  });
};

export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #F0F0F0;">
        <div style="font-weight: 600; font-size: 14px; color: #212A2C;">${item.name}</div>
        <div style="font-size: 12px; color: #767676; margin-top: 4px;">Quantity: ${item.qty}</div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #F0F0F0; text-align: right; font-size: 14px; font-weight: 500;">
        ₹${(item.price * item.qty).toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #212A2C; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FFFFFF; }
        .header { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 30px; border-bottom: 2px solid #212A2C; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #212A2C; text-decoration: none; }
        .order-id { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; }
        .status-badge { display: inline-block; background-color: #E8F5E9; color: #2E7D32; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 700; margin: 0 0 10px 0; }
        .table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .total-row td { padding-top: 20px; font-weight: 700; font-size: 18px; }
        .address-box { background-color: #F9F9F8; padding: 25px; border-radius: 8px; margin-top: 40px; }
        .footer { padding-top: 40px; border-top: 1px solid #F0F0F0; color: #767676; font-size: 11px; text-align: center; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: right; margin-bottom: 10px;"><span class="order-id">Order #${order._id.toString().slice(-8).toUpperCase()}</span></div>
        <div style="border-bottom: 1px solid #F0F0F0; padding-bottom: 20px; margin-bottom: 30px;">
          <span class="status-badge">Confirmed</span>
          <h1 class="title">It's official, ${user.username}.</h1>
          <p style="margin: 0; color: #767676; font-size: 15px;">We've received your order and we're getting it ready for shipment.</p>
        </div>
        
        <table class="table">
          ${itemsHtml}
          <tr class="total-row">
            <td style="text-align: right; color: #767676; font-size: 14px; font-weight: 400;">Total Paid</td>
            <td style="text-align: right;">₹${order.totalPrice.toLocaleString("en-IN")}</td>
          </tr>
        </table>

        <div class="address-box">
          <p style="text-transform: uppercase; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #999; margin-bottom: 12px; margin-top: 0;">Shipping Address</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.5;">
            <strong>${user.username}</strong><br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <div class="footer">
          <p>Questions? We're here to help. Just reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} AEROLITH. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
  });
};

export const sendOTPEmail = async (email, otp) => {
  // 🚀 TEMPORARY WORKAROUND: Always log OTP to console so you can register without SMTP
  console.log("-----------------------------------------");
  console.log(`🔑 REGISTRATION OTP FOR ${email}: ${otp}`);
  console.log("-----------------------------------------");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #212A2C; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FFFFFF; }
        .header { text-align: center; padding-bottom: 40px; border-bottom: 1px solid #F0F0F0; }
        .logo { font-size: 28px; font-weight: bold; letter-spacing: -0.02em; color: #212A2C; text-decoration: none; }
        .content { padding: 40px 0; line-height: 1.6; text-align: center; }
        .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 0.2em; color: #212A2C; background: #F9F9F8; padding: 20px; border-radius: 8px; margin: 30px 0; display: inline-block; }
        .footer { padding-top: 40px; border-top: 1px solid #F0F0F0; color: #767676; font-size: 12px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">AEROLITH</div>
        </div>
        <div class="content">
          <h2>Verify your email</h2>
          <p>Please use the following code to complete your registration at AEROLITH. This code will expire in 5 minutes.</p>
          <div class="otp-code">${otp}</div>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} AEROLITH. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      email,
      subject: "AEROLITH - Verification Code",
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    console.error("⚠️ REGISTRATION UNBLOCKED: Check the Railway logs above for the 6-digit OTP code.");
    // We purposefully do NOT throw the error here anymore.
    // This allows the frontend to advance to the OTP entry screen.
  }
};
