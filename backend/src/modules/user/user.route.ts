import { Router } from "express";
import * as UserController from "./user.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate";
import { sendOtpSchema, verifyOtpSchema, updateProfileSchema } from "./user.validation";

const router = Router();

// Public routes
router.post("/send-otp", validate(sendOtpSchema), UserController.sendOTP);
router.post("/verify-otp", validate(verifyOtpSchema), UserController.verifyOTP);
router.post("/refresh-token", UserController.refreshToken);

// Protected routes
router.post("/logout", verifyToken, UserController.logout);
router.get("/profile", verifyToken, UserController.getProfile);
router.put("/profile", verifyToken, validate(updateProfileSchema), UserController.updateProfile);

export default router;
