const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function addNewMaintenanceRequest (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        const {
            referenceNo,
            unitID,
            residentName,
            maintenanceType,
            RequestedDate,
            TaskStatus,
            
            
            
        } = req.body;
        
        console.log(maintenanceType,unitID,residentName)
        const insertQuery = `INSERT INTO Maintenance_Requests (reference_no,Unit_ID,Resident_Name,Maintenance_Type,Requested_Date,Task_Status) 
        VALUES (@reference_no,@Unit_ID,@Resident_Name,@Maintenance_Type,@Requested_Date,@Task_Status)`
        
        request.input('reference_no', sql.VarChar, referenceNo);
        request.input('Unit_ID', sql.VarChar, unitID);
        request.input('Resident_Name', sql.VarChar, residentName);
        request.input('Maintenance_Type', sql.VarChar, maintenanceType);
        request.input('Requested_Date', sql.Date, RequestedDate);
        request.input('Task_Status', sql.VarChar, TaskStatus);
        
        await request.query(insertQuery);

        return res.status(200).json({message: 'Request Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getNewMaintenanceReq(req,res){
    try{
        await sql.connect(dbConfig);

        const request = new sql.Request();

        const query = `SELECT * FROM Maintenance_Requests`;

        const result = await request.query(query);

        return res.status(200).json(result.recordset);
    } catch(error){
        console.error('Failed to retrieve funds', error);
        return res.status(500).json({ message: 'Failed to retrieve funds' });
    }
}

module.exports = {addNewMaintenanceRequest,getNewMaintenanceReq};