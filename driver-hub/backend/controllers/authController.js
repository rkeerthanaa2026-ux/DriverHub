import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// login tabs use driver / employer / admin; the database uses candidate / employer / admin
const ROLE_OF = { driver: "candidate", employer: "employer", admin: "admin" };

const fail = (res, status, message) => {
    res.status(status);
    throw new Error(message);
};

const sendToken = (res, user, status = 200) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(status).json({ user });
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
    const { role, name, email, phone, password, location, licenseType, experienceYears, companyName, industry } = req.body;

    // admins can never be created from the public form
    if (!["candidate", "employer"].includes(role)) fail(res, 400, "Invalid account type.");
    if (!name?.trim() || !email?.trim() || !password) fail(res, 400, "Please fill in all required fields.");
    if (password.length < 6) fail(res, 400, "Password must be at least 6 characters.");
    if (!location?.state || !location?.district || !location?.city || !location?.pin) {
        fail(res, 400, "Please choose a valid State, District, Town and PIN code from the lists.");
    }
    if (role === "candidate" && !licenseType) fail(res, 400, "Please select your license category.");
    if (role === "employer" && (!companyName?.trim() || !industry?.trim())) {
        fail(res, 400, "Please enter your company name and industry.");
    }

    const normalized = email.trim().toLowerCase();
    if (await User.findOne({ email: normalized })) fail(res, 409, "An account with this email already exists.");

    const user = await User.create({
        role,
        name,
        email: normalized,
        phone,
        password,
        location,
        ...(role === "candidate" ? { licenseType, experienceYears: Number(experienceYears) || 0 } : { companyName, industry }),
    });

    sendToken(res, user, 201);
});

// POST /api/auth/login   body: { tab, email, password }
export const login = asyncHandler(async (req, res) => {
    const { tab, email, password } = req.body;
    const role = ROLE_OF[tab];
    if (!role || !email || !password) fail(res, 400, "Invalid email or password for this account type.");

    const user = await User.findOne({ email: email.trim().toLowerCase(), role }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
        fail(res, 401, "Invalid email or password for this account type.");
    }

    sendToken(res, user);
});

// POST /api/auth/logout
export const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Signed out" });
};

// GET /api/auth/me  (returns { user: null } when not signed in, so the page load doesn't log a 401)
export const me = asyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        res.json({ user: user || null });
    } catch {
        res.json({ user: null });
    }
});