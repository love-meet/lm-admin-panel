// src/socket.js
import { io } from "socket.io-client";

// ✅ Replace the URL with your backend server address
const socket = io("https://love-meet.onrender.com", {
  transports: ["websocket"],
});

export default socket;
