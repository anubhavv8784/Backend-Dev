const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// create HTTP server
const server = http.createServer(app);

// attach Socket.io
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", (data) => {
    // broadcast to all clients
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// IMPORTANT: use server.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});