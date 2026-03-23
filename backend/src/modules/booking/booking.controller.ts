import { Request, Response, NextFunction } from "express";
import * as BookingService from "./booking.service";

// 1. Create booking
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { showId, seats, paymentMethod } = req.body;
    const result = await BookingService.createBooking(
      req.userId as string,
      showId,
      seats,
      paymentMethod
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// 2. Get my bookings
export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await BookingService.getBookingsByUser(req.userId as string);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// 3. Cancel booking
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BookingService.cancelBooking(req.params.id as string, req.userId as string);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
