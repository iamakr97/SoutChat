const express = require('express');
const http = require('http');
require('dotenv').config();
const app = express();

const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: process.env.BASE_URL,
        credentials: true,
        optionsSuccessStatus: 204,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }
})
const getReceiverSocketId = (userId) => {
    return onlineUser[userId];
}
const onlineUser = {};

io.on("connection", (socket) => {
    // console.log("A new User Connected ", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId !== undefined) {
        onlineUser[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(onlineUser));

    socket.on("disconnect", () => {
        // console.log("user disconnected", socket.id);
        delete onlineUser[userId];
        io.emit("getOnlineUsers", Object.keys(onlineUser));
    });
})

module.exports = { app, io, server, getReceiverSocketId };