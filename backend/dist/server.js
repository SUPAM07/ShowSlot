"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config/config");
const db_1 = __importDefault(require("./config/db"));
const startServer = async () => {
    const port = config_1.config.port;
    await (0, db_1.default)();
    // Wrap Express with HTTP server for Socket.IO
    const httpServer = (0, http_1.createServer)(app_1.default);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
            credentials: true,
        },
    });
    // In-memory store for locked seats: Map<showId, Map<seatId, userId>>
    const lockedSeats = new Map();
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // User joins a show room
        socket.on("join-show", ({ showId }) => {
            socket.join(showId);
            console.log(`Socket ${socket.id} joined show room: ${showId}`);
            // Send existing locked seats to the new user
            const showLocks = lockedSeats.get(showId);
            if (showLocks) {
                socket.emit("locked-seats-initials", {
                    seatIds: Array.from(showLocks.keys()),
                });
            }
        });
        // Lock seats
        socket.on("lock-seats", ({ showId, seatIds, userId }) => {
            if (!lockedSeats.has(showId)) {
                lockedSeats.set(showId, new Map());
            }
            const showLocks = lockedSeats.get(showId);
            const alreadyLocked = [];
            const newlyLocked = [];
            for (const seatId of seatIds) {
                const lockedBy = showLocks.get(seatId);
                if (lockedBy && lockedBy !== userId) {
                    alreadyLocked.push(seatId);
                }
                else {
                    showLocks.set(seatId, userId);
                    newlyLocked.push(seatId);
                }
            }
            if (alreadyLocked.length > 0) {
                socket.emit("seat-locked-failed", {
                    showId,
                    requested: seatIds,
                    alreadyLocked,
                });
            }
            if (newlyLocked.length > 0) {
                // Broadcast to all users in the show room
                io.to(showId).emit("seat-locked", {
                    seatIds: newlyLocked,
                    showId,
                });
            }
        });
        // Unlock seats (on timeout or manual release)
        socket.on("unlock-seats", ({ showId, userId }) => {
            const showLocks = lockedSeats.get(showId);
            if (!showLocks)
                return;
            const unlockedSeats = [];
            for (const [seatId, lockedUserId] of showLocks) {
                if (lockedUserId === userId) {
                    showLocks.delete(seatId);
                    unlockedSeats.push(seatId);
                }
            }
            if (unlockedSeats.length > 0) {
                io.to(showId).emit("seat-unlocked", {
                    seatIds: unlockedSeats,
                    showId,
                });
            }
        });
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    httpServer.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
};
startServer();
