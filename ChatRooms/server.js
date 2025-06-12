const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

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

// Store room information
const rooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle joining a room
    socket.on('join room', (data) => {
        const { username, room } = data;
        
        // Leave any previous rooms
        socket.rooms.forEach(room => {
            if (room !== socket.id) {
                socket.leave(room);
            }
        });

        // Join the new room
        socket.join(room);
        socket.username = username;
        socket.room = room;

        // Initialize room if it doesn't exist
        if (!rooms.has(room)) {
            rooms.set(room, new Set());
        }

        // Add user to room
        rooms.get(room).add(username);
        const users = Array.from(rooms.get(room));

        // Notify client they've joined
        socket.emit('room joined', { users });

        // Notify others in the room
        socket.to(room).emit('user joined', { username, users });

        console.log(`${username} joined room: ${room}`);
    });

    // Handle messages
    socket.on('message', (data) => {
        const { username, room, message, timestamp } = data;
        
        // Broadcast message to all users in the room
        io.to(room).emit('message', {
            username,
            message,
            timestamp
        });

        console.log(`Message in ${room} from ${username}: ${message}`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        const { username, room } = data;
        socket.to(room).emit('user typing', { username });
    });

    socket.on('stop typing', (data) => {
        const { room } = data;
        socket.to(room).emit('user stop typing');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        if (socket.username && socket.room) {
            const room = socket.room;
            const username = socket.username;

            // Remove user from room
            if (rooms.has(room)) {
                rooms.get(room).delete(username);
                
                // If room is empty, remove it
                if (rooms.get(room).size === 0) {
                    rooms.delete(room);
                } else {
                    // Notify remaining users
                    const users = Array.from(rooms.get(room));
                    socket.to(room).emit('user left', { username, users });
                }
            }
        }
    });

    // Handle custom disconnect
    socket.on('leave room', () => {
        if (socket.username && socket.room) {
            const room = socket.room;
            const username = socket.username;

            // Remove user from room
            if (rooms.has(room)) {
                rooms.get(room).delete(username);
                
                // If room is empty, remove it
                if (rooms.get(room).size === 0) {
                    rooms.delete(room);
                } else {
                    // Notify remaining users
                    const users = Array.from(rooms.get(room));
                    socket.to(room).emit('user left', { username, users });
                }
            }

            socket.leave(room);
            socket.username = null;
            socket.room = null;
        }
    });
});

// API endpoints
app.get('/api/rooms', (req, res) => {
    const roomList = Array.from(rooms.keys()).map(roomName => ({
        name: roomName,
        users: rooms.get(roomName).size
    }));
    res.json(roomList);
});

app.get('/api/rooms/:roomName/users', (req, res) => {
    const roomName = req.params.roomName;
    if (rooms.has(roomName)) {
        const users = Array.from(rooms.get(roomName));
        res.json({ room: roomName, users });
    } else {
        res.status(404).json({ error: 'Room not found' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the chat at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});