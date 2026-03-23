import { z } from "zod";

export const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
  }),
});
