"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedShow = void 0;
// seed/showSeeder.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dayjs_1 = __importDefault(require("dayjs"));
const movie_model_1 = require("../modules/movie/movie.model");
const theater_model_1 = require("../modules/theater/theater.model");
const show_model_1 = require("../modules/show/show.model");
const config_1 = require("../config/config");
const index_1 = require("../utils/index");
const generatePriceMap = () => new Map([
    ["PREMIUM", 510],
    ["EXECUTIVE", 290],
    ["NORMAL", 270],
]);
const formats = ["2D", "3D", "IMAX", "PVR PXL"];
// 🎞️ Realistic time slots
const fixedTimeSlots = [
    { start: "09:00 AM", end: "11:30 AM" },
    { start: "12:30 PM", end: "03:00 PM" },
    { start: "04:00 PM", end: "06:30 PM" },
    { start: "07:30 PM", end: "10:00 PM" },
    { start: "10:30 PM", end: "01:00 AM" },
];
const toDateWithTime = (baseDate, timeStr) => {
    return (0, dayjs_1.default)(baseDate)
        .hour((0, dayjs_1.default)(timeStr, ["hh:mm A"]).hour())
        .minute((0, dayjs_1.default)(timeStr, ["hh:mm A"]).minute())
        .second(0)
        .toDate();
};
const seedShow = async () => {
    const movies = await movie_model_1.MovieModel.find({});
    const theatres = await theater_model_1.TheaterModel.find({});
    if (!movies.length || !theatres.length) {
        console.error("Movies or theatres not found. Please ensure they are seeded first.");
        return;
    }
    const today = (0, dayjs_1.default)().startOf("day");
    const showsToInsert = [];
    for (const movie of movies) {
        for (const theatre of theatres) {
            // ✅ next 7 days for every movie and theatre combo
            for (let d = 0; d < 7; d++) {
                const showDate = today.add(d, "day");
                const formattedDate = showDate.format("DD-MM-YYYY");
                const numShows = Math.floor(Math.random() * 3) + 2; // 2–4 shows
                const selectedSlots = fixedTimeSlots.slice(0, numShows);
                for (const slot of selectedSlots) {
                    showsToInsert.push({
                        movie: movie._id,
                        theater: theatre._id,
                        location: theatre.state,
                        format: formats[Math.floor(Math.random() * formats.length)],
                        audioType: "Dolby 7.1",
                        startTime: slot.start,
                        date: formattedDate, // ✅ "DD-MM-YYYY"
                        priceMap: generatePriceMap(),
                        seatLayout: (0, index_1.generateSeatLayout)(),
                    });
                }
            }
        }
    }
    console.log(`Inserting ${showsToInsert.length} shows...`);
    // Batch insert to avoid overwhelming memory/db
    const BATCH_SIZE = 1000;
    for (let i = 0; i < showsToInsert.length; i += BATCH_SIZE) {
        const batch = showsToInsert.slice(i, i + BATCH_SIZE);
        await show_model_1.ShowModel.insertMany(batch);
        console.log(`Inserted ${i + batch.length} of ${showsToInsert.length} shows`);
    }
    console.log("✅ Show seeding completed for all movies and theaters.");
};
exports.seedShow = seedShow;
mongoose_1.default
    .connect(config_1.config.databaseUrl)
    .then(async () => {
    console.log("DB connected");
    await show_model_1.ShowModel.deleteMany({});
    console.log("🧹 Existing shows deleted.");
    await (0, exports.seedShow)();
    mongoose_1.default.disconnect();
})
    .catch((err) => console.log(err));
