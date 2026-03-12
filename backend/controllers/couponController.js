import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

// @desc    Create a new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, expiryDate } = req.body;

    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
        res.status(400);
        throw new Error("Coupon already exists");
    }

    const coupon = await Coupon.create({
        code: code.toUpperCase(),
        discount,
        expiryDate,
    });

    res.status(201).json(coupon);
});

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await Coupon.deleteOne({ _id: coupon._id });
        res.json({ message: "Coupon removed" });
    } else {
        res.status(404);
        throw new Error("Coupon not found");
    }
});

// @desc    Validate a coupon code
// @route   POST /api/v1/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
    });

    if (coupon) {
        res.json({
            code: coupon.code,
            discount: coupon.discount
        });
    } else {
        res.status(400);
        throw new Error("Invalid or expired coupon code");
    }
});

// @desc    Get all active coupons
// @route   GET /api/v1/coupons/active
// @access  Public
const getActiveCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({
        isActive: true,
        expiryDate: { $gt: new Date() }
    });
    res.json(coupons);
});

export {
    createCoupon,
    getCoupons,
    getActiveCoupons,
    deleteCoupon,
    validateCoupon
};
