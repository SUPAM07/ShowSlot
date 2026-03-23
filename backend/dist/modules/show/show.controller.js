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
exports.updateSeatStatus = exports.getShowById = exports.getShowsByMovieDateLocation = exports.createShow = void 0;
const ShowService = __importStar(require("./show.service"));
// 1. Create a new show
const createShow = async (req, res, next) => {
    try {
        const show = await ShowService.createShow(req.body);
        res.status(201).json(show);
    }
    catch (error) {
        next(error);
    }
};
exports.createShow = createShow;
// 2. Get shows filtered by Movie, Date, and State (Location)
const getShowsByMovieDateLocation = async (req, res, next) => {
    try {
        const { movieId, state, date } = req.query;
        const shows = await ShowService.getShowsByMovieDateLocation(movieId, date, state);
        res.status(200).json(shows);
    }
    catch (error) {
        next(error);
    }
};
exports.getShowsByMovieDateLocation = getShowsByMovieDateLocation;
// 3. Get a specific show by its ID
const getShowById = async (req, res, next) => {
    try {
        const show = await ShowService.getShowById(req.params.id);
        res.status(200).json(show);
    }
    catch (error) {
        next(error);
    }
};
exports.getShowById = getShowById;
// 4. Update the status of a specific seat (AVAILABLE | BOOKED | BLOCKED)
const updateSeatStatus = async (req, res, next) => {
    try {
        const { row, seatNumber, status } = req.query;
        const updatedShow = await ShowService.updateSeatStatus(req.params.showId, row, Number(seatNumber), status);
        res.status(201).json(updatedShow);
    }
    catch (error) {
        next(error);
    }
};
exports.updateSeatStatus = updateSeatStatus;
