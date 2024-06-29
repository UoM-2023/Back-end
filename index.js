const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config/db.config");
const database = require("./database/database");
const mysql = require('mysql2/promise');
const socketIo = require("socket.io");
const socketManager = require("./sockets/socketManager");
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
const residentialUnitsRoute=require("./routes/residentialunits.route");
const newsNoticesRoute=require("./routes/newsnnotices.route");
const complaintsRoute=require("./routes/complaints.route");
const socketHandlers = require('./sockets/socketHandlers');
const GuestDetailsRoute = require("./routes/guest.route");
const ReservationsRoute = require("./routes/reservation.route");
const FacilityRoute = require("./routes/facility.route");

const userCredentialsRoute = require("./routes/usercredentials.route");
const testRoute = require("./routes/test.route");
const settingsRoute = require("./routes/settings.route");



// Configurations 
const app = express();
//const server = http.createServer(app);

// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
//   },
// });

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server, {
  path: '/socket.io' // Default path, but can be customized
});

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

// Check database with dummy connections
async function runScripts() {
  await database.connection();
  // await database.getUserByID('AF0001A');
}

runScripts();

require('./controller/cronJob.controller')
// require('./controller/cronJobTesing.controller');
socketManager.initializeSocket(server);

// Api Routes
app.use("/", apiRoutes);
app.use("/health", healthRoute);
app.use("/auth", authRoute);
app.use("/finance", financeRoute);
app.use("/residentsDetails", residentsdetailsRoute);
app.use("/staffDetails", staffdetailsRoute);
app.use("/residentialUnits",residentialUnitsRoute);
app.use("/newsNotices",newsNoticesRoute);
app.use("/complaints",complaintsRoute);
app.use("/GuestDetail", GuestDetailsRoute);
app.use("/Reservation", ReservationsRoute);
app.use("/Facility", FacilityRoute);
app.use("/userCredentials", userCredentialsRoute);
app.use("/testing", testRoute);
app.use("/maintenance", maintenanceRoute);
app.use("/Settings", settingsRoute);

// Socket.IO
socketHandlers(io);


// Socket connection
// const users = {};

// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);

//   // Join room based on userId
//   socket.on("joinRoom", (userId) => {
//     users[userId] = socket.id;
//     socket.join(userId);
//     console.log("UserID: ",users[userId])
//     console.log(`Socket ${socket.id} joined room ${userId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//     for (let userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//   });
// });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// module.exports = { io, users }
