import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { sendOrderConfirmationEmail } from "../utils/emailUtils.js";
import { sendWhatsAppNotification } from "../utils/whatsappUtils.js";

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // Free shipping over ₹4,999, else ₹99
  const shippingPrice = itemsPrice >= 4999 ? 0 : 99;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

// @desc    Create a new order
// @route   POST /api/v1/orders
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      guestEmail, // Passed from frontend if guest
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      // Only include fields the Order schema expects
      return {
        name: matchingItemFromDB.name,
        qty: Number(itemFromClient.qty),
        image:
          itemFromClient.image ||
          (itemFromClient.images && itemFromClient.images[0]) ||
          matchingItemFromDB.image ||
          (matchingItemFromDB.images && matchingItemFromDB.images[0]) ||
          "",
        price:
          matchingItemFromDB.discountPrice > 0
            ? matchingItemFromDB.discountPrice
            : matchingItemFromDB.price,
        size: itemFromClient.size,
        product: matchingItemFromDB._id,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const orderData = {
      orderItems: dbOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    } else {
      // Store email in shipping address for guest users
      orderData.shippingAddress.email = guestEmail || shippingAddress.email;
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();

    // Trigger Notifications & Award Points (Async)
    (async () => {
      try {
        if (req.user && req.user._id) {
          const user = await User.findById(req.user._id);
          if (user) {
            // Award Loyalty Points (1 point per ₹100)
            const pointsEarned = Math.floor(createdOrder.totalPrice / 100);
            user.points = (user.points || 0) + pointsEarned;
            await user.save();

            console.log(`✨ LuxeClub: ${user.username} earned ${pointsEarned} points.`);

            await sendOrderConfirmationEmail(createdOrder, user);
            // Send WhatsApp (Simulated)
            await sendWhatsAppNotification(createdOrder, user);
          }
        } else if (orderData.shippingAddress.email) {
          // Guest User Notification
          const guestObj = { email: orderData.shippingAddress.email, username: shippingAddress.firstName || "Guest" };
          await sendOrderConfirmationEmail(createdOrder, guestObj);
          await sendWhatsAppNotification(createdOrder, guestObj);
        }
      } catch (err) {
        console.error("Order notification/loyalty error:", err.message);
      }
    })();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order creation error:", error.message);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// @desc    Get all the orders
// @route   GET /api/v1/orders

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get the user orders
// @route   GET /api/v1/orders/mine
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Count total orders
// @route   GET /api/v1/orders/total-orders
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Total sales
// @route   GET /api/v1/orders/total-sales
const calculateTotalSales = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]);
    const totalSales = result.length > 0 ? result[0].totalSales : 0;
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Total sales by date
// @route   GET /api/v1/orders/total-sales-by-date
const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Order by id
// @route   GET /api/v1/orders/:id
const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      // Allow if admin, OR if it's the user's order, OR if it's a guest order (no user field)
      const isOwner = req.user && order.user && req.user._id.toString() === order.user._id.toString();
      const isAdmin = req.user && req.user.isAdmin;
      const isGuestOrder = !order.user;

      if (isOwner || isAdmin || isGuestOrder) {
        return res.json(order);
      } else {
        res.status(403);
        throw new Error("Not authorized to view this order");
      }
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Mark as paid
// @route   GET /api/v1/orders/:id/pay
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer ? req.body.payer.email_address : req.body.email_address,
      };

      const updateOrder = await order.save();

      // Send Order Confirmation Email
      try {
        const user = await User.findById(order.user);
        if (user) {
          await sendOrderConfirmationEmail(updateOrder, user);
        }
      } catch (emailErr) {
        console.error("Order Confirmation Email error:", emailErr.message);
      }

      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Mark as paid
// @route   GET /api/v1/orders/:id/deliver (@Admin only)
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Mark as processing
// @route   PUT /api/v1/orders/:id/process (@Admin only)
const markOrderAsProcessing = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isProcessing = true;
      order.processedAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Mark as shipped
// @route   PUT /api/v1/orders/:id/ship (@Admin only)
const markOrderAsShipped = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isShipped = true;
      order.shippedAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get top selling products
// @route   GET /api/v1/orders/top-selling
const getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalQty: { $sum: "$orderItems.qty" },
          totalRevenue: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);
    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get monthly revenue growth
// @route   GET /api/v1/orders/revenue-growth
const getMonthlyRevenueGrowth = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthRevenue = await Order.aggregate([
      { $match: { isPaid: true, paidAt: { $gte: startOfCurrentMonth } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          paidAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const current = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].total : 0;
    const last = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;

    let growth = 0;
    if (last > 0) {
      growth = ((current - last) / last) * 100;
    } else {
      growth = current > 0 ? 100 : 0;
    }

    res.json({
      currentMonthRevenue: current,
      lastMonthRevenue: last,
      growth: growth.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Cancel order
// @route   PUT /api/v1/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.isCancelled) {
        res.status(400);
        throw new Error("Order is already cancelled");
      }

      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffInHours = (now - orderDate) / (1000 * 60 * 60);

      if (diffInHours > 24) {
        res.status(400);
        throw new Error("Cancellation is only allowed within 24 hours of order placement");
      }

      if (order.isShipped || order.isDelivered) {
        res.status(400);
        throw new Error("Cannot cancel an order that has already been shipped or delivered");
      }

      order.isCancelled = true;
      order.cancelledAt = Date.now();
      order.statusRecord.push({
        status: "Cancelled",
        message: "Order cancelled by user",
      });

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Request return/exchange
// @route   PUT /api/v1/orders/:id/return
const requestReturnOrExchange = async (req, res) => {
  try {
    const { type, reason } = req.body; // type: "Return" or "Exchange"
    const order = await Order.findById(req.params.id);

    if (order) {
      if (!order.isDelivered) {
        res.status(400);
        throw new Error("Can only request return/exchange for delivered orders");
      }

      if (order.returnRequest.isRequested) {
        res.status(400);
        throw new Error("A return or exchange has already been requested for this order");
      }

      order.returnRequest = {
        isRequested: true,
        requestType: type,
        reason: reason,
        status: "Pending",
        requestedAt: Date.now(),
      };

      order.statusRecord.push({
        status: `${type} Requested`,
        message: `User requested ${type.toLowerCase()}. Reason: ${reason}`,
      });

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Update return status (Admin)
// @route   PUT /api/v1/orders/:id/return-status
const updateReturnStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (!order.returnRequest.isRequested) {
        res.status(400);
        throw new Error("No return/exchange request found for this order");
      }

      order.returnRequest.status = status;
      order.returnRequest.adminComment = adminComment;

      order.statusRecord.push({
        status: `Return ${status}`,
        message: `Admin updated return status to ${status}. Comment: ${adminComment}`,
      });

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc     Check if user purchased a product
// @route   GET /api/v1/orders/check-purchase/:productId
const checkIfPurchased = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      isPaid: true,
      "orderItems.product": req.params.productId,
    });

    res.json({ purchased: orders.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  markOrderAsProcessing,
  markOrderAsShipped,
  getTopSellingProducts,
  getMonthlyRevenueGrowth,
  cancelOrder,
  requestReturnOrExchange,
  updateReturnStatus,
  checkIfPurchased,
};
