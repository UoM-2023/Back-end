const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
let connection;

async function addNewFund(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { fundName, chargedBy, amount, timePeriod, modifiedBy } = req.body;

    console.log(fundName, chargedBy, amount, timePeriod, modifiedBy);

    const add =
      "INSERT INTO fundTypes (fundName, chargedBy, amount, timePeriod, modified_by, modified_date) VALUES (?, ?, ?, ?, ?,  CURRENT_TIMESTAMP)";

    try {
      await connection.query(add, [
        fundName,
        chargedBy,
        amount,
        timePeriod,
        modifiedBy,
      ]);
      return res.status(200).json({ message: "New Fund Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Adding New Fund Details" });
    } 
  } catch (error) {
    console.error("Failed to save data", error);
    return res
      .status(201)
      .json({ message: "Oops! There was an issue Adding New Fund Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET all Function

async function getAllFunds(req, res) {
  try {
    console.log("called");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM fundTypes`;

    const result = await connection.query(query);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve funds", error);
    return res.status(500).json({ message: "Failed to retrieve funds" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Get By Id Function

async function getAFund(req, res) {
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM fundTypes WHERE fund_id = ?`;
    const id = req.params.id;

    const result = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve fund", error);
    return res.status(500).json({ message: "Failed to retrieve fund" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE Function

async function deleteFund(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const id = req.params.fund_id;

    const query = "DELETE FROM fundTypes WHERE fund_id = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Fund Type Details Successfully Deleted!" });
    } catch (error) {
      console.error("Failed to delete Fund Type data", error);
      return res
        .status(500)
        .json({ message: "Failed to Delete Fund Type details" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res
      .status(500)
      .json({ message: "Failed to delete Fund Type details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function updateFund(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { fundName, chargedBy, amount, timePeriod, modifiedBy } = req.body;

    const id = req.params.id;

    console.log(fundName, chargedBy, amount, timePeriod, modifiedBy);

    const query =
      "UPDATE fundTypes SET fundName = ?, chargedBy = ?, amount = ?, timePeriod = ?, modified_by = ?, modified_date = CURRENT_TIMESTAMP WHERE fund_id = ?";

    try {
      await connection.query(query, [
        fundName,
        chargedBy,
        amount,
        timePeriod,
        modifiedBy,
        id,
      ]);
      return res.status(200).json({ message: "Fund Successfully Updated!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Updating Fund Details" });
    }
  } catch (error) {
    console.error("Failed to retrieve fund", error);
    return res
      .status(500)
      .json({ message: "Oops! There was an issue Updating Fund Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { addNewFund, getAllFunds, getAFund, updateFund, deleteFund };
