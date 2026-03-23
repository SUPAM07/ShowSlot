import { Request, Response, NextFunction } from "express";
import * as UserService from "./user.service";

// 1. Send OTP
export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await UserService.sendOTP(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// 2. Verify OTP
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};

// 3. Refresh token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
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
  } catch (error) {
    next(error);
  }
};

// 4. Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserService.logout(req.userId as string);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// 5. Get profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getProfile(req.userId as string);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 6. Update profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.updateProfile(req.userId as string, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
