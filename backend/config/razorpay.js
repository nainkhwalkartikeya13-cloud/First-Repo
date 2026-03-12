// config/razorpay.js
// Lazily create the Razorpay instance so that this module can be
// safely imported at the top level even before dotenv has run.
import Razorpay from "razorpay";

let _razorpay = null;

const getRazorpay = () => {
  if (_razorpay) return _razorpay;

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("❌ Razorpay keys are missing in .env");
  }

  _razorpay = new Razorpay({ key_id, key_secret });
  return _razorpay;
};

export default getRazorpay;