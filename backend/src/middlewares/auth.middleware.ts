import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";

// Extend Express Request to include userId and role
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

// Verify JWT access token from cookies or Authorization header
export const verifyToken = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw createHttpError(401, "Access token is required");
    }

    const decoded = jwt.verify(token, config.jwtSecret as string) as {
      userId: string;
      role: string;
    };

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(createHttpError(401, "Access token has expired"));
    }
    next(createHttpError(401, "Invalid access token"));
  }
};

// Restrict to admin role only
export const isAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.userRole !== "admin") {
    return next(createHttpError(403, "Admin access required"));
  }
  next();
};
