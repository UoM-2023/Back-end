const dotenv = require('dotenv');
dotenv.config();

const server = process.env.AZURE_SQL_SERVER
const database = process.env.AZURE_SQL_DATABASE
const port = parseInt(process.env.AZURE_SQL_PORT)
// const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USER
const password = process.env.AZURE_SQL_PASSWORD
// const dbUri = process.env.DB_URI;

const config = {
    server,
    port,
    database,
    user,
    password,
    // driver: 'ODBC Driver 18 for SQL Server',
    // authentication: {
    //     type
    // },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        
    }
    // dbUri
}
module.exports = config;