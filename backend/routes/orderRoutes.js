import express from "express";
const router = express.Router();
import { authenticate, authorizeAdmin, optionalAuthenticate } from "../middlewares/authMiddleware.js";
import {
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
} from "../controllers/orderController.js";

router
  .route("/")
  .post(optionalAuthenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(authenticate, authorizeAdmin, countTotalOrders);
router.route("/total-sales").get(authenticate, authorizeAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(authenticate, authorizeAdmin, calculateTotalSalesByDate);
router.route("/top-selling").get(authenticate, authorizeAdmin, getTopSellingProducts);
router.route("/revenue-growth").get(authenticate, authorizeAdmin, getMonthlyRevenueGrowth);

router.route("/check-purchase/:productId").get(authenticate, checkIfPurchased);
router.route("/:id").get(optionalAuthenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/cancel").put(authenticate, cancelOrder);
router.route("/:id/return").put(authenticate, requestReturnOrExchange);
router.route("/:id/return-status").put(authenticate, authorizeAdmin, updateReturnStatus);

router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

router
  .route("/:id/process")
  .put(authenticate, authorizeAdmin, markOrderAsProcessing);

router
  .route("/:id/ship")
  .put(authenticate, authorizeAdmin, markOrderAsShipped);

export default router;

