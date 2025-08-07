// src/socket.js
import { io } from "socket.io-client";

// Use the same base URL as your API calls
const socket = io(import.meta.env.VITE_API_FILE_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});

// Add connection logging for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    socket.connect();
  }
});

export default socket;