const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function facilityReserve (req,res) {
    try {
        
        const connection = await mysql.createConnection(dbConfig);

        const {
            faciName,
            unit,
            residentName
        } = req.body;
        
        console.log(faciName,unit,residentName)

        const add = 'INSERT INTO fundTypes (faciName, unit, residentName) VALUES (?, ?, ?)';
        
       
        try {
            await connection.query(add, [faciName, unit, residentName ]);
            return res.status(200).json({message: 'Facility reserve Successfully'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

        
        

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}



async function getfacilityReserve(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        //add a table name
        const query = `SELECT * FROM fundTypes`;

        const result = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to reserve the facility', error);
        return res.status(500).json({ message: 'Failed to reserve the facility' });
    }
}
module.exports = {facilityReserve, getfacilityReserve};




































// const sql = require('mssql');
// const dbConfig = require('../config/db.config');

// async function facilityReserve (req,res) {
//     try {
//         await sql.connect(dbConfig);

//         const request = new sql.Request();
//         const {
//             faciName,
//             unit,
//             residentName
            
           
//         } = req.body;
        
//         console.log(faciName,unit,residentName)
//         const insertQuery = `INSERT INTO Add_Facility (Faciity_ID,Facility_Name, Unit_ID, Resident_Name,) VALUES (@Faciity_ID, @Facility_Name, @Unit_ID, @Resident_Name)`
        
//         request.input('Faciity_ID', sql.VarChar, unitID);
//         request.input('Facility_Name', sql.VarChar, residentName);
//         request.input('Unit_ID', sql.VarChar, guestName);
//         request.input('Resident_Name', sql.VarChar, vehicleNo);
        
        
//         await request.query(insertQuery);

//         return res.status(200).json({message: 'Fund Successfully Added'});

//     } catch (error) {
//         console.error('Failed to save data',error);
//         return res.status(201).json({message:'Process Failed'});
//     }
// }

// module.exports = facilityReserve;