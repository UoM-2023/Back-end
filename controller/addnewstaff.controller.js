const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function

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
        .json({ message: "New Staff Details Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Adding Staff Details" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res
      .status(201)
      .json({ message: "Oops! There was an issue Adding Staff Details" });
  }
}

// GET all Function

async function getAllStaffDetails(req, res) {
  try {
    console.log("Staff Get func Called");

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

// Get By Id Function

async function getStaffById(req, res) {
  try {
    console.log("Called with Staff ID");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Staff_Information WHERE staffID = ?`;
    const id = req.params.staffID;

    const [result] = await connection.query(query, [id]);
    console.log(result);
    
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Staff Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Staff Details " });
  }
}

// DELETE Function

async function deleteStaff(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const id = req.params.staffID;

    const query = "DELETE FROM Staff_Information WHERE staffID = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Staff Details Successfully Deleted" });
    } catch (error) {
      console.error("Failed to delete staff data", error);
      return res
        .status(500)
        .json({ message: "Failed to delete staff details" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Failed to delete staff details" });
  }
}

// EDIT Function

async function updateStaff(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
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

    const id = req.params.staffID;

    console.log(
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

    const query =
      "UPDATE Staff_Information SET first_name = ?, middle_name = ?, last_name = ?, name_with_initials = ?, gender = ?, dob = ?, nic = ?, staff_category = ?, qualification = ?, email = ?, mobile_no = ?, Address = ?, city = ? WHERE staffID = ?";

    try {
      await connection.query(query, [
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
        [id],
      ]);
      return res
        .status(200)
        .json({ message: "Staff Details Successfully Updated!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Updating Staff Details" });
    }
  } catch (error) {
    console.error("Failed to retrieve Staff Details", error);
    return res
      .status(500)
      .json({ message: "Oops! Failed to update Staff Details." });
  }
}

module.exports = {
  addNewStaff,
  getAllStaffDetails,
  getStaffById,
  deleteStaff,
  updateStaff,
};
