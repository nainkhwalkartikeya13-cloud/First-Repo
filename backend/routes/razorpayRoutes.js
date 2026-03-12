import express from "express";
import crypto from "crypto";
import getRazorpay from "../config/razorpay.js";
import Order from "../models/orderModel.js";

const router = express.Router();

// ✅ Create Razorpay order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, mongoOrderId } = req.body;

    if (!amount || !mongoOrderId)
      return res.status(400).json({ message: "Amount and Order ID required" });

    const order = await Order.findById(mongoOrderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: mongoOrderId,
    };

    const razorpayOrder = await getRazorpay().orders.create(options);

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error.message);
    res.status(500).json({ message: error.message || "Failed to create Razorpay order" });
  }
});

// ✅ Verify Razorpay payment
router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mongoOrderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !mongoOrderId)
    return res.status(400).json({ message: "Missing payment details" });

  const order = await Order.findById(mongoOrderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.razorpayOrderId !== razorpay_order_id)
    return res.status(400).json({ message: "Order ID mismatch" });

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Invalid signature" });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = { id: razorpay_payment_id, status: "paid" };
  await order.save();

  res.status(200).json({ success: true, message: "Payment verified" });
});

export default router;
