import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },

    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String }, // Optional to support accessories with no size
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      apartment: { type: String },
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    // 🔥 Razorpay-specific field (VERY IMPORTANT)
    razorpayOrderId: {
      type: String,
    },

    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: {
      type: Date,
    },
    isProcessing: {
      type: Boolean,
      required: true,
      default: false,
    },
    processedAt: {
      type: Date,
    },
    isShipped: {
      type: Boolean,
      required: true,
      default: false,
    },
    shippedAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
    isCancelled: {
      type: Boolean,
      required: true,
      default: false,
    },
    cancelledAt: {
      type: Date,
    },
    statusRecord: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        message: { type: String },
      },
    ],
    returnRequest: {
      isRequested: { type: Boolean, default: false },
      requestType: { type: String, enum: ["Return", "Exchange", null], default: null },
      reason: { type: String },
      status: { type: String, enum: ["Pending", "Approved", "Rejected", "Completed", null], default: null },
      requestedAt: { type: Date },
      adminComment: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
