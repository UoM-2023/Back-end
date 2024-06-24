const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config/db.config");
const database = require("./database/database");
const http = require("http");
const socketIo = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Imported Routes

const maintenanceRoute = require("./routes/maintenance.route");
const apiRoutes = require("./routes/test.route");
const healthRoute = require("./routes/health.route");
const authRoute = require("./routes/auth.route");
const financeRoute = require("./routes/finance.route");
const residentsdetailsRoute = require("./routes/residentsdetails.route");
const staffdetailsRoute = require("./routes/staffdetails.route");
const userCredentialsRoute = require("./routes/usercredentials.route");
const testRoute = require("./routes/test.route");

// Configurations
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

// Check database with dummy connections
async function runScripts() {
  await database.connection();
  // await database.getUserByID('AF0001A');
}

runScripts();

// Api Routes
app.use("/", apiRoutes);
app.use("/health", healthRoute);
app.use("/auth", authRoute);
app.use("/finance", financeRoute);
app.use("/residentsDetails", residentsdetailsRoute);
app.use("/staffDetails", staffdetailsRoute);
app.use("/userCredentials", userCredentialsRoute);
app.use("/testing", testRoute);
app.use("/maintenance", maintenanceRoute);

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join room based on userId
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
