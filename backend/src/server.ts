import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
  const port = config.port;
  await connectDB();

  // Wrap Express with HTTP server for Socket.IO
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
      credentials: true,
    },
  });

  // In-memory store for locked seats: Map<showId, Map<seatId, userId>>
  const lockedSeats = new Map<string, Map<string, string>>();

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

      const showLocks = lockedSeats.get(showId)!;
      const alreadyLocked: string[] = [];
      const newlyLocked: string[] = [];

      for (const seatId of seatIds) {
        const lockedBy = showLocks.get(seatId);
        if (lockedBy && lockedBy !== userId) {
          alreadyLocked.push(seatId);
        } else {
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
      if (!showLocks) return;

      const unlockedSeats: string[] = [];
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