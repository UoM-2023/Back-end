const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addMonthlyCharges(req, res) {
  try {
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}
