const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());


async function addNewNotice(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            type,
            title,
            description
        } = req.body;

        // Check if all required fields are provided
        if (!type || !title || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log(type, title, description);

        const addQuery = 'INSERT INTO Notices (N_Type, N_Title, N_Description) VALUES (?, ?, ?)';

        try {
            await connection.query(addQuery, [type, title, description]);
            await connection.end(); // Close the connection after query execution
            return res.status(200).json({ message: 'Notice Successfully Added' });
        } catch (error) {
            console.error('Failed to save data', error);
            await connection.end(); // Close the connection in case of error
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}



async function getAllNotices(req, res) {
    try {
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        const query = 'SELECT * FROM Notices ORDER BY N_Date DESC';
        
        const [rows] = await connection.query(query);
        console.log(rows);

        await connection.end(); // Properly close the connection

        return res.status(200).json({ result: rows });

    } catch (error) {
        console.error('Failed to retrieve notices', error);
        return res.status(500).json({ message: 'Failed to retrieve notices' });
    }
}


async function getANotice(req, res) {
    try {
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: 'Notice no is required' });
        }

        const query = `SELECT * FROM Notices WHERE Notice_no = ?`;

        try {
            const [rows] = await connection.query(query, [id]);
            await connection.end(); // Close the connection
            return res.status(200).json({ result: rows });
        } catch (error) {
            console.error('Failed to retrieve notice:', error);
            await connection.end(); // Ensure the connection is closed in case of error
            return res.status(500).json({ message: 'Failed to retrieve notice' });
        }

    } catch (error) {
        console.error('Failed to connect to the database:', error);
        return res.status(500).json({ message: 'Failed to retrieve notice' });
    }
}


async function updateNotice(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            type,
            title,
            description
        } = req.body;

        const id = req.params.id;

        console.log(id, type, title, description);

        const query = `
            UPDATE Notices
            SET N_Type = ?, N_Title = ?, N_Description = ?,  N_Date =CURRENT_TIMESTAMP WHERE Notice_no = ?`;

        try {
            await connection.query(query, [type, title, description, id]);
            await connection.end(); // Close the connection after query execution
            return res.status(200).json({ message: 'Notice Successfully Updated' });

        } catch (error) {
            console.error('Failed to save data', error);
            await connection.end(); // Close the connection in case of error
            return res.status(500).json({ message: 'Process Failed' });
        }

    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Failed to update notice' });        
    }
}


async function deleteNotice(req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);
        const id = req.params.id;

        const query = 'DELETE FROM Notices WHERE Notice_no = ?'

        try {
            await connection.query(query, [id]);
            return res.status(200).json({message: 'Notice Successfully Deleted'});
        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

    } catch (error) {
        console.error('Failed to retrieve notice', error);
        return res.status(500).json({ message: 'Failed to update notice' }); 
    }
}

module.exports = {addNewNotice, getAllNotices, getANotice, updateNotice, deleteNotice};