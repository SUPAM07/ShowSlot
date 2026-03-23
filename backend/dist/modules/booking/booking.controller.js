"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelBooking = exports.getMyBookings = exports.createBooking = void 0;
const BookingService = __importStar(require("./booking.service"));
// 1. Create booking
const createBooking = async (req, res, next) => {
    try {
        const { showId, seats, paymentMethod } = req.body;
        const result = await BookingService.createBooking(req.userId, showId, seats, paymentMethod);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.createBooking = createBooking;
// 2. Get my bookings
const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await BookingService.getBookingsByUser(req.userId);
        res.status(200).json(bookings);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyBookings = getMyBookings;
// 3. Cancel booking
const cancelBooking = async (req, res, next) => {
    try {
        const result = await BookingService.cancelBooking(req.params.id, req.userId);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.cancelBooking = cancelBooking;
