const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const multer = require("multer");
const path = require("path");

// let connection;

async function addNewResident(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      residentID,
      UnitID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      member_type,
      email,
      mobile_no,
      Address,
    } = req.body;

    console.log(
      residentID,
      UnitID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      member_type,
      email,
      mobile_no,
      Address
    );

    const add =
      "INSERT INTO Residents_Information (residentID, UnitID, first_name, middle_name, last_name, name_with_initials, gender, dob, nic, member_type, email, mobile_no, Address ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    try {
      await connection.query(add, [
        residentID,
        UnitID,
        first_name,
        middle_name,
        last_name,
        name_with_initials,
        gender,
        dob,
        nic,
        member_type,
        email,
        mobile_no,
        Address,
      ]);
      return res
        .status(200)
        .json({ message: "New Residents Details Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Adding Residents Details" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET Function

async function getAllResidentsDetails(req, res) {
  let connection;
  try {
    console.log("Resident Get func Called");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Residents_Information LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query, [limit, offset]);

    console.log(result);
    //console.log(result);

    const totalQuery = `SELECT COUNT(*) as count FROM Residents_Information`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    return res.status(200).json({
      result: result,
      total: total,
    });
  } catch (error) {
    console.error("Failed to retrieve Residents Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Residents Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchDetails(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `SELECT * FROM Residents_Information WHERE
    residentID LIKE ? OR
    name_with_initials LIKE ? OR
    UnitID LIKE ? OR 
    nic LIKE ? OR 
    member_type LIKE ? OR
    Address LIKE ? OR
    mobile_no LIKE ? OR
    email LIKE ? 
    LIMIT ? OFFSET ?`;

    const searchPattern = `%${query}%`;
    const [result] = await connection.query(searchQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset,
    ]);

    const totalQuery = `
    SELECT COUNT(*) as count FROM Residents_Information
    WHERE residentID LIKE ? OR
    name_with_initials LIKE ? OR
    UnitID LIKE ? OR 
    nic LIKE ? OR 
    member_type LIKE ? OR
    Address LIKE ? OR
    mobile_no LIKE ? OR
    email LIKE ? 
    `;

    const [totalResult] = await connection.query(totalQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    ]);

    const total = totalResult[0].count;

    return res.status(200).json({ result: result, total: total });
  } catch (error) {
    console.error("Failed to search data", error);
    return res.status(500).json({ message: "Search Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get By Id Function (residentID)

async function getResidentById(req, res) {
  let connection;
  try {
    console.log("Called with Resident ID");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Residents_Information WHERE residentID = ?`;
    const id = req.params.residentID;

    const [result] = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Resident Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Resident Details " });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get By Id Function (UnitID)

async function getResidentByUnitID(req, res) {
  let connection;
  try {
    console.log("Called with Unit ID");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Residents_Information WHERE UnitID = ?`;
    const id = req.params.UnitID;

    const [result] = await connection.query(query, [id]);

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Resident Details by UnitID", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Resident  Details by UnitID" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE Function

async function deleteResident(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const id = req.params.residentID;

    const query = "DELETE FROM Residents_Information WHERE residentID = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Resident Details Successfully Deleted" });
    } catch (error) {
      console.error("Failed to delete Resident's data", error);
      return res
        .status(500)
        .json({ message: "Failed to delete Resident details" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res
      .status(500)
      .json({ message: "Failed to delete Resident details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function updateResident(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      UnitID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      member_type,
      email,
      mobile_no,
      Address,
    } = req.body;

    const id = req.params.residentID;

    console.log(
      UnitID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      member_type,
      email,
      mobile_no,
      Address
    );

    const query =
      "UPDATE Residents_Information SET UnitID = ?, first_name = ?, middle_name = ?, last_name = ?, name_with_initials = ?, gender = ?, dob = ?, nic = ?, member_type = ?, email = ?, mobile_no = ?, Address = ? WHERE residentID = ?";

    try {
      await connection.query(query, [
        UnitID,
        first_name,
        middle_name,
        last_name,
        name_with_initials,
        gender,
        dob,
        nic,
        member_type,
        email,
        mobile_no,
        Address,
        [id],
      ]);
      return res
        .status(200)
        .json({ message: "Resident Details Successfully Updated" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed..." });
    }
  } catch (error) {
    console.error("Failed to retrieve Resident Details", error);
    return res
      .status(500)
      .json({ message: "Failed to update Resident Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addNewResident,
  getAllResidentsDetails,
  getResidentById,
  getResidentByUnitID,
  deleteResident,
  updateResident,
  searchDetails,
};
