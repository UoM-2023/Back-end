const sql = require('mssql');
const dbConfig = require('../config/db.config');

async function facilityReserve (req,res) {
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        const {
            faciName,
            unit,
            residentName
            
           
        } = req.body;
        
        console.log(faciName,unit,residentName)
        const insertQuery = `INSERT INTO Add_Facility (Faciity_ID,Facility_Name, Unit_ID, Resident_Name,) VALUES (@Faciity_ID, @Facility_Name, @Unit_ID, @Resident_Name)`
        
        request.input('Faciity_ID', sql.VarChar, unitID);
        request.input('Facility_Name', sql.VarChar, residentName);
        request.input('Unit_ID', sql.VarChar, guestName);
        request.input('Resident_Name', sql.VarChar, vehicleNo);
        
        
        await request.query(insertQuery);

        return res.status(200).json({message: 'Fund Successfully Added'});

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

module.exports = facilityReserve;