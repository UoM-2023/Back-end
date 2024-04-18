const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const { rows } = require("mssql");

async function addNewStaff(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
      staffID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      staff_category,
      qualification,
      email,
      mobile_no,
      Address,
      city,
    } = req.body;

    console.log(
      staffID,
      first_name,
      middle_name,
      last_name,
      name_with_initials,
      gender,
      dob,
      nic,
      staff_category,
      qualification,
      email,
      mobile_no,
      Address,
      city
    );

    const add =
      "INSERT INTO Staff_Information (staffID, first_name, middle_name, last_name, name_with_initials, gender, dob, nic, staff_category, qualification, email, mobile_no, Address, city ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    try {
      await connection.query(add, [
        staffID,
        first_name,
        middle_name,
        last_name,
        name_with_initials,
        gender,
        dob,
        nic,
        staff_category,
        qualification,
        email,
        mobile_no,
        Address,
        city,
      ]);
      return res
        .status(200)
        .json({ message: "New Staff Details Successfully Added" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

// GET Function

async function getAllStaffDetails(req, res) {
  try {
    console.log("called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Staff_Information`;

    const [result] = await connection.query(query);
    //console.log(result);
    //res.send(result);

    return res.status(200).json({
      result: result,
    });
  } catch (error) {
    console.error("Failed to retrieve Staff Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Staff Details" });
  }
}

// DELETE Function

async function deleteStaff(req, res) {
  try {
    console.log("Deleted..");

    const connection = await mysql.createConnection(dbConfig);

    const del = "DELETE FROM Staff_Information WHERE staffID = ?";

    await connection.query(del, [req.params.staffID], (err, rows, fields) => {
      if (!err) res.send("Deleted Successfully");
      //console.log("Deleted Successfully");
      else console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
}

// EDIT Function

module.exports = { addNewStaff, getAllStaffDetails, deleteStaff };
