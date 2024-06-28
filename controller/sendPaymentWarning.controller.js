const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');
// const { users, io } = require('../index');
const socketManager = require('../sockets/socketManager');

let connection; 

async function sendPaymentWarning (req,res) {
    try {
        connection = await mysql.createConnection(dbConfig);
        const { unit_id, message } = req.body;

        const users = socketManager.getUsers();
        const io = socketManager.getIo();

        console.log("Recieved:",unit_id,message);
        
        const query = 'SELECT UserName FROM Unit_Credentials WHERE UnitID = ?'

        const [result] = await connection.query(query,[unit_id]);
        console.log('Result: ',result);
        const userId = result[0].UserName;
        console.log("User Id:",userId);

        console.log('Users: ',users);
        
        if (result.length > 0) {
            console.log("Called");
            const socketId = users[userId];

            console.log("Socket Id: ",socketId);

            if (socketId) {
                io.to(socketId).emit('notification', { message });
                return res.status(200).json({message:'Warning went successfully'});
            }
        }

    } catch (error) {
        console.error('Failed to send the notification',error);
        return res.status(201).json({message:'Failed to send the warning'});
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

module.exports = { sendPaymentWarning };