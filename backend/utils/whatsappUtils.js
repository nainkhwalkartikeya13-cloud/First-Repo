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

  // Format the phone number (assuming typical 10-digit Indian numbers for test if without country code)
  let phoneNumber = user.phone || "";
  // In a real app, users should provide country code. Fallback to +91 just for test scenarios if 10 digits.
  if (phoneNumber.length === 10) {
    phoneNumber = "+91" + phoneNumber;
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
