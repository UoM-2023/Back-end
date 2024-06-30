const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
async function addNewExpense(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET all Function

async function getAllExpenses(req, res) {
  let connection;
  try {
    console.log("called");

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM expenses ORDER BY added_date DESC LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query,[limit,offset]);

    const totalQuery = `SELECT COUNT(*) as count FROM revenue`;

    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    console.log(result);
    return res.status(200).json({ result: result, total: total });
  } catch (error) {
    console.error("Failed to retrieve expenses", error);
    return res.status(500).json({ message: "Failed to retrieve expenses" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchExpenses(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    console.log("Search Called");
    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `
      SELECT * FROM expenses
      WHERE expense_id LIKE ? OR
            amount LIKE ? OR
            eType LIKE ? OR
            payment_method LIKE ? OR
            staff_id LIKE ? OR
            added_date LIKE ? OR
            remark LIKE ?
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
      SELECT COUNT(*) as count FROM expenses
      WHERE expense_id LIKE ? OR
            amount LIKE ? OR
            eType LIKE ? OR
            payment_method LIKE ? OR
            staff_id LIKE ? OR
            added_date LIKE ? OR
            remark LIKE ?
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
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
// Get By Id Function

async function getAExpensesByID(req, res) {
  try {
    console.log("Called with id");

    let connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM expenses WHERE id = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve expenses", error);
    return res.status(500).json({ message: "Failed to retrieve expenses" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function updateExpenses(req, res) {
  try {
    let connection = await mysql.createConnection(dbConfig);

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
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addNewExpense,
  getAllExpenses,
  getAExpensesByID,
  updateExpenses,
  searchExpenses
};
