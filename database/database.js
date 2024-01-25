const sql = require('mssql');
const config = require('../config/config');

async function connection() {
    try {
        await sql.connect(config);
        console.log('Connected to the database successfully!');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    } finally {
        await sql.close();
    }
}

module.exports = { connection };
