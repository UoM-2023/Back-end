const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
async function add_Maintenance_Request(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, MType, Mnt_Status, M_Description } = req.body;

    console.log(Unit_id, MType, Mnt_Status, M_Description);

    const add =
      "INSERT INTO Maintenance_Requests (Unit_id, MType, Mnt_Status, requested_date, M_Description) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)";

    try {
      await connection.query(add, [Unit_id, MType, Mnt_Status, M_Description]);
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
  let connection;
  try {
    console.log("called");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Maintenance_Requests ORDER BY requested_date DESC LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query, [limit, offset]);
    //console.log(result);

    const totalQuery = `SELECT COUNT(*) as count FROM Maintenance_Requests`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    return res.status(200).json({ result: result, total: total });
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

async function searchMaintenanceDetails(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log("This is called");
    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `SELECT * FROM Maintenance_Requests WHERE
      Mnt_Request_id LIKE ? OR
      Unit_id LIKE ? OR 
      MType LIKE ? OR 
      Mnt_Status LIKE ? OR
      requested_date LIKE ? OR
      M_Description LIKE ?
    ORDER BY requested_date DESC
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
    SELECT COUNT(*) as count FROM Maintenance_Requests
    WHERE Mnt_Request_id LIKE ? OR
    Unit_id LIKE ? OR 
    MType LIKE ? OR 
    Mnt_Status LIKE ? OR
    requested_date LIKE ? OR
    M_Description LIKE ?
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

async function get_A_Maintenance_Request(req, res) {
  let connection;
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
  let connection;
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
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, MType, Mnt_Status, M_Description } = req.body;

    const id = req.params.id;

    console.log(Unit_id, MType, Mnt_Status, M_Description);

    const query =
      "UPDATE Maintenance_Requests SET Unit_id = ?, MType = ?, Mnt_Status = ?, M_Description = ? WHERE id = ?";

    try {
      await connection.query(query, [
        Unit_id,
        ,
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

//update cancel requests
async function update_Cancelled_Maintenance_Request(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, MType, Mnt_Status, M_Description } = req.body;

    // Convert id to integer
    const id = parseInt(req.params.id, 10); // Assuming id is passed as string from frontend

    console.log(Unit_id, MType, Mnt_Status, M_Description, id);

    const query =
      "UPDATE Maintenance_Requests SET Unit_id = ?, MType = ?, Mnt_Status = ?, M_Description = ? WHERE id = ?";

    try {
      await connection.query(query, [
        Unit_id,
        MType,
        Mnt_Status,
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
  let connection;
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
  let connection;
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
  update_Cancelled_Maintenance_Request,
  delete_Maintenance_Request,
  update_Maintenance_Request_Status,
  searchMaintenanceDetails,
};
