const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const config = require("./config/db.config");
const database = require("./database/database");
const socketIo = require('socket.io');
const http = require('http');
const mysql = require('mysql2/promise');

// Imported Routes
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

// Configurations
const app = express();
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = socketIo(server, {
  path: '/socket.io' // Default path, but can be customized
});

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Check database with dummy connections
async function runScripts() {
  await database.connection();
  // await database.getUserByID('AF0001A');
}

runScripts();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Socket.IO
socketHandlers(io);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
