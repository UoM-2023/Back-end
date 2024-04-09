const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function addNewFund (req,res) {
    try {
        
        const connection = await mysql.createConnection(dbConfig);

        const {
            fundName,
            chargedBy,
            amount,
            timePeriod,
            modifiedBy
        } = req.body;
        
        console.log(fundName,chargedBy,amount,timePeriod,modifiedBy)

        const add = 'INSERT INTO fundTypes (fundName, chargedBy, amount, timePeriod, modified_by, modified_date) VALUES (?, ?, ?, ?, ?,  CURRENT_TIMESTAMP)';
        
       
        try {
            await connection.query(add, [fundName, chargedBy, amount, timePeriod, modifiedBy ]);
            return res.status(200).json({message: 'Fund Successfully Added'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

        
        

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getAllFunds(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        const query = `SELECT * FROM fundTypes`;

        const result = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to retrieve funds', error);
        return res.status(500).json({ message: 'Failed to retrieve funds' });
    }
}
module.exports = {addNewFund, getAllFunds};