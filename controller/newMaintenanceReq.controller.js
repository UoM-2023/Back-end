const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
let connection;
async function add_Maintenance_Request(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, Resident_Name, MType, Mnt_Status, M_Description } =
      req.body;

    console.log(Unit_id, Resident_Name, MType, Mnt_Status, M_Description);

    const add =
      "INSERT INTO Maintenance_Requests (Unit_id, Resident_Name, MType, Mnt_Status, requested_date, M_Description) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)";

    try {
      await connection.query(add, [
        Unit_id,
        Resident_Name,
        MType,
        Mnt_Status,
        M_Description,
      ]);
      return res
        .status(200)
        .json({ message: "New Maintenance Request Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({
      message: "Oops! There was an issue Adding Maintenance Request Details",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET all Function

async function get_All_Maintenance_Requests(req, res) {
  try {
    console.log("called");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Maintenance_Requests ORDER BY requested_date DESC`;

    const [result] = await connection.query(query);
    //console.log(result);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Maintenance Requests", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve new maintenance requests" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get By Id Function

async function get_A_Maintenance_Request(req, res) {
  try {
    console.log("Called with id la la :", req.params.id);

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Maintenance_Requests WHERE id = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Failed to retrieve a maintenance request", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve maintenance request" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getMaintenanceRequestsByUser(req, res) {
  try {
    const unitId = req.params.Unit_id;

    console.log(`Called with id Get maintenance: ${unitId}`);
    console.log("Attempting to connect to the database...");
    connection = await mysql.createConnection(dbConfig);

    console.log("Database connection established.");

    const query = `SELECT * FROM Maintenance_Requests WHERE Unit_id = ?`;

    console.log(`Executing query: ${query} with parameter ${unitId}`);
    const [rows] = await connection.query(query, [unitId]);

    console.log("Query executed. Result:", rows);

    if (rows.length === 0) {
      console.log("No maintenance requests found for this Unit_id.");
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    return res.status(200).json({ result: rows });
  } catch (error) {
    console.error("Failed to retrieve maintenance requests", error);
    return res.status(500).json({
      message: "Failed to retrieve maintenance requests",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function update_Maintenance_Request(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, Resident_Name, MType, Mnt_Status, M_Description } =
      req.body;

    const id = req.params.id;

    console.log(Unit_id, Resident_Name, MType, Mnt_Status, M_Description);

    const query =
      "UPDATE Maintenance_Requests SET Unit_id = ?, Resident_Name = ?, MType = ?, Mnt_Status = ?, M_Description = ? WHERE id = ?";

    try {
      await connection.query(query, [
        Unit_id,
        Resident_Name,
        MType,
        // Mnt_Status,
        "Pending",
        M_Description,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Maintenance request Successfully Updated" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve maintenance request", error);
    return res
      .status(500)
      .json({ message: "Failed to update maintenance request" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE Function

async function delete_Maintenance_Request(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const id = req.params.id;

    const query = "DELETE FROM Maintenance_Requests WHERE id = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Maintenance Requests successfully deleted!" });
    } catch (error) {
      console.error("Failed to delete Maintenance Requests data", error);
      return res
        .status(201)
        .json({ message: "Failed to delete Maintenance Requests data" });
    }
  } catch (error) {
    console.error("Failed to retrieve maintenance request", error);
    return res
      .status(500)
      .json({ message: "Failed to delete maintenance request" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function update_Maintenance_Request_Status(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);
    const { id } = req.params;
    const { Mnt_Status } = req.body;

    const query = "UPDATE Maintenance_Requests SET Mnt_Status = ? WHERE id = ?";

    try {
      await connection.query(query, [Mnt_Status, id]);
      return res
        .status(200)
        .json({ message: "Maintenance request status successfully updated" });
    } catch (error) {
      console.error("Failed to update status", error);
      return res.status(500).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to update status", error);
    return res
      .status(500)
      .json({ message: "Failed to update maintenance request status" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  add_Maintenance_Request,
  get_All_Maintenance_Requests,
  get_A_Maintenance_Request,
  getMaintenanceRequestsByUser,
  update_Maintenance_Request,
  delete_Maintenance_Request,
  update_Maintenance_Request_Status,
};
