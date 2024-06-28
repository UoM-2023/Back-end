const dotenv = require("dotenv");
try {
  dotenv.config();
} catch (error) {
  console.error("Error loading .env file:", error.message);
}

// const server = process.env.AZURE_SQL_SERVER
// const database = process.env.AZURE_SQL_DATABASE
// const port = parseInt(process.env.AZURE_SQL_PORT)
// const user = process.env.AZURE_SQL_USER
// const password = process.env.AZURE_SQL_PASSWORD

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

const config = {
  host,
  user,
  password,
  database,
};
module.exports = config;
