const sql = require('mssql');
const mysql = require('mysql2/promise');

const config = require('../config/db.config');

async function connection() {
    
    try {
        const connection = await mysql.createConnection(config);
        connection;
        console.log('Connected to the database successfully!');

    } catch (err) {
        console.error('Failed to connect to the database:', err);

    } 
}

const getUserByID = async (req,res,userID) => {
    const checkUserQuery = 'SELECT * FROM User_Credentials WHERE UserID = ?';

    try {
        const connection = mysql.createConnection(config);
         
        const [rows, fiels] = await connection.execute(checkUserQuery,[userID]);

        console.log(rows[0]);
        
        // Returning the first user found or null if none found
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({message:'Server error'});
    }
};

module.exports = { 
    connection,
    getUserByID
 };
