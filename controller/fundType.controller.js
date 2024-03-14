const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewFund (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        const {
            fundID,
            fundName,
            chargedBy,
            amount,
            timePeriod,
            modifiedDate,
            modifiedBy
        } = req.body;
        
        console.log(fundID,fundName,chargedBy,amount,timePeriod,modifiedBy,modifiedDate)
        const insertQuery = `INSERT INTO Fund_Types (fundID, fundName, chargedBy, amount, timePeriod, modifiedDate, modifiedBy) VALUES (@FundID, @FundName, @ChargedBy, @Amount, @TimePeriod, @ModifiedDate, @ModifiedBy)`
        
        request.input('FundID', sql.VarChar, fundID);
        request.input('FundName', sql.VarChar, fundName);
        request.input('chargedBy', sql.VarChar, chargedBy);
        request.input('Amount', sql.Money, amount);
        request.input('TimePeriod', sql.Int, timePeriod);
        request.input('ModifiedDate', sql.Date, modifiedDate);
        request.input('ModifiedBy', sql.VarChar, modifiedBy);
        await request.query(insertQuery);

        return res.status(200).json({message: 'Fund Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

module.exports = addNewFund;