import { Types } from "mongoose";
import { BookingModel, PaymentModel } from "./booking.model";
import { ShowModel } from "../show/show.model";
import createHttpError from "http-errors";

// 1. Create a booking — validate seats, mark as BOOKED, calculate total, create records
export const createBooking = async (
  userId: string,
  showId: string,
  seats: { row: string; number: number }[],
  paymentMethod: string = "Simulated"
) => {
  const show = await ShowModel.findById(showId);
  if (!show) throw createHttpError(404, "Show not found");

  // Validate all requested seats are available
  let totalAmount = 0;

  for (const reqSeat of seats) {
    const rowData = show.seatLayout.find((r: any) => r.row === reqSeat.row);
    if (!rowData) throw createHttpError(400, `Row ${reqSeat.row} not found`);

    const seat = rowData.seats.find((s: any) => s.number === reqSeat.number);
    if (!seat) throw createHttpError(400, `Seat ${reqSeat.row}${reqSeat.number} not found`);
    if (seat.status !== "AVAILABLE") {
      throw createHttpError(409, `Seat ${reqSeat.row}${reqSeat.number} is already ${seat.status}`);
    }

    // Calculate price from priceMap using the row letter as key
    const price = (show.priceMap as any)?.[reqSeat.row] || Object.values(show.priceMap || {})[0] || 0;
    totalAmount += price;
  }

  // Mark seats as BOOKED atomically
  for (const reqSeat of seats) {
    await ShowModel.updateOne(
      { _id: showId, "seatLayout.row": reqSeat.row },
      { $set: { "seatLayout.$.seats.$[elem].status": "BOOKED" } },
      { arrayFilters: [{ "elem.number": reqSeat.number }] }
    );
  }

  // Create booking
  const booking = await BookingModel.create({
    user: new Types.ObjectId(userId),
    show: new Types.ObjectId(showId),
    seats,
    totalAmount,
    status: "confirmed",
  });

  // Simulate payment
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const payment = await PaymentModel.create({
    booking: booking._id,
    paymentMethod,
    amount: totalAmount,
    status: "success",
    transactionId,
  });

  return { booking, payment };
};

// 2. Get bookings by user
export const getBookingsByUser = async (userId: string) => {
  return await BookingModel.find({ user: new Types.ObjectId(userId) })
    .populate({
      path: "show",
      populate: [
        { path: "movie", select: "title posterUrl certification languages format" },
        { path: "theater", select: "name city state location" },
      ],
    })
    .sort({ createdAt: -1 });
};

// 3. Cancel a booking
export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await BookingModel.findOne({ 
    _id: bookingId, 
    user: new Types.ObjectId(userId) 
  });

  if (!booking) throw createHttpError(404, "Booking not found");
  if (booking.status === "cancelled") throw createHttpError(400, "Booking is already cancelled");

  // Revert seat statuses to AVAILABLE
  for (const seat of booking.seats) {
    await ShowModel.updateOne(
      { _id: booking.show, "seatLayout.row": seat.row },
      { $set: { "seatLayout.$.seats.$[elem].status": "AVAILABLE" } },
      { arrayFilters: [{ "elem.number": seat.number }] }
    );
  }

  booking.status = "cancelled";
  await booking.save();

  // Update payment status
  await PaymentModel.updateOne(
    { booking: booking._id },
    { status: "failed" }
  );

  return { message: "Booking cancelled successfully", booking };
};
