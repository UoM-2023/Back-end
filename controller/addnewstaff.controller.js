const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
// let connection;

async function addNewStaff(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET all Function

async function getAllStaffDetails(req, res) {
  let connection;
  try {
    console.log("Staff Get func Called");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Staff_Information LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query, [limit, offset]);
    //console.log(result);
    //res.send(result);

    const totalQuery = `SELECT COUNT(*) as count FROM Staff_Information`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    return res.status(200).json({
      result: result,
      total: total,
    });
  } catch (error) {
    console.error("Failed to retrieve Staff Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Staff Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchStaffDetails(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `SELECT * FROM Staff_Information WHERE
    staffID LIKE ? OR
    name_with_initials LIKE ? OR
    nic LIKE ? OR 
    staff_category LIKE ? OR
    email LIKE ? OR
    city LIKE ? 
    LIMIT ? OFFSET ?`;

    const searchPattern = `%${query}%`;
    const [result] = await connection.query(searchQuery, [
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
    SELECT COUNT(*) as count FROM Staff_Information
    WHERE staffID LIKE ? OR
    name_with_initials LIKE ? OR
    nic LIKE ? OR 
    staff_category LIKE ? OR
    email LIKE ? OR
    city LIKE ?
    `;

    const [totalResult] = await connection.query(totalQuery, [
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
// Get By Id Function

async function getStaffById(req, res) {
  try {
    console.log("Called with Staff ID");

    connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE Function

async function deleteStaff(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function updateStaff(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addNewStaff,
  getAllStaffDetails,
  getStaffById,
  deleteStaff,
  updateStaff,
  searchStaffDetails,
};
