import express from "express";
const router = express.Router();
import {
    createCoupon,
    getCoupons,
    getActiveCoupons,
    deleteCoupon,
    validateCoupon,
} from "../controllers/couponController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router.get("/active", getActiveCoupons);

router.route("/")
    .post(authenticate, authorizeAdmin, createCoupon)
    .get(authenticate, authorizeAdmin, getCoupons);

router.route("/validate").post(validateCoupon);

router.route("/:id").delete(authenticate, authorizeAdmin, deleteCoupon);

export default router;
