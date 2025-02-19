const { Server } = require("socket.io");

let io;
const onlineUsers = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`✅ User registered: ${userId} -> ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          onlineUsers.delete(key);
          console.log(`❌ User ${key} disconnected`);
          break;
        }
      }
    });
  });

  return io;
}

function sendNotification(userId, message) {
  if (!io) {
    console.error("❌ Socket.io is not initialized");
    return;
  }
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("notification", message);
    console.log(`📢 Sent notification to ${userId}: ${message}`);
  } else {
    console.log(`⚠️ User ${userId} is offline.`);
  }
}

module.exports = { initSocket, sendNotification };
