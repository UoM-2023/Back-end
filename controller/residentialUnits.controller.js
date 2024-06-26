const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

let connection;

async function addNewUnit(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Unit_id, Block_no, Building, Category, RStatus } = req.body;

    console.log(Unit_id, Block_no, Building, Category, RStatus);

    const addQuery =
      "INSERT INTO ResidentialUnit (Unit_id, Block_no, Building, Category, RStatus) VALUES (?, ?, ?, ?, ?)";

    try {
      const [result] = await connection.query(addQuery, [
        Unit_id,
        Block_no,
        Building,
        Category,
        RStatus,
      ]); // Ensure the order of parameters matches the query
      // Assuming Unit_id is auto-incremented, no need to include it in the query or parameters
      console.log("Inserted ID:", result.insertId); // Log the ID of the inserted row
      await connection.end(); // Close the connection after query execution
      return res
        .status(200)
        .json({ message: "Residential Unit Successfully Added" });
    } catch (error) {
      console.error("Failed to save data", error);
      await connection.end(); // Close the connection in case of error
      return res.status(500).json({ message: "Internal Server Error" }); // Return appropriate error response
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Internal Server Error" }); // Return appropriate error response
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllUnits(req, res) {
  try {
    console.log("Called");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM ResidentialUnit`;

    try {
      const [rows] = await connection.query(query);
      await connection.end(); // Close the connection
      return res.status(200).json({ units: rows });
    } catch (error) {
      console.error("Failed to retrieve residential units:", error);
      await connection.end(); // Ensure the connection is closed in case of error
      return res
        .status(500)
        .json({ message: "Failed to retrieve residential units" });
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve residential units" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAUnit(req, res) {
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Unit ID is required" });
    }

    const query = `SELECT * FROM ResidentialUnit WHERE Unit_id = ?`;

    try {
      const [rows] = await connection.query(query, [id]);
      await connection.end(); // Close the connection
      return res.status(200).json({ result: rows });
    } catch (error) {
      console.error("Failed to retrieve residential unit:", error);
      await connection.end(); // Ensure the connection is closed in case of error
      return res
        .status(500)
        .json({ message: "Failed to retrieve residential unit" });
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve residential unit" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function updateUnit(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { Block_no, Building, Category, RStatus } = req.body;

    const id = req.params.Unit_id;

    console.log(id, Block_no, Building, Category, RStatus);

    const query =
      "UPDATE ResidentialUnit SET Block_no = ?, Building = ?, Category = ?, RStatus = ? WHERE Unit_id = ?";

    try {
      await connection.query(query, [
        Block_no,
        Building,
        Category,
        RStatus,
        [id],
      ]);
      return res
        .status(200)
        .json({ message: "Residential Unit Successfully Updated!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Updating Unit Details" });
    }
  } catch (error) {
    console.error("Failed to retrieve residential unit", error);
    return res
      .status(500)
      .json({ message: "Failed to update residential unit" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function deleteUnit(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM ResidentialUnit WHERE Unit_id = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Residential Unit Successfully Deleted" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve residential unit", error);
    return res
      .status(500)
      .json({ message: "Failed to update residential unit" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { addNewUnit, getAllUnits, getAUnit, updateUnit, deleteUnit };
