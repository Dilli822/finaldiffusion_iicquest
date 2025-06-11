import dotenv from "dotenv";
import connectDB from "./db/conn.js";
import app from "./app.js";
import http from "http";
import { initSocket } from "./socket.io/socket.js";
// import { initWebRTCSignaling } from "./webRTC/RTC.js";

dotenv.config();

const PORT = process.env.PORT || 6000;

// Create HTTP server for both Express + WebSocket + Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO (chat, etc.)
initSocket(server);

// Initialize WebSocket (WebRTC signaling)
// initWebRTCSignaling(server);

// Start server
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port: ${PORT}`);
});
