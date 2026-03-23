import { Types } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  refreshToken?: string;
  otp?: string;
  otpExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
