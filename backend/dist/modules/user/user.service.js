"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.logout = exports.refreshAccessToken = exports.verifyOTP = exports.sendOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const config_1 = require("../../config/config");
const email_1 = require("../../utils/email");
const http_errors_1 = __importDefault(require("http-errors"));
// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Hash OTP with crypto for secure storage
const hashOTP = (otp) => {
    return crypto_1.default.createHash("sha256").update(otp).digest("hex");
};
// Generate access + refresh JWT tokens
const generateTokens = (userId, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, role }, config_1.config.jwtSecret, { expiresIn: "1h" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId, role }, config_1.config.jwtRefreshSecret, { expiresIn: "7d" });
    return { accessToken, refreshToken };
};
// 1. Send OTP to email
const sendOTP = async (email) => {
    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    // Find or create user
    let user = await user_model_1.UserModel.findOne({ email });
    if (!user) {
        user = await user_model_1.UserModel.create({ email, otp: hashedOtp, otpExpiry });
    }
    else {
        user.otp = hashedOtp;
        user.otpExpiry = otpExpiry;
        await user.save();
    }
    // Send OTP via email
    await (0, email_1.sendOtpEmail)(email, otp);
    return { message: "OTP sent successfully" };
};
exports.sendOTP = sendOTP;
// 2. Verify OTP and issue tokens
const verifyOTP = async (email, otp) => {
    const user = await user_model_1.UserModel.findOne({ email });
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    if (!user.otp || !user.otpExpiry) {
        throw (0, http_errors_1.default)(400, "No OTP request found. Please request a new OTP.");
    }
    // Check expiry
    if (new Date() > user.otpExpiry) {
        throw (0, http_errors_1.default)(400, "OTP has expired. Please request a new one.");
    }
    // Compare hashed OTP
    const hashedInputOtp = hashOTP(otp);
    if (hashedInputOtp !== user.otp) {
        throw (0, http_errors_1.default)(400, "Invalid OTP");
    }
    // Clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.role);
    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();
    return {
        accessToken,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
};
exports.verifyOTP = verifyOTP;
// 3. Refresh access token
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.config.jwtRefreshSecret);
        const user = await user_model_1.UserModel.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            throw (0, http_errors_1.default)(401, "Invalid refresh token");
        }
        const tokens = generateTokens(user._id.toString(), user.role);
        // Rotate refresh token
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return tokens;
    }
    catch (err) {
        throw (0, http_errors_1.default)(401, "Invalid or expired refresh token");
    }
};
exports.refreshAccessToken = refreshAccessToken;
// 4. Logout — clear refresh token
const logout = async (userId) => {
    await user_model_1.UserModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { message: "Logged out successfully" };
};
exports.logout = logout;
// 5. Get user profile
const getProfile = async (userId) => {
    const user = await user_model_1.UserModel.findById(userId).select("-otp -otpExpiry -refreshToken");
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    return user;
};
exports.getProfile = getProfile;
// 6. Update user profile
const updateProfile = async (userId, data) => {
    const user = await user_model_1.UserModel.findByIdAndUpdate(userId, data, { new: true }).select("-otp -otpExpiry -refreshToken");
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    return user;
};
exports.updateProfile = updateProfile;
