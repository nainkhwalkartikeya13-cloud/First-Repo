import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const authenticate = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

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

// Like authenticate, but does NOT reject unauthenticated requests.
// Sets req.user if a valid token exists, otherwise continues with req.user = null.
const optionalAuthenticate = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
        req.user = null;
    }

    return next();
});

export { authenticate, authorizeAdmin, optionalAuthenticate };
