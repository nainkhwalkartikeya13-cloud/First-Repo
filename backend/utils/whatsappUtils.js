import twilio from "twilio";

/**
 * WhatsApp Notification Utility
 * Uses Twilio API to send real WhatsApp messages.
 */

export const sendWhatsAppNotification = async (order, user) => {
  // Check if Twilio is configured
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.warn("Twilio credentials not found in .env, skipping real WhatsApp notification.");
    return false;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  // Get phone from shippingAddress (always present, works for both logged-in and guest users)
  let phoneNumber = (order.shippingAddress && order.shippingAddress.phone) || "";
  // Auto-prefix +91 for 10-digit Indian numbers without country code
  if (phoneNumber.length === 10) {
    phoneNumber = "+91" + phoneNumber;
  }

  if (!phoneNumber || phoneNumber.length < 10) {
    console.warn("⚠️ WhatsApp: No valid phone number in shippingAddress, skipping notification.");
    return false;
  }

  // For WhatsApp sandbox, the number must be prefixed with 'whatsapp:'
  const toWhatsAppNumber = phoneNumber.startsWith("whatsapp:") ? phoneNumber : `whatsapp:${phoneNumber}`;

  const orderId = order._id.toString().slice(-8).toUpperCase();
  const totalPrice = order.totalPrice.toLocaleString("en-IN");

  const messageText = `*AEROLITH Order Confirmed!* 🌿
----------------------------
Hi ${user.username},

Your order *#${orderId}* is successfully placed!

*Order Total:* ₹${totalPrice}
*Items:* ${order.orderItems.length}

We're preparing your eco-friendly gear for shipment. You'll receive another update once it's on the way!

Thank you for choosing conscious style.
- Team AEROLITH`;

  try {
    const message = await client.messages.create({
      body: messageText,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: toWhatsAppNumber
    });

    console.log(`🟢 WHATSAPP NOTIFICATION SENT TO ${toWhatsAppNumber} (SID: ${message.sid})`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send WhatsApp message:", error.message);
    return false;
  }
};
