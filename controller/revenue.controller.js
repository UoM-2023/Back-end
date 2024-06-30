const sql = require("mssql");
const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// let connection;

async function addNewRevenue(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { paid_by, amount, rType, payment_method, staff_id } = req.body;

    console.log(paid_by, amount, rType, payment_method, staff_id);

    const add = `INSERT INTO revenue (paid_by, amount, rType, payment_method, staff_id, added_date) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;

    try {
      await connection.query(add, [
        paid_by,
        amount,
        rType,
        payment_method,
        staff_id,
      ]);
      return res
        .status(200)
        .json({ message: "New Revenue Details Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue Adding Revenue Details" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res
      .status(201)
      .json({ message: "Oops! There was an issue Adding Revenue Details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllRevenues(req, res) {
  let connection;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM revenue ORDER BY added_date DESC LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query, [limit, offset]);

    const totalQuery = `SELECT COUNT(*) as count FROM revenue`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    return res.status(200).json({ result: result, total: total });
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
async function searchRevenues(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `
      SELECT * FROM revenue
      WHERE revenue_id LIKE ? OR
            paid_by LIKE ? OR
            amount LIKE ? OR
            rType LIKE ? OR
            payment_method LIKE ? OR
            staff_id LIKE ? OR
            added_date LIKE ?
      ORDER BY added_date DESC
      LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${query}%`;
    const [result] = await connection.query(searchQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset
    ]);

    const totalQuery = `
      SELECT COUNT(*) as count FROM revenue
      WHERE revenue_id LIKE ? OR
            paid_by LIKE ? OR
            amount LIKE ? OR
            rType LIKE ? OR
            payment_method LIKE ? OR
            staff_id LIKE ? OR
            added_date LIKE ?
    `;

    const [totalResult] = await connection.query(totalQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern
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

module.exports = { addNewRevenue, getAllRevenues, searchRevenues };
