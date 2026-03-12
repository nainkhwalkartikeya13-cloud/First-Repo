import nodemailer from "nodemailer";

// ─── Core Transporter & Sender ────────────────────────────────────────────────

const createTransporter = async () => {
  const hasCustomSMTP =
    (process.env.EMAIL_HOST && process.env.EMAIL_USER) ||
    (process.env.SMTP_HOST && process.env.SMTP_USER);

  if (hasCustomSMTP) {
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
    console.log("📧 Using Custom SMTP:", process.env.SMTP_HOST || process.env.EMAIL_HOST);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || process.env.EMAIL_HOST,
      port,
      secure: port === 465, // true for 465, false for 587/others
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }

  // Fallback: Dynamically create a fresh Ethereal test account (never hardcoded)
  console.log("⚠️  No SMTP env vars found — creating temporary Ethereal test account");
  const testAccount = await nodemailer.createTestAccount();
  console.log("📬 Ethereal test inbox:", `https://ethereal.email/login`);
  console.log("   User:", testAccount.user, "| Pass:", testAccount.pass);

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

const sendEmail = async (options) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "AEROLITH <noreply@aerolith.com>",
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  console.log("📤 Sending email to:", options.email, "| Subject:", options.subject);
  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent successfully to:", options.email);

  // Log Ethereal preview URL in dev (only works for Ethereal accounts)
  if (process.env.NODE_ENV !== "production" && info.messageId) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔗 Preview email at:", previewUrl);
    }
  }
};

// ─── Welcome Email ────────────────────────────────────────────────────────────

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
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/shop" class="button">Explore the Collection</a>
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

  try {
    await sendEmail({ email: user.email, subject: "Welcome to AEROLITH", html });
  } catch (error) {
    // Non-blocking — registration should succeed even if welcome email fails
    console.error("❌ Failed to send welcome email:", error.message);
  }
};

// ─── Order Confirmation Email ─────────────────────────────────────────────────

export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 15px 0; border-bottom: 1px solid #F0F0F0;">
        <div style="font-weight: 600; font-size: 14px; color: #212A2C;">${item.name}</div>
        <div style="font-size: 12px; color: #767676; margin-top: 4px;">Quantity: ${item.qty}</div>
      </td>
      <td style="padding: 15px 0; border-bottom: 1px solid #F0F0F0; text-align: right; font-size: 14px; font-weight: 500;">
        ₹${(item.price * item.qty).toLocaleString("en-IN")}
      </td>
    </tr>
  `
    )
    .join("");

  const orderId = order._id.toString().slice(-8).toUpperCase();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #212A2C; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FFFFFF; }
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
        <div style="text-align: right; margin-bottom: 10px;">
          <span class="order-id">Order #${orderId}</span>
        </div>
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

  try {
    await sendEmail({
      email: user.email,
      subject: `Order Confirmation - #${orderId}`,
      html,
    });
  } catch (error) {
    // Non-blocking — order should be saved even if confirmation email fails
    console.error("❌ Failed to send order confirmation email:", error.message);
  }
};

// ─── OTP / Verification Email ─────────────────────────────────────────────────

export const sendOTPEmail = async (email, otp) => {
  // Always log OTP to console in non-production for easy testing
  if (process.env.NODE_ENV !== "production") {
    console.log("-----------------------------------------");
    console.log(`🔑 REGISTRATION OTP FOR ${email}: ${otp}`);
    console.log("-----------------------------------------");
  }

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
    await sendEmail({ email, subject: "AEROLITH - Verification Code", html });
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    // OTP is logged to console as fallback in dev — never block registration over email
    // In production, throw so the caller can return a meaningful error to the user
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
};
