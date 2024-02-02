const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/db.config');
const database = require('./database/database')

// Imported Routes
const apiRoutes = require('./routes/test.route');
const healthRoute = require('./routes/health.route');
const authRoute = require('./routes/auth.route');

// Configurations
const app = express();
const PORT = process.env.PORT || 3001;

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({ extended:true }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());

// Check database with dummy connections
async function runScripts() {
    await database.connection();
}

runScripts();

// Api Routes
app.use('/', apiRoutes);
app.use('/health', healthRoute);
app.use('/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


