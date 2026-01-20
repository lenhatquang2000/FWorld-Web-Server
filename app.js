const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Lưu trữ trạng thái người chơi trong bộ nhớ
const players = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('start', (data) => {
        // Khởi tạo người chơi mới với giới tính
        players[socket.id] = {
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            playerId: socket.id,
            color: Math.random() * 0xffffff,
            gender: data.gender || 'male' // 'male' hoặc 'female'
        };

        // Gửi lại thông tin người chơi vừa tạo cho chính client đó
        socket.emit('currentPlayers', players);

        // Thông báo cho những người chơi khác về người chơi mới
        socket.broadcast.emit('newPlayer', players[socket.id]);
    });

    // Xử lý khi người chơi di chuyển
    socket.on('playerMovement', (movementData) => {
        if (players[socket.id]) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].flipX = movementData.flipX;
            players[socket.id].anim = movementData.anim;

            // Gửi vị trí mới cho tất cả người chơi khác
            socket.broadcast.emit('playerMoved', players[socket.id]);
        }
    });

    // Xử lý khi người chơi thoát
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (players[socket.id]) {
            delete players[socket.id];
            io.emit('playerDisconnected', socket.id);
        }
    });
});

module.exports = { app, server, io };
