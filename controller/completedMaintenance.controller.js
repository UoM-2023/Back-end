const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function add_Completed_Mnt_Request (req,res) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const {
            Mnt_id,
            ServiceProvider,
            MobileNo,
            completed_date,
            Payment_Status,
            Mnt_Payment_id,
        } = req.body;
        
        console.log(Mnt_id,
            ServiceProvider,
            MobileNo,
            completed_date,
            Payment_Status,
            Mnt_Payment_id,);
        const add = 'INSERT INTO Completed_MRequests (Mnt_id,ServiceProvider,MobileNo,completed_date,Payment_Status,Mnt_Payment_id)VALUES (?,?,?,?,?,?)'
        
        try {
            await connection.query(add, [Mnt_id,ServiceProvider,MobileNo,completed_date,Payment_Status,Mnt_Payment_id, ]);
            return res.status(200).json({message: 'Completed Maintenance Successfully Added'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function get_All_Completed_Mnt_Request(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        const query = `SELECT * FROM Completed_MRequests`;

        const [result] = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result});

    } catch(error){
        console.error('Failed to retrieve completed maintenance', error);
        return res.status(500).json({ message: 'Failed to retrieve completed maintenance' });
    }
}

async function get_A_Completed_Mnt_Request(req,res){
    try{
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);

        const query = `SELECT * FROM Completed_MRequests WHERE Completed_Mnt_id = ?`;
        const id = req.params.id;

        const result = await connection.query(query, [id]);
        console.log(result);
        return res.status(200).json({result : result});

    } catch(error){
        console.error('Failed to retrieve completed maintenance', error);
        return res.status(500).json({ message: 'Failed to retrieve completed maintenance' });
    }
}

async function update_completed_Mnt_Request(req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            Mnt_id,
            ServiceProvider,
            MobileNo,
            completed_date,
            Payment_Status,
            Mnt_Payment_id,
        } = req.body;

        const id = req.params.id;

        console.log(Mnt_id,
            ServiceProvider,
            MobileNo,
            completed_date,
            Payment_Status,
            Mnt_Payment_id,);

        const query = 'UPDATE fundTypes SET Mnt_id = ?,ServiceProvider = ?,MobileNo = ?,completed_date = CURRENT_TIMESTAMP,Payment_Status = ?,Mnt_Payment_id = ? WHERE Completed_Mnt_id = ?'

        try {
            await connection.query(query, [Mnt_id,ServiceProvider,MobileNo,completed_date,Payment_Status,Mnt_Payment_id, id]);
            return res.status(200).json({message: 'Completed maintenance Successfully Updated'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }



    } catch (error) {
        console.error('Failed to retrieve Completed maintenance', error);
        return res.status(500).json({ message: 'Failed to update Completed maintenance' });         
    }
}

async function delete_Completed_Mnt_Request(req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);
        const id = req.params.id;

        const query = 'DELETE FROM Completed_MRequests WHERE id = ?'

        try {
            await connection.query(query, [id]);
            return res.status(200).json({message: 'deleted successfully'});
        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

    } catch (error) {
        console.error('Failed to retrieve completed maintenance', error);
        return res.status(500).json({ message: 'Failed to update completed maintenance' }); 
    }
}


module.exports = {add_Completed_Mnt_Request,get_All_Completed_Mnt_Request,get_A_Completed_Mnt_Request,update_completed_Mnt_Request,delete_Completed_Mnt_Request};