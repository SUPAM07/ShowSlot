"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupShowsByTheatreAndMovie = exports.generateSeatLayout = exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const generateSeatLayout = () => {
    return [
        {
            row: "E",
            type: "PREMIUM",
            price: 510,
            seats: Array.from({ length: 10 }, (_, i) => ({
                number: i + 1,
                status: "AVAILABLE",
            })),
        },
        {
            row: "D",
            type: "EXECUTIVE",
            price: 290,
            seats: Array.from({ length: 20 }, (_, i) => ({
                number: i + 1,
                status: "AVAILABLE",
            })),
        },
        {
            row: "C",
            type: "EXECUTIVE",
            price: 290,
            seats: Array.from({ length: 20 }, (_, i) => ({
                number: i + 1,
                status: "AVAILABLE",
            })),
        },
        {
            row: "B",
            type: "EXECUTIVE",
            price: 290,
            seats: Array.from({ length: 20 }, (_, i) => ({
                number: i + 1,
                status: "AVAILABLE",
            })),
        },
        {
            row: "A",
            type: "NORMAL",
            price: 180,
            seats: Array.from({ length: 20 }, (_, i) => ({
                number: i + 1,
                status: "AVAILABLE",
            })),
        },
    ];
};
exports.generateSeatLayout = generateSeatLayout;
// Grouping function
const groupShowsByTheatreAndMovie = (shows) => {
    const grouped = {};
    shows.forEach((show) => {
        const movieId = show.movie._id;
        const theaterId = show.theater._id;
        const key = `${movieId}_${theaterId}`;
        if (!grouped[key]) {
            grouped[key] = {
                movie: show.movie,
                theater: {
                    theaterDetails: show.theater,
                    shows: [],
                },
            };
        }
        grouped[key].theater.shows.push({
            _id: show._id ?? "",
            date: show.date ?? "",
            startTime: show.startTime ?? "",
            format: show.format ?? "",
            audioType: show.audioType ?? "",
        });
    });
    return Object.values(grouped);
};
exports.groupShowsByTheatreAndMovie = groupShowsByTheatreAndMovie;
