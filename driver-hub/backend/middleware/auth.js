import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401);
        throw new Error("Please sign in to continue.");
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        res.status(401);
        throw new Error("Your session has expired. Please sign in again.");
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        res.status(401);
        throw new Error("Account no longer exists.");
    }
    req.user = user;
    next();
});

// usage: router.get("/x", protect, requireRole("admin"), handler)
export const requireRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        res.status(403);
        return next(new Error("You do not have permission to do this."));
    }
    next();
};