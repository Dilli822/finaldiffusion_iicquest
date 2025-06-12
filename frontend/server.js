const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3005;

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for 'sendMessage' event from clients
  socket.on('sendMessage', (msg) => {
    // Broadcast the message to all connected clients (including the sender)
    io.emit('newMessage', msg);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`HELLO WORLD! Chat server is running on port: ${PORT}`);
});
