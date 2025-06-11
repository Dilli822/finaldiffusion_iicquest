

// server.js (ESM-compatible)
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
    console.log(`📨 Received: ${type} from ${data.sender || 'unknown'} to ${target || 'broadcast'}`);

    switch (type) {
      case "login":
        handleLogin(ws, username);
        break;

      case "offer":
      case "answer":
      case "ice-candidate":
      case "call-request":
      case "call-accepted":
      case "call-rejected":
      case "busy":
      case "hangup":
        // Forward signaling messages to target user
        if (target) {
          sendToUser(target, JSON.stringify(data));
        }
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
        
        // Notify other users about disconnection
        broadcastUserDisconnected(username);
        broadcastUserList();
        break;
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

/**
 * Handle user login and register WebSocket
 */
function handleLogin(ws, username) {
  if (!username) return;
  
  // Check if username is already taken
  if (users.has(username)) {
    ws.send(JSON.stringify({
      type: "error",
      message: "Username already taken"
    }));
    return;
  }
  
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

  console.log(`📢 Broadcasting user list: ${userList.join(', ')}`);

  for (const [username, client] of users.entries()) {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  }
}

/**
 * Notify all users that a user has disconnected
 */
function broadcastUserDisconnected(username) {
  const message = JSON.stringify({
    type: "user-disconnected",
    username: username
  });

  for (const [user, client] of users.entries()) {
    if (client.readyState === 1 && user !== username) {
      client.send(message);
    }
  }
}

/**
 * Send a message to a specific user
 */
function sendToUser(username, message) {
  const targetWs = users.get(username);
  if (targetWs && targetWs.readyState === 1) { // WebSocket.OPEN
    targetWs.send(message);
    console.log(`📤 Message sent to ${username}`);
  } else {
    console.warn(`⚠️ Cannot send to ${username} (not connected or connection closed)`);
  }
}

console.log("🚀 WebRTC signaling server running on ws://localhost:8080");

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});