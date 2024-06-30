const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function addNewEvent(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            event,
            place,
            sDate,
            eDate,
            description
        } = req.body;

        console.log(event,place,sDate,eDate,description);

        const addQuery = 'INSERT INTO NN_Events (E_Name, E_Place, S_Date, E_Date, E_Description) VALUES (?, ?, ?, ?, ?)'; 

        try {
            const [result] = await connection.query(addQuery, [event,place,sDate,eDate,description]); // Ensure the order of parameters matches the query
        
            console.log("Inserted ID:", result.insertId); // Log the ID of the inserted row
            await connection.end(); // Close the connection after query execution
            return res.status(200).json({ message: 'Event Successfully Added' });
        } catch (error) {
            console.error('Failed to save data', error);
            await connection.end(); // Close the connection in case of error
            return res.status(500).json({ message: 'Internal Server Error' }); // Return appropriate error response
        }
    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Internal Server Error' }); // Return appropriate error response
    }
}

async function getAllEvents(req, res) {
    try {
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        const query = 'SELECT * FROM NN_Events ORDER BY Event_no DESC';
        
        const [rows] = await connection.query(query);
        console.log(rows);

        await connection.end(); // Properly close the connection

        return res.status(200).json({ result: rows });

    } catch (error) {
        console.error('Failed to retrieve events', error);
        return res.status(500).json({ message: 'Failed to retrieve events' });
    }
}


async function getAnEvent(req, res) {
    try {
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Event no is required' });
        }

        const query = `SELECT * FROM NN_Events WHERE Event_no = ?`;

        try {
            const [rows] = await connection.query(query, [id]);
            await connection.end(); // Close the connection
            return res.status(200).json({ result: rows });
        } catch (error) {
            console.error('Failed to retrieve event:', error);
            await connection.end(); // Ensure the connection is closed in case of error
            return res.status(500).json({ message: 'Failed to retrieve event' });
        }

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        return res.status(500).json({ message: 'Failed to retrieve event' });
    }
}

async function updateEvent(req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            event,
            place,
            sDate,
            eDate,
            description
        } = req.body;

        const id = req.params.id;

        console.log(id, event,place,sDate,eDate,description);

        const query = 'UPDATE NN_Events SET E_Name=?, E_Place=?, S_Date=?, E_Date=?, E_Description=? WHERE Event_no = ?'

        try {
            await connection.query(query, [event,place,sDate,eDate,description, id]);
            return res.status(200).json({message: 'Event Successfully Updated'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }



    } catch (error) {
        console.error('Failed to retrieve event', error);
        return res.status(500).json({ message: 'Failed to update event' });        
    }
}

async function deleteEvent(req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);
        const id = req.params.id;

        const query = 'DELETE FROM NN_Events WHERE Event_no = ?'

        try {
            await connection.query(query, [id]);
            return res.status(200).json({message: 'Event Successfully Deleted'});
        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

    } catch (error) {
        console.error('Failed to retrieve event', error);
        return res.status(500).json({ message: 'Failed to update event' }); 
    }
}

module.exports = {addNewEvent, getAllEvents, getAnEvent, updateEvent, deleteEvent};