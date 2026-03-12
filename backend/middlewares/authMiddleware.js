import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authenticate = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (process.env.NODE_ENV !== "test") {
        console.log("🔍 Auth Check - Cookie present:", !!token);
        if (!token) {
            console.log("⚠️ No JWT cookie found. Origin:", req.get("origin"));
            console.log("Headers:", JSON.stringify(req.headers, null, 2));
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found." });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed." });
    }
});

const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) return next();
    return res.status(401).json({ message: "Not authorized as an admin." });
};

export { authenticate, authorizeAdmin };
