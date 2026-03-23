"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.logout = exports.refreshToken = exports.verifyOTP = exports.sendOTP = void 0;
const UserService = __importStar(require("./user.service"));
// 1. Send OTP
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await UserService.sendOTP(email);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.sendOTP = sendOTP;
// 2. Verify OTP
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const result = await UserService.verifyOTP(email, otp);
        // Set tokens in httpOnly cookies
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOTP = verifyOTP;
// 3. Refresh token
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        const result = await UserService.refreshAccessToken(token);
        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000,
        });
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
// 4. Logout
const logout = async (req, res, next) => {
    try {
        await UserService.logout(req.userId);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
// 5. Get profile
const getProfile = async (req, res, next) => {
    try {
        const user = await UserService.getProfile(req.userId);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
// 6. Update profile
const updateProfile = async (req, res, next) => {
    try {
        const user = await UserService.updateProfile(req.userId, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
