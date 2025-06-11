// RTC.js (ESM-compatible)
import { WebSocketServer } from "ws";

// WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

// In-memory store of connected users: username => WebSocket
const users = new Map();

wss.on("connection", (ws) => {
  console.log("🔌 New client connected");

  ws.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      console.error("❌ Invalid JSON received:", message);
      return;
    }

    const { type, username, target } = data;

    switch (type) {
      case "login":
        handleLogin(ws, username);
        break;

      case "offer":
      case "answer":
      case "ice-candidate":
      case "call-request":
        sendToUser(target, JSON.stringify(data));
        break;

      default:
        console.warn("⚠️ Unknown message type:", type);
    }
  });

  ws.on("close", () => {
    for (const [username, userWs] of users.entries()) {
      if (userWs === ws) {
        users.delete(username);
        console.log(`❌ ${username} disconnected`);
        broadcastUserList();
        break;
      }
    }
  });
});

/**
 * Handle user login and register WebSocket
 */
function handleLogin(ws, username) {
  if (!username) return;
  console.log(`✅ User logged in: ${username}`);
  users.set(username, ws);
  ws.username = username;
  broadcastUserList();
}

/**
 * Broadcast the updated list of online users to all clients
 */
function broadcastUserList() {
  const userList = Array.from(users.keys());
  const message = JSON.stringify({
    type: "user-list",
    users: userList,
  });

  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
}

/**
 * Send a message to a specific user
 */
function sendToUser(username, message) {
  const targetWs = users.get(username);
  if (targetWs && targetWs.readyState === 1) {
    targetWs.send(message);
  } else {
    console.warn(`⚠️ Cannot send to ${username} (not connected)`);
  }
}

console.log("🚀 WebRTC signaling server running on ws://localhost:8080");
