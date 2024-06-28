const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

let connection;

async function addNewComplaint(req, res) {
    try {
        connection = await mysql.createConnection(dbConfig);

        try {
            const {
                Nature,
                Title,
                Complained_by,
                C_Description,
                CStatus
            } = req.body;

            console.log(Nature, Title, Complained_by, C_Description, CStatus);

            const addQuery = 'INSERT INTO Complaints (Nature, Title, Complained_by, C_Date, C_Description, CStatus) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)';

            await connection.query(addQuery, [Nature, Title, Complained_by, C_Description, CStatus]);
            await connection.end(); // Close the connection after query execution
            return res.status(200).json({ message: 'Complaint Successfully Added' });
        } catch (error) {
            console.error('Failed to save data', error);
            await connection.end(); // Close the connection in case of error
            return res.status(500).json({ message: 'Internal Server Error' }); // Return appropriate error response
        }
    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Return appropriate error response
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}


async function getAllComplaints(req, res) {
    try {
        console.log("called");

        connection = await mysql.createConnection(dbConfig);

        const query = 'SELECT * FROM Complaints';
        
        const [rows] = await connection.query(query);
        console.log(rows);

        await connection.end(); // Properly close the connection

        return res.status(200).json({ result: rows });

    } catch (error) {
        console.error('Failed to retrieve complaints', error);
        return res.status(500).json({ message: 'Failed to retrieve complaints' });
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}


async function getAComplaint(req, res) {
    try {
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Unit ID is required' });
        }

        const query = `SELECT * FROM Complaints WHERE Reference_id = ?`;

        try {
            const [rows] = await connection.query(query, [id]);
            await connection.end(); // Close the connection
            return res.status(200).json({ result: rows });
        } catch (error) {
            console.error('Failed to retrieve complaint:', error);
            await connection.end(); // Ensure the connection is closed in case of error
            return res.status(500).json({ message: 'Failed to retrieve complaint' });
        }

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        return res.status(500).json({ message: 'Failed to retrieve complaint' });
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}


async function updateComplaint(req,res){
    try {
        connection = await mysql.createConnection(dbConfig);

        const {
            Nature,
            Title,
            Complained_by,
            C_Description,
            CStatus
        } = req.body;

        const id = req.params.id;

        console.log(id, Nature, Title, Complained_by, C_Description, CStatus);

        const query = 'UPDATE Complaints SET Nature = ?, Title = ?, Complained_by = ?, C_Date = CURRENT_TIMESTAMP, C_Description = ?, CStatus = ? WHERE Reference_id = ?'

        try {
            await connection.query(query, [Nature, Title, Complained_by, C_Description, CStatus, id]);
            return res.status(200).json({message: 'Complaint Successfully Updated'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }



    } catch (error) {
        console.error('Failed to retrieve complaint', error);
        return res.status(500).json({ message: 'Failed to update complaint' });        
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

async function deleteComplaint(req,res){
    try {
        connection = await mysql.createConnection(dbConfig);
        const id = req.params.id;

        const query = 'DELETE FROM Complaints WHERE Reference_id = ?'

        try {
            await connection.query(query, [id]);
            return res.status(200).json({message: 'Complaint Successfully Deleted'});
        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

    } catch (error) {
        console.error('Failed to retrieve complaint', error);
        return res.status(500).json({ message: 'Failed to update complaint' }); 
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

module.exports = {addNewComplaint, getAllComplaints, getAComplaint, updateComplaint, deleteComplaint};



