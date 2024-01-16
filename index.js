const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');
const healthRoute = require('./routes/healthChecker');


// Configurations
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());
app.use(bodyParser.json({ extended:true }));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors());

// Api Routes
app.use('/', apiRoutes);
app.use('/health', healthRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


