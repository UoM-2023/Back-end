const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');


//add reservations
async function addReservation (req,res) {
    try {
        
        const connection = await mysql.createConnection(dbConfig);

        const {
            facility_name,
            resident_name,
            start_date,
            end_date,
            payment_status,
            availability,
        } = req.body;
        
        console.log(facility_name,resident_name,start_date,end_date,payment_status,availability)
            
        //checkdown query parameters
        const add = 'INSERT INTO Reservations (facility_name, resident_name, start_date, end_date, requested_date, payment_status,availability) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)';
        
       
        try {
            await connection.query(add, [facility_name, resident_name, start_date, end_date, payment_status,availability ]);
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

//get all reservations

async function getAllReservations(req,res){
    try{
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        
        const query = `SELECT * FROM Reservations`;

        const result = await connection.query(query);
        console.log(result);
        return res.status(200).json({result : result});

    } catch(error){
        console.error('Failed to get all  reservations', error);
        return res.status(500).json({ message: 'Failed to get all  reservations' });
    }
}

//get a reservation

async function getAReservation(req, res) {
    try {
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);
        const query = `SELECT * FROM Reservations WHERE ref_no = ?`;
        const id = req.params.id;

        const result = await connection.query(query, [id]);
        console.log(result);

        // Check if the result is empty
        if (result.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Send the result directly
        return res.status(200).json({ result });

    } catch (error) {
        console.error('Failed to get reservation', error);
        return res.status(500).json({ message: 'Failed to get reservation' });
    }
}







//update reservation

async function updateReservation(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            facility_name,
            resident_name,
            start_date,
            end_date,
            payment_status,
            availability,
        } = req.body;

        const id = req.params.id;

        console.log(facility_name, resident_name, start_date, end_date, payment_status, availability);

        const query = 'UPDATE Reservations SET facility_name = ?, resident_name = ?, start_date = ?, end_date = ?, payment_status = ?, availability = ? WHERE ref_no = ?';

        try {
            await connection.query(query, [facility_name, resident_name, start_date, end_date, payment_status, availability, id]);
            return res.status(200).json({ message: 'Reservation Successfully Updated' });
        } catch (error) {
            console.error('Failed to update data', error);
            return res.status(201).json({ message: 'Process Failed' });
        }
    } catch (error) {
        console.error('Failed to update reservation', error);
        return res.status(500).json({ message: 'Failed to update reservation' });
    }
}




        //delete reservation

        async function deleteReservation(req, res) {
            try {
                const connection = await mysql.createConnection(dbConfig);
                const id = req.params.id;
        
                const query = 'DELETE FROM Reservations WHERE ref_no = ?';
        
                try {
                    await connection.query(query, [id]);
                    // If deletion succeeds, return success message
                    return res.status(200).json({ message: 'Reservation Successfully Deleted' });
                } catch (error) {
                    // If deletion fails, return appropriate error message
                    console.error('Failed to Delete data', error);
                    return res.status(500).json({ message: 'Failed to delete reservation' });
                }
            } catch (error) {
                console.error('Failed to Delete data', error);
                return res.status(500).json({ message: 'Failed to delete reservation' });
            }
        }
        



module.exports = {addReservation, getAllReservations, getAReservation, updateReservation, deleteReservation};



































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