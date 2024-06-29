const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

let connection;

async function getAllBalance (req, res) {
    try {
        connection = await mysql.createConnection(dbConfig);

        const query = `SELECT bal.*, ri.name_with_initials FROM balance bal INNER JOIN Residents_Information ri ON bal.unit_id = ri.UnitID AND ri.member_type = 'Owner'`;

        const result = await connection.query(query);

        return res.status(200).json({ result: result })

    } catch (error) {
        console.error('Failed to retrieve data',error);
        return res.status(201).json({message:'Process Failed'});
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

module.exports = { getAllBalance };
