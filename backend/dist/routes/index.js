"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const movie_route_1 = __importDefault(require("../modules/movie/movie.route"));
const theater_routes_1 = __importDefault(require("../modules/theater/theater.routes"));
const show_route_1 = __importDefault(require("../modules/show/show.route"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const booking_route_1 = __importDefault(require("../modules/booking/booking.route"));
const router = express_1.default.Router();
router.use("/movies", movie_route_1.default);
router.use("/theaters", theater_routes_1.default);
router.use("/shows", show_route_1.default);
router.use("/users", user_route_1.default);
router.use("/bookings", booking_route_1.default);
exports.default = router;
