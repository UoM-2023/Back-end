const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function

async function addNewExpense(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { expense_id, amount, eType, payment_method, staff_id, remark } =
      req.body;

    console.log(expense_id, amount, eType, payment_method, staff_id, remark);
    const add =
      "INSERT INTO expenses (amount, eType, payment_method, staff_id, added_date, remark) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)";

    try {
      await connection.query(add, [
        amount,
        eType,
        payment_method,
        staff_id,
        remark,
      ]);
      return res
        .status(200)
        .json({ message: "New Expenses Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({
        message: "Oops! There was an issue Adding New Expenses Details",
      });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({
      message: "Oops! There was an issue Adding New Expenses Details",
    });
  }
}

// GET all Function

async function getAllExpenses(req, res) {
  try {
    console.log("called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM expenses`;

    const [result] = await connection.query(query);

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve expenses", error);
    return res.status(500).json({ message: "Failed to retrieve expenses" });
  }
}

// Get By Id Function

async function getAExpensesByID(req, res) {
  try {
    console.log("Called with id");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM expenses WHERE id = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve expenses", error);
    return res.status(500).json({ message: "Failed to retrieve expenses" });
  }
}

// EDIT Function

async function updateExpenses(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { amount, eType, payment_method, staff_id, remark } = req.body;

    const id = req.params.id;

    console.log(amount, eType, payment_method, staff_id, remark);

    const query =
      "UPDATE expenses SET amount = ?, eType = ?, payment_method = ?, staff_id = ?, remark = ? WHERE id = ?";

    try {
      await connection.query(query, [
        amount,
        eType,
        payment_method,
        staff_id,
        remark,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Expenses Details Successfully Updated!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({
        message: "Oops! There was an issue Updating Expenses Details",
      });
    }
  } catch (error) {
    console.error("Failed to retrieve fund", error);
    return res
      .status(500)
      .json({ message: "Oops! There was an issue Updating Expenses Details" });
  }
}

module.exports = {
  addNewExpense,
  getAllExpenses,
  getAExpensesByID,
  updateExpenses,
};
