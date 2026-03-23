import { Types } from "mongoose";

export interface IBooking {
  _id?: string;
  user: Types.ObjectId;
  show: Types.ObjectId;
  seats: { row: string; number: number }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPayment {
  _id?: string;
  booking: Types.ObjectId;
  paymentMethod: "Razorpay" | "UPI" | "Card" | "Simulated";
  amount: number;
  status: "success" | "failed" | "pending";
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
