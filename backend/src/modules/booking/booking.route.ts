import { Router } from "express";
import * as BookingController from "./booking.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const router = Router();

// All booking routes are protected
router.post("/", verifyToken, BookingController.createBooking);
router.get("/my-bookings", verifyToken, BookingController.getMyBookings);
router.delete("/:id", verifyToken, BookingController.cancelBooking);

export default router;
