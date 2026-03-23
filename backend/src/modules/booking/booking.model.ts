import mongoose, { Schema } from "mongoose";
import { IBooking, IPayment } from "./booking.interface";

const bookingSchema = new Schema<IBooking>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  show: { type: Schema.Types.ObjectId, ref: "Show", required: true },
  seats: [{
    row: { type: String, required: true },
    number: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
}, { timestamps: true });

export const BookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

// Payment model
const paymentSchema = new Schema<IPayment>({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  paymentMethod: { 
    type: String, 
    enum: ["Razorpay", "UPI", "Card", "Simulated"], 
    default: "Simulated" 
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["success", "failed", "pending"], 
    default: "pending" 
  },
  transactionId: { type: String, default: null },
}, { timestamps: true });

export const PaymentModel = mongoose.model<IPayment>("Payment", paymentSchema);
