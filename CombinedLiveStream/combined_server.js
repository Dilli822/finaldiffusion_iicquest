const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.static('public'));

// WebSocket server for WebRTC signaling
const wss = new WebSocket.Server({ port: 9080 });

// Store broadcast rooms and users
const broadcastRooms = new Map(); // broadcasterId => { broadcaster: ws, viewers: Set, chatUsers: Set }
const broadcasters = new Map(); // broadcasterId => ws
const viewers = new Map();      // viewerId => { ws, broadcasterId }

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// WebRTC Signaling Server
wss.on('connection', (ws) => {
  console.log('New WebRTC connection established');

  ws.on('message', (message) => {
    console.log('Received WebRTC message:', message.toString());

    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
      return;
    }

    switch (data.type) {
      case 'broadcaster': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        broadcasters.set(data.broadcasterId, ws);
        ws.broadcasterId = data.broadcasterId;
        
        // Initialize broadcast room
        if (!broadcastRooms.has(data.broadcasterId)) {
          broadcastRooms.set(data.broadcasterId, {
            broadcaster: ws,
            viewers: new Set(),
            chatUsers: new Set()
          });
        }
        
        console.log(`Broadcaster registered: ${data.broadcasterId}`);
        
        // Notify Socket.IO about broadcaster status
        io.to(`broadcast-${data.broadcasterId}`).emit('broadcaster-online', {
          broadcasterId: data.broadcasterId,
          timestamp: new Date().toISOString()
        });
        break;
      }

      case 'viewer': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId provided' }));
          return;
        }
        const broadcasterWs = broadcasters.get(data.broadcasterId);
        if (!broadcasterWs) {
          ws.send(JSON.stringify({ type: 'error', message: 'Broadcaster not found' }));
          return;
        }
        const viewerId = generateId();
        viewers.set(viewerId, { ws, broadcasterId: data.broadcasterId });
        ws.viewerId = viewerId;
        ws.broadcasterId = data.broadcasterId;

        // Add to broadcast room
        if (broadcastRooms.has(data.broadcasterId)) {
          broadcastRooms.get(data.broadcasterId).viewers.add(viewerId);
        }

        ws.send(JSON.stringify({ type: 'viewer-id', viewerId }));
        console.log(`Viewer registered: ${viewerId} for broadcaster: ${data.broadcasterId}`);

        // Notify broadcaster about new viewer
        broadcasterWs.send(JSON.stringify({ 
          type: 'viewer', 
          viewerId,
          viewerName: data.viewerName || `Viewer-${viewerId.substring(0, 4)}`
        }));
        break;
      }

      case 'offer': {
        if (!data.viewerId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No viewerId in offer' }));
          return;
        }
        const viewer = viewers.get(data.viewerId);
        if (viewer) {
          viewer.ws.send(JSON.stringify(data));
          console.log(`Offer forwarded to viewer ${data.viewerId}`);
        }
        break;
      }

      case 'answer': {
        if (!data.broadcasterId) {
          ws.send(JSON.stringify({ type: 'error', message: 'No broadcasterId in answer' }));
          return;
        }
        const broadcasterWs = broadcasters.get(data.broadcasterId);
        if (broadcasterWs) {
          broadcasterWs.send(JSON.stringify(data));
          console.log(`Answer forwarded to broadcaster ${data.broadcasterId}`);
        }
        break;
      }

      case 'ice-candidate': {
        if (data.to === 'viewer') {
          const viewer = viewers.get(data.viewerId);
          if (viewer) {
            viewer.ws.send(JSON.stringify(data));
          }
        } else if (data.to === 'broadcaster') {
          const broadcasterWs = broadcasters.get(data.broadcasterId);
          if (broadcasterWs) {
            broadcasterWs.send(JSON.stringify(data));
          }
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (ws.broadcasterId) {
      const broadcasterId = ws.broadcasterId;
      broadcasters.delete(broadcasterId);
      
      // Notify all viewers in Socket.IO chat
      io.to(`broadcast-${broadcasterId}`).emit('broadcaster-offline', {
        broadcasterId,
        timestamp: new Date().toISOString()
      });
      
      // Notify WebRTC viewers
      if (broadcastRooms.has(broadcasterId)) {
        const room = broadcastRooms.get(broadcasterId);
        room.viewers.forEach(viewerId => {
          const viewer = viewers.get(viewerId);
          if (viewer && viewer.ws.readyState === WebSocket.OPEN) {
            viewer.ws.send(JSON.stringify({ type: 'broadcaster-disconnected' }));
          }
        });
        broadcastRooms.delete(broadcasterId);
      }
      
      console.log(`Broadcaster ${broadcasterId} disconnected`);
    }
    
    if (ws.viewerId) {
      const viewerId = ws.viewerId;
      const broadcasterId = ws.broadcasterId;
      
      viewers.delete(viewerId);
      
      // Remove from broadcast room
      if (broadcastRooms.has(broadcasterId)) {
        broadcastRooms.get(broadcasterId).viewers.delete(viewerId);
      }
      
      // Notify broadcaster
      const broadcasterWs = broadcasters.get(broadcasterId);
      if (broadcasterWs && broadcasterWs.readyState === WebSocket.OPEN) {
        broadcasterWs.send(JSON.stringify({ type: 'viewer-left', viewerId }));
      }
      
      console.log(`Viewer ${viewerId} disconnected`);
    }
  });
});

// Socket.IO Chat System
io.on('connection', (socket) => {
  console.log('New Socket.IO connection:', socket.id);

  // Join broadcast room for chat
  socket.on('join-broadcast-chat', (data) => {
    const { broadcasterId, username, userType } = data; // userType: 'broadcaster' or 'viewer'
    
    socket.join(`broadcast-${broadcasterId}`);
    socket.broadcasterId = broadcasterId;
    socket.username = username;
    socket.userType = userType;
    
    // Add to chat users
    if (broadcastRooms.has(broadcasterId)) {
      broadcastRooms.get(broadcasterId).chatUsers.add(socket.id);
    }
    
    // Get current user count
    const room = io.sockets.adapter.rooms.get(`broadcast-${broadcasterId}`);
    const userCount = room ? room.size : 0;
    
    // Notify user they joined
    socket.emit('chat-joined', {
      broadcasterId,
      userCount,
      isOnline: broadcasters.has(broadcasterId)
    });
    
    // Notify others about new user
    socket.to(`broadcast-${broadcasterId}`).emit('user-joined-chat', {
      username,
      userType,
      timestamp: new Date().toISOString(),
      userCount
    });
    
    // Send user count update
    io.to(`broadcast-${broadcasterId}`).emit('user-count-update', { userCount });
    
    console.log(`${username} (${userType}) joined chat for broadcast ${broadcasterId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    const { message, broadcasterId } = data;
    
    if (!socket.broadcasterId || socket.broadcasterId !== broadcasterId) {
      socket.emit('chat-error', { message: 'Not authorized for this broadcast' });
      return;
    }
    
    const chatMessage = {
      id: generateId(),
      username: socket.username,
      userType: socket.userType,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Broadcast message to all users in the room
    io.to(`broadcast-${broadcasterId}`).emit('chat-message', chatMessage);
    
    console.log(`Chat message in ${broadcasterId} from ${socket.username}: ${message}`);
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    if (socket.broadcasterId) {
      socket.to(`broadcast-${socket.broadcasterId}`).emit('user-typing', {
        username: socket.username,
        userType: socket.userType
      });
    }
  });

  socket.on('typing-stop', (data) => {
    if (socket.broadcasterId) {
      socket.to(`broadcast-${socket.broadcasterId}`).emit('user-stop-typing', {
        username: socket.username
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.broadcasterId) {
      const broadcasterId = socket.broadcasterId;
      
      // Remove from chat users
      if (broadcastRooms.has(broadcasterId)) {
        broadcastRooms.get(broadcasterId).chatUsers.delete(socket.id);
      }
      
      // Get updated user count
      const room = io.sockets.adapter.rooms.get(`broadcast-${broadcasterId}`);
      const userCount = room ? room.size : 0;
      
      // Notify others about user leaving
      socket.to(`broadcast-${broadcasterId}`).emit('user-left-chat', {
        username: socket.username,
        userType: socket.userType,
        timestamp: new Date().toISOString(),
        userCount
      });
      
      // Send user count update
      io.to(`broadcast-${broadcasterId}`).emit('user-count-update', { userCount });
      
      console.log(`${socket.username} left chat for broadcast ${broadcasterId}`);
    }
  });
});

// API endpoints
app.get('/api/broadcasts', (req, res) => {
  const broadcasts = Array.from(broadcastRooms.keys()).map(broadcasterId => {
    const room = broadcastRooms.get(broadcasterId);
    const chatRoom = io.sockets.adapter.rooms.get(`broadcast-${broadcasterId}`);
    return {
      broadcasterId,
      viewerCount: room.viewers.size,
      chatUserCount: chatRoom ? chatRoom.size : 0,
      isLive: broadcasters.has(broadcasterId)
    };
  });
  res.json(broadcasts);
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'broadcaster.html'));
});

app.get('/viewer', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

const PORT = process.env.PORT || 6000;

server.listen(PORT, () => {
  console.log(`Main server running on http://localhost:${PORT}`);
  console.log(`WebRTC signaling server running on ws://localhost:9080`);
  console.log(`Socket.IO chat server running on http://localhost:${PORT}`);
});

console.log('Enhanced Live Streaming Server with Chat is running!');
console.log('- Broadcaster: http://localhost:3000');
console.log('- Viewer: http://localhost:3000/viewer');
console.log('- WebRTC Signaling: ws://localhost:9080');
console.log('- Socket.IO Chat: http://localhost:3000');