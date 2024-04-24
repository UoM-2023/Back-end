const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewCompletedMaintenanceReq (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        const {
            M_payment_ID,
            referenceNo,
            serviceProvider,
            mobileNo,
            RequestedDate,
            completedDate,
            paymentStatus,
            paymentID,
        } = req.body;
        
        console.log(M_payment_ID,referenceNo,serviceProvider,mobileNo,RequestedDate,completedDate,paymentStatus,paymentID);
        const insertQuery = `INSERT INTO Completed_Maintenance_Requests (M_payment_ID,reference_No,Service_Provider,Mobile_No,Requested_Date,Completed_Date,Payment_status,Payment_ID)
         VALUES (@M_payment_ID,@reference_No,@Service_Provider,@Mobile_No,@Requested_Date,@Completed_Date,@Payment_status,@Payment_ID)`
        
        request.input('M_payment_ID', sql.VarChar, M_payment_ID);
        request.input('reference_No', sql.VarChar, referenceNo);
        request.input('Service_Provider', sql.VarChar, serviceProvider);
        request.input('Mobile_NO', sql.VarChar, mobileNo);
        request.input('Requested_Date', sql.Date, RequestedDate);
        request.input('Completed_Date', sql.Date, completedDate);
        request.input('Payment_status', sql.VarChar, paymentStatus);
        request.input('Payment_ID', sql.VarChar, paymentID);
       
        await request.query(insertQuery);

        return res.status(200).json({message: 'Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getCompletedMaintenanceReq(req,res){
    try{
        await sql.connect(dbConfig);

        const request = new sql.Request();

        const query = `SELECT * FROM Completed_Maintenance_Requests`;

        const result = await request.query(query);

        return res.status(200).json(result.recordset);
    } catch(error){
        console.error('Failed to retrieve funds', error);
        return res.status(500).json({ message: 'Failed to retrieve funds' });
    }
}

module.exports = {addNewCompletedMaintenanceReq,getCompletedMaintenanceReq};