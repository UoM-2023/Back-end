const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewRevenue (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        
        const {
            revenue_id,
            paid_by,
            amount,
            revenueType,
            paymentMethod,
            staff_id,
            revenue_date
        } = req.body;
        
        console.log(revenue_id,paid_by,amount,revenueType,paymentMethod,staff_id,revenue_date)
        const insertQuery = `INSERT INTO Revenue (revenue_id, paid_by, amount, revenueType, paymentMethod, staff_id, revenue_date) VALUES (@revenue_id, @paid_by, @amount, @revenueType, @paymentMethod, @staff_id, @revenue_date)`
        
        request.input('revenue_id', sql.VarChar, revenue_id);
        request.input('paid_by', sql.VarChar, paid_by);
        request.input('amount', sql.Float, amount);
        request.input('revenueType', sql.VarChar, revenueType);
        request.input('paymentMethod', sql.VarChar, paymentMethod);
        request.input('staff_id', sql.VarChar, staff_id);
        request.input('revenue_date', sql.Date, revenue_date);
        await request.query(insertQuery);

        return res.status(200).json({message: 'Revenue Details Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getAllRevenues(req,res){
    try{

        await sql.connect(dbConfig);

        const request = new sql.Request();

        const query = `SELECT * FROM Revenue`;

        const result =  await request.query(query);

        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}
module.exports = {addNewRevenue, getAllRevenues};