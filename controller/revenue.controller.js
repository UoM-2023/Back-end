const sql = require("mssql");
const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewRevenue(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

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
  }
}

async function getAllRevenues(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM revenue`;

    const result = await connection.query(query);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}
module.exports = { addNewRevenue, getAllRevenues };
