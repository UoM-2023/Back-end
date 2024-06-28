// socketManager.js
const socketIo = require('socket.io');

let io;
const users = {};

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join room based on userId
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      users[userId] = socket.id; // Store the socket.id against the userId
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};

const getIo = () => io;
const getUsers = () => users;

module.exports = {
  initializeSocket,
  getIo,
  getUsers,
};
