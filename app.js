const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Joining a room
    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // User is typing and broadcast to specified room
    socket.on('user typing', (data) => {
        io.to(data.room).emit('user typing', { userId: data.userId });
    });

    // Receive chat message and broadcast it only to the specified room
    socket.on('chat message', (data) => {
        io.to(data.room).emit('chat message', { message: data.message, userId: data.userId });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port localhost:${PORT}`);
});
