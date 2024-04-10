const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/db.config');
const database = require('./database/database')

// Imported Routes
const apiRoutes = require('./routes/test.route');
const healthRoute = require('./routes/health.route');
const authRoute = require('./routes/auth.route');
const financeRoute = require('./routes/finance.route');
const guestRoute = require('./routes/guest.route');
const facilityRoute = require('./routes/facility.route');
const reservationRoute = require('./routes/reservation.route');
// Configurations
const app = express();
const PORT = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({ extended:true }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());
app.use(cookieParser());

// Check database with dummy connections
async function runScripts() {
    await database.connection();
    // await database.getUserByID('AF0001A');
}

runScripts();

// Api Routes
app.use('/', apiRoutes);
app.use('/health', healthRoute);
app.use('/auth', authRoute);
app.use('/finance',financeRoute);
app.use('/guest',guestRoute);
app.use('/facility',facilityRoute);
app.use('/reservation',reservationRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


