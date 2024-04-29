const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function addGuestDetails (req,res) {
    try {
        
        const connection = await mysql.createConnection(dbConfig);

        const {
            unitID,
            residentName,
            guestName,
            vehicleNo,
            arrivalDate
        } = req.body;
        
        console.log(unitID,residentName,guestName,vehicleNo,arrivalDate)
            //??? gaanen mokkd wenne?
        const add = 'INSERT INTO fundTypes (unitID, residentName, guestName, vehicleNo, arrivalDate) VALUES (?, ?, ?, ?,   CURRENT_TIMESTAMP)';
        
       
        try {
            await connection.query(add, [unitID, residentName, guestName, vehicleNo, arrivalDate ]);
            return res.status(200).json({message: 'Guest Successfully Added'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

        
        

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}

async function getAllGuestDetails(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

            //add table name to here
        const query = `SELECT * FROM guestDetails`;

        const result = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to add guest details', error);
        return res.status(500).json({ message: 'Failed to add guest details' });
    }
}
module.exports = {addGuestDetails, getAllGuestDetails};





































// const sql = require('mssql');
// const dbConfig = require('../config/db.config');

// async function addGuestDetails (req,res) {
//     try {
//          sql.connect(dbConfig);

//         const request = new sql.Request();
//         const {
//             unitID,
//             residentName,
//             guestName,
//             vehicleNo,
//             arrivalDate
           
//         } = req.body;
        
//         console.log(unitID,residentName,guestName,vehicleNo,arrivalDate);
//         const insertQuery = `INSERT INTO Guest_Details (Unit_ID, Resident_Name, Guest_Name, Vehicle_Number,Arrival_Date) VALUES (@Unit_ID, @Resident_Name, @Guest_Name, @Vehicle_Number, @Arrival_Date)`
//         console.log(unitID,insertQuery);
//         request.input('Unit_ID', sql.VarChar, unitID);
//         request.input('Resident_Name', sql.VarChar, residentName);
//         request.input('Guest_Name', sql.VarChar, guestName);
//         request.input('Vehicle_Number', sql.VarChar, vehicleNo);
//         request.input('Arrival_Date', sql.Date,arrivalDate);
        
//         await request.query(insertQuery);

//         return res.status(200).json({message: 'Fund Successfully Added'});

//     } catch (error) {
//         console.error('Failed to save data',error);
//         return res.status(201).json({message:'Process Failed'});
//     }
// }

// async function getAllGuestDetails(req,res){
//     try{
        
//          await sql.connect(dbConfig);

//         const request = new sql.Request();

//         const query = `SELECT * FROM Guest_Details`;

//         const result = await request.query(query);
// console.log("results",result.recordset);
//         return res.status(200).json(result.recordset);
//     } catch(error){
//         console.error('Failed to retrieve funds', error);
//         return res.status(500).json({ message: 'Failed to retrieve funds' });
//     }
// }

// module.exports = {addGuestDetails,getAllGuestDetails};