const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function

async function add_Internal_Mnt_Request(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
      Maintenance,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Internal_Mnt_Payment_id,
      Description,
    } = req.body;

    console.log(
      Maintenance,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Internal_Mnt_Payment_id,
      Description
    );
    const add =
      "INSERT INTO Internal_Mnt_Requests (Maintenance, ServiceProvider, MobileNo, completed_date, Payment_Status, Internal_Mnt_Payment_id, Description) VALUES (?, ?, ?, ?, ?, ?, ?)";

    try {
      await connection.query(add, [
        Maintenance,
        ServiceProvider,
        MobileNo,
        completed_date,
        Payment_Status,
        Internal_Mnt_Payment_id,
        Description,
      ]);
      return res
        .status(200)
        .json({ message: "Internal Maintenance Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({
        message: "Oops! There was an issue Adding Internal Maintenance Details",
      });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({
      message: "Oops! There was an issue Adding Internal Maintenance Details",
    });
  }
}

async function get_All_Internal_Mnt_Requests(req, res) {
  try {
    console.log("called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Internal_Mnt_Requests`;

    const [result] = await connection.query(query);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Internal Maintenance Requests", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Internal Maintenance Requests" });
  }
}

async function get_A_Internal_Mnt_Request(req, res) {
  try {
    console.log("Called with id");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Internal_Mnt_Requests WHERE id = ?`;
    const id = req.params.id;

    const result = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Internal Maintenance Requests", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Internal Maintenance Requests" });
  }
}

async function update_Internal_Mnt_Request(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const {
      Maintenance,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Internal_Mnt_Payment_id,
      Description,
    } = req.body;

    const id = req.params.id;

    console.log(
      Maintenance,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Internal_Mnt_Payment_id,
      Description
    );

    const query =
      "UPDATE Internal_Mnt_Requests SET Maintenance = ?, ServiceProvider = ?, MobileNo = ?,completed_date = ? ,Payment_Status = ?, Internal_Mnt_Payment_id=?, Description=? WHERE Internal_Mnt_Request_id = ?";

    try {
      await connection.query(query, [
        Maintenance,
        ServiceProvider,
        MobileNo,
        completed_date,
        Payment_Status,
        Internal_Mnt_Payment_id,
        Description,
        id,
      ]);
      return res
        .status(200)
        .json({
          message: "Internal Maintenance Details Successfully Updated!",
        });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve Internal Maintenance ", error);
    return res
      .status(500)
      .json({ message: "Failed to Update Internal Maintenance" });
  }
}

async function delete_Internal_Mnt_Request(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM Internal_Mnt_Requests WHERE id = ?";

    try {
      await connection.query(query, [id]);
      return res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve Internal Maintenance Request", error);
    return res
      .status(500)
      .json({ message: "Failed to update Internal Maintenance Request" });
  }
}
module.exports = {
  add_Internal_Mnt_Request,
  get_All_Internal_Mnt_Requests,
  get_A_Internal_Mnt_Request,
  update_Internal_Mnt_Request,
  delete_Internal_Mnt_Request,
};
