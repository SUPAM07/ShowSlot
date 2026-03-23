import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:9000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
