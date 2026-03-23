"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getBookingsByUser = exports.createBooking = void 0;
const mongoose_1 = require("mongoose");
const booking_model_1 = require("./booking.model");
const show_model_1 = require("../show/show.model");
const http_errors_1 = __importDefault(require("http-errors"));
// 1. Create a booking — validate seats, mark as BOOKED, calculate total, create records
const createBooking = async (userId, showId, seats, paymentMethod = "Simulated") => {
    const show = await show_model_1.ShowModel.findById(showId);
    if (!show)
        throw (0, http_errors_1.default)(404, "Show not found");
    // Validate all requested seats are available
    let totalAmount = 0;
    for (const reqSeat of seats) {
        const rowData = show.seatLayout.find((r) => r.row === reqSeat.row);
        if (!rowData)
            throw (0, http_errors_1.default)(400, `Row ${reqSeat.row} not found`);
        const seat = rowData.seats.find((s) => s.number === reqSeat.number);
        if (!seat)
            throw (0, http_errors_1.default)(400, `Seat ${reqSeat.row}${reqSeat.number} not found`);
        if (seat.status !== "AVAILABLE") {
            throw (0, http_errors_1.default)(409, `Seat ${reqSeat.row}${reqSeat.number} is already ${seat.status}`);
        }
        // Calculate price from priceMap using the row letter as key
        const price = show.priceMap?.[reqSeat.row] || Object.values(show.priceMap || {})[0] || 0;
        totalAmount += price;
    }
    // Mark seats as BOOKED atomically
    for (const reqSeat of seats) {
        await show_model_1.ShowModel.updateOne({ _id: showId, "seatLayout.row": reqSeat.row }, { $set: { "seatLayout.$.seats.$[elem].status": "BOOKED" } }, { arrayFilters: [{ "elem.number": reqSeat.number }] });
    }
    // Create booking
    const booking = await booking_model_1.BookingModel.create({
        user: new mongoose_1.Types.ObjectId(userId),
        show: new mongoose_1.Types.ObjectId(showId),
        seats,
        totalAmount,
        status: "confirmed",
    });
    // Simulate payment
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const payment = await booking_model_1.PaymentModel.create({
        booking: booking._id,
        paymentMethod,
        amount: totalAmount,
        status: "success",
        transactionId,
    });
    return { booking, payment };
};
exports.createBooking = createBooking;
// 2. Get bookings by user
const getBookingsByUser = async (userId) => {
    return await booking_model_1.BookingModel.find({ user: new mongoose_1.Types.ObjectId(userId) })
        .populate({
        path: "show",
        populate: [
            { path: "movie", select: "title posterUrl certification languages format" },
            { path: "theater", select: "name city state location" },
        ],
    })
        .sort({ createdAt: -1 });
};
exports.getBookingsByUser = getBookingsByUser;
// 3. Cancel a booking
const cancelBooking = async (bookingId, userId) => {
    const booking = await booking_model_1.BookingModel.findOne({
        _id: bookingId,
        user: new mongoose_1.Types.ObjectId(userId)
    });
    if (!booking)
        throw (0, http_errors_1.default)(404, "Booking not found");
    if (booking.status === "cancelled")
        throw (0, http_errors_1.default)(400, "Booking is already cancelled");
    // Revert seat statuses to AVAILABLE
    for (const seat of booking.seats) {
        await show_model_1.ShowModel.updateOne({ _id: booking.show, "seatLayout.row": seat.row }, { $set: { "seatLayout.$.seats.$[elem].status": "AVAILABLE" } }, { arrayFilters: [{ "elem.number": seat.number }] });
    }
    booking.status = "cancelled";
    await booking.save();
    // Update payment status
    await booking_model_1.PaymentModel.updateOne({ booking: booking._id }, { status: "failed" });
    return { message: "Booking cancelled successfully", booking };
};
exports.cancelBooking = cancelBooking;
