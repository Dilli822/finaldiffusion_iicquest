const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Object to store usernames and their corresponding unique numbers
const userNumbers = {};

io.on('connection', (socket) => {
  // Generate a random unique number for the new user
  const userId = Math.floor(Math.random() * 1000);
  userNumbers[socket.id] = userId;

  // Send the username and its unique number to the client
  socket.emit('user connected', { username: `User_${userId}` });

  socket.on('chat message', (data) => {
    const messageData = {
      username: data.username,
      message: data.message,
      timestamp: new Date().toLocaleString()
    };
    io.emit('chat message', messageData);

    // Optionally, store message data locally on the server
    // This example saves messages to an array in memory; for persistence, consider using a database.
    if (!app.locals.chatMessages) {
      app.locals.chatMessages = [];
    }
    app.locals.chatMessages.push(messageData);
  });

  socket.on('disconnect', () => {
    delete userNumbers[socket.id];
  });
});

server.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
