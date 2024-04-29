const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

async function addReservation (req,res) {
    try {
        
        const connection = await mysql.createConnection(dbConfig);

        const {
            reservationID,
            residentName,
            startDate,
            endDate,
            paymentStatus,
        } = req.body;
        
        console.log(reservationID,residentName,startDate,endDate,paymentStatus)

        const add = 'INSERT INTO fundTypes (reservationID, residentName, startDate, endDate, paymentStatus) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, )';
        
       
        try {
            await connection.query(add, [reservationID, residentName, startDate, endDate, paymentStatus ]);
            return res.status(200).json({message: 'Reservation Successfully Added'});

        } catch (error) {
            console.error('Failed to save data',error);
            return res.status(201).json({message:'Process Failed'});
        }

        
        

    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    }
}
//methana mokkd karanne
async function getaddReservation(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        //add taable name here
        const query = `SELECT * FROM fundTypes`;

        const result = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result.recordset});

    } catch(error){
        console.error('Failed to add reservation', error);
        return res.status(500).json({ message: 'Failed to add reservation' });
    }
}
module.exports = {addReservation, getaddReservation};



































// const sql = require('mssql');
// const dbConfig = require('../config/db.config');

// async function addReservation (req,res) {
//     try {
//         await sql.connect(dbConfig);

//         const request = new sql.Request();
//         const {
//             reservationID,
//             residentName,
//             startDate,
//             endDate,
//             paymentStatus,

//         } = req.body;
        
//         console.log(reservationID,residentName,startDate,endDate,paymentStatus)
//         const insertQuery = `INSERT INTO Add_Reservation (Reservation_ID, Resident_Name, Startt_Date, End_Date, Payment_Status) VALUES (@Reservation_ID, @Resident_Name, @Startt_Date, @End_Date, @Payment_Status)`
        
//         request.input('Reservation_ID', sql.VarChar, reservationID);
//         request.input('Resident_Name', sql.VarChar, residentName);
//         request.input('Startt_Date', sql.Date, startDate);
//         request.input('End_Date', sql.Date, endDate);
//         request.input('Payment_Status', sql.VarChar, paymentStatus);
//         await request.query(insertQuery);

//         return res.status(200).json({message: 'Fund Successfully Added'});

//     } catch (error) {
//         console.error('Failed to save data',error);
//         return res.status(201).json({message:'Process Failed'});
//     }
// }

// module.exports = addReservation;