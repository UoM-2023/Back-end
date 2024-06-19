const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');


//add facility
async function facilityReserve(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            facility_name,
            amount_charge,
            charge_per,
            availability
        } = req.body;

        console.log(facility_name, amount_charge, charge_per,availability);

        const add = 'INSERT INTO Facilities (facility_name, amount_charge, charge_per, availability) VALUES (?, ?, ?, ?)';

        try {
            await connection.query(add, [facility_name, amount_charge, charge_per, 'Available']);
            return res.status(200).json({ message: 'Facility reserved successfully' });
        } catch (error) {
            console.error('Failed to save data', error);
            return res.status(500).json({ message: 'Failed to reserve facility' });
        }
    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Failed to connect to database' });
    }
}


//get all data  from facility reserve

async function getAllfacilityReserve(req, res) {
    try {
        console.log("called");

        const connection = await mysql.createConnection(dbConfig);

        const query = `SELECT * FROM Facilities`;

        const [result] = await connection.query(query);
        console.log(result); 

        
        return res.status(200).json({ result: result }); 

    } catch (error) {
        console.error('Failed to get facilities', error);
        return res.status(500).json({ message: 'Failed to get facilities' });
    }
}

//get a data from facility reserve

async function getAFacility(req, res) {
    try {
        console.log("Called with id");

        const connection = await mysql.createConnection(dbConfig);

        const query = `SELECT * FROM Facilities WHERE ref_no = ?`;
        const id = req.params.id;

        const result = await connection.query(query, [id]);
        console.log(result);

        
        return res.status(200).json({ result: result });

    } catch (error) {
        console.error('Failed to get the facility', error);
        return res.status(500).json({ message: 'Failed to get the facility' });
    }
}



//update a facility
async function updateFacility(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {
            facility_name,
            amount_charge,
            charge_per,
            availability
        } = req.body;

        const id = req.params.id;

        console.log(facility_name, amount_charge, charge_per, availability);

        const query = 'UPDATE Facilities SET facility_name = ?, amount_charge = ?, charge_per = ?, availability = ? WHERE ref_no = ?';

        try {
            await connection.query(query, [facility_name, amount_charge, charge_per, availability, id]);
            return res.status(200).json({ message: 'Facility Successfully Updated' });

        } catch (error) {
            console.error('Failed to update facility', error);
            return res.status(500).json({ message: 'Failed to update facility' });
        }

    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Failed to connect to database' });
    }
}


//delete facility
async function deleteFacility(req, res) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const id = req.params.id;

        const query = 'DELETE FROM Facilities WHERE ref_no = ?';

        try {
            await connection.query(query, [id]);
            // If deletion is successful, return success message
            return res.status(200).json({ message: 'Facility Successfully Deleted' });
        } catch (error) {
            console.error('Failed to delete data', error);
            // If deletion fails, return failure message
            return res.status(500).json({ message: 'Failed to delete facility' });
        }

    } catch (error) {
        console.error('Failed to connect to database', error);
        return res.status(500).json({ message: 'Failed to connect to database' });
    }
}




module.exports = {facilityReserve, getAllfacilityReserve, getAFacility,updateFacility,deleteFacility};




































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