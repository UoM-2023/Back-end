const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewResident(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
      residentID,
      building,
      block_no,
      unit_category,
      unit_no,
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
      building,
      block_no,
      unit_category,
      unit_no,
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
      "INSERT INTO Residents_Information (residentID, building, block_no, unit_category, unit_no, first_name, middle_name, last_name, name_with_initials, gender, dob, nic, member_type, email, mobile_no, Address ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";

    try {
      await connection.query(add, [
        residentID,
        building,
        block_no,
        unit_category,
        unit_no,
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
        .json({ message: "New Residents Details Successfully Added" });
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

async function getAllResidentsDetails(req, res) {
  try {
    console.log("called");

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
module.exports = { addNewResident, getAllResidentsDetails };
