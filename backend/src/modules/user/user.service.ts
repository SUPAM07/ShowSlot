import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserModel } from "./user.model";
import { config } from "../../config/config";
import { sendOtpEmail } from "../../utils/email";
import createHttpError from "http-errors";

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP with crypto for secure storage
const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Generate access + refresh JWT tokens
const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    config.jwtSecret as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { userId, role },
    config.jwtRefreshSecret as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// 1. Send OTP to email
export const sendOTP = async (email: string) => {
  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Find or create user
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({ email, otp: hashedOtp, otpExpiry });
  } else {
    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;
    await user.save();
  }

  // Send OTP via email
  await sendOtpEmail(email, otp);

  return { message: "OTP sent successfully" };
};

// 2. Verify OTP and issue tokens
export const verifyOTP = async (email: string, otp: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  if (!user.otp || !user.otpExpiry) {
    throw createHttpError(400, "No OTP request found. Please request a new OTP.");
  }

  // Check expiry
  if (new Date() > user.otpExpiry) {
    throw createHttpError(400, "OTP has expired. Please request a new one.");
  }

  // Compare hashed OTP
  const hashedInputOtp = hashOTP(otp);
  if (hashedInputOtp !== user.otp) {
    throw createHttpError(400, "Invalid OTP");
  }

  // Clear OTP fields
  user.otp = undefined as any;
  user.otpExpiry = undefined as any;

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id!.toString(), user.role);

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

// 3. Refresh access token
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret as string) as {
      userId: string;
      role: string;
    };

    const user = await UserModel.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      throw createHttpError(401, "Invalid refresh token");
    }

    const tokens = generateTokens(user._id!.toString(), user.role);

    // Rotate refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  } catch (err) {
    throw createHttpError(401, "Invalid or expired refresh token");
  }
};

// 4. Logout — clear refresh token
export const logout = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  return { message: "Logged out successfully" };
};

// 5. Get user profile
export const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-otp -otpExpiry -refreshToken");
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  return user;
};

// 6. Update user profile
export const updateProfile = async (userId: string, data: { name?: string; phone?: string }) => {
  const user = await UserModel.findByIdAndUpdate(userId, data, { new: true }).select("-otp -otpExpiry -refreshToken");
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  return user;
};
