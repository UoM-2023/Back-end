
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

const getUserByID = async (userID) => {
    const checkUserQuery = 'SELECT * FROM User_Credentials WHERE UserID = ?';

    try {
        const connection = await mysql.createConnection(config);
        console.log(userID);
        const [rows,fields] = await connection.query(checkUserQuery,[userID]);

        console.log(rows[0]);
        
        // Returning the first user found or null if none found
        return rows.length > 0 ? rows[0] : null;

    } catch (error) {
        return console.error('Database error:', error);
    }
};



  

module.exports = { 
    connection,
    getUserByID,
    
    
 };
