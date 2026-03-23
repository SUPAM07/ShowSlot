import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  refreshToken: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>("User", userSchema);
