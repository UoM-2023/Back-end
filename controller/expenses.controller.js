const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewExpense (req,res) {
    try {
        sql.connect(dbConfig);

        const request = new sql.Request();
        
        const {
            reference_no,
            amount,
            expenses_type,
            payment_method,
            staff_id,
            approved,
            approved_date
        } = req.body;
        
        console.log(reference_no,amount, expenses_type, payment_method, staff_id, approved, approved_date)
        const insertQuery = `INSERT INTO Expenses (reference_no, amount, expenses_type, payment_method, staff_id, approved, approved_date) VALUES (@reference_no, @amount, @expenses_type, @payment_method, @staff_id, @approved, @approved_date)`
        
        request.input('reference_no', sql.VarChar, reference_no);
        request.input('amount', sql.Float, amount);
        request.input('expenses_type', sql.VarChar, expenses_type);
        request.input('payment_method', sql.VarChar, payment_method);
        request.input('staff_id', sql.VarChar, staff_id);
        request.input('approved', sql.VarChar, approved);
        request.input('approved_date', sql.Date, approved_date);

        request.query(insertQuery);

        return res.status(200).json({message: 'Expense Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getAllExpenses(req,res) {
    try{
        await sql.connect(dbConfig);

        const request = new sql.Request();

        const query = `SELECT * FROM Expenses`;

        const result =  await request.query(query);

        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to retrieve expenses', error);
        return res.status(500).json({ message: 'Failed to retrieve expenses' });
    }
}
module.exports = {addNewExpense,getAllExpenses};