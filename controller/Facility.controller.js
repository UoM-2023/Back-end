const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

let connection;
//add facility
async function facilityReserve(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { facility_name, amount_charge, charge_per } = req.body;

    console.log(facility_name, amount_charge, charge_per);

    const add =
      "INSERT INTO Facilities (facility_name, amount_charge, charge_per) VALUES (?, ?, ?)";

    try {
      await connection.query(add, [facility_name, amount_charge, charge_per]);
      return res
        .status(200)
        .json({ message: "Facility reserved successfully" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(500).json({ message: "Failed to reserve facility" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Failed to connect to database" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//get all data  from facility reserve

async function getAllfacilityReserve(req, res) {
  try {
    console.log("called");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Facilities`;

    const [result] = await connection.query(query);
    console.log(result);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to get facilities", error);
    return res.status(500).json({ message: "Failed to get facilities" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//get a data from facility reserve

async function getAFacility(req, res) {
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Facilities WHERE ref_no = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to get the facility", error);
    return res.status(500).json({ message: "Failed to get the facility" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//update a facility
async function updateFacility(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { facility_name, amount_charge, charge_per } = req.body;
    const id = req.params.id;

    console.log(facility_name, amount_charge, charge_per);

    const query =
      "UPDATE Facilities SET facility_name = ?, amount_charge = ?, charge_per = ? WHERE ref_no = ?";

    try {
      connection = await mysql.createConnection(dbConfig);

      const { facility_name, amount_charge, charge_per } = req.body;

      const id = req.params.id;

      console.log(facility_name, amount_charge, charge_per);

      const query =
        "UPDATE Facilities SET facility_name = ?, amount_charge = ?, charge_per = ? WHERE ref_no = ?";

      try {
        await connection.query(query, [
          facility_name,
          amount_charge,
          charge_per,
          id,
        ]);
        return res
          .status(200)
          .json({ message: "Facility Successfully Updated" });
      } catch (error) {
        console.error("Failed to update facility", error);
        return res.status(500).json({ message: "Failed to update facility" });
      }
    } catch (error) {
      console.error("Failed to connect to database", error);
      return res.status(500).json({ message: "Failed to connect to database" });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } catch (error) {
    console.error("Failed to update facility", error);
    return res.status(500).json({ message: "Failed to update facility" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// delete facility
async function deleteFacility(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;
    const query = "DELETE FROM Facilities WHERE ref_no = ?";

    await connection.execute(query, [id]); // Use execute instead of query for prepared statements

    // If deletion is successful, return success message
    return res.status(200).json({ message: "Facility Successfully Deleted" });
  } catch (error) {
    console.error("Failed to delete data", error);
    // If deletion fails, return failure message
    return res.status(500).json({ message: "Failed to delete facility" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  facilityReserve,
  getAllfacilityReserve,
  getAFacility,
  updateFacility,
  deleteFacility,
};

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
