const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewPayment (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        
        const {
            payment_id,
            unit_id,
            resident_name,
            method,
            chargeType,
            paymentDate,
            amount
        } = req.body;
        
        console.log(payment_id, unit_id, resident_name, method, chargeType, paymentDate, amount)
        const insertQuery = `INSERT INTO Payments (payment_id, unit_id, resident_name, method, chargeType, paymentDate, amount) VALUES (@payment_id, @unit_id, @resident_name, @method, @chargeType, @paymentDate, @amount)`
        
        request.input('payment_id', sql.VarChar, payment_id);
        request.input('unit_id', sql.VarChar, unit_id);
        request.input('resident_name', sql.VarChar, resident_name);
        request.input('method', sql.VarChar, method);
        request.input('chargeType', sql.VarChar, chargeType);
        request.input('paymentDate', sql.Date, paymentDate);
        request.input('amount', sql.Float, amount);
        await request.query(insertQuery);

        return res.status(200).json({message: 'Revenue Details Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getAllPayments(req,res){
    try{

        await sql.connect(dbConfig);

        const request = new sql.Request();

        const query = `SELECT * FROM Payments`;

        const result =  await request.query(query);

        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}
module.exports = {addNewPayment, getAllPayments};