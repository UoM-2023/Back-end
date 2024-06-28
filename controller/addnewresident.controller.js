const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const multer = require("multer");
const path = require("path");

async function addNewResident(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

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
  }
}

// GET Function

async function getAllResidentsDetails(req, res) {
  try {
    console.log("Resident Get func Called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Residents_Information`;

    const [result] = await connection.query(query);
    //console.log(result);

    return res.status(200).json({
      result: result,
    });
  } catch (error) {
    console.error("Failed to retrieve Residents Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Residents Details" });
  }
}

// Get By Id Function (residentID)

async function getResidentById(req, res) {
  try {
    console.log("Called with Resident ID");

    const connection = await mysql.createConnection(dbConfig);

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
  }
}

// Get By Id Function (UnitID)

async function getResidentByUnitID(req, res) {
  try {
    console.log("Called with Unit ID");

    const connection = await mysql.createConnection(dbConfig);

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
  }
}

// DELETE Function

async function deleteResident(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

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
  }
}

// EDIT Function

async function updateResident(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

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
  }
}

module.exports = {
  addNewResident,
  getAllResidentsDetails,
  getResidentById,
  getResidentByUnitID,
  deleteResident,
  updateResident,
};
