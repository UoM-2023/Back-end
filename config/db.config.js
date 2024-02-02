const dotenv = require('dotenv');
try {
    dotenv.config();
} catch (error) {
    console.error("Error loading .env file:", error.message);
}

const server = process.env.AZURE_SQL_SERVER
const database = process.env.AZURE_SQL_DATABASE
const port = parseInt(process.env.AZURE_SQL_PORT)
const user = process.env.AZURE_SQL_USER
const password = process.env.AZURE_SQL_PASSWORD

const config = {
    server,
    port,
    database,
    user,
    password,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        
    }
}
module.exports = config;