const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewPayment(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const { user_id, unit_id, charge_type, method, amount, payment_id } =
      req.body;

    console.log("Recieved: ", charge_type, amount);

    const query =
      "INSERT INTO recieved_payments (payment_id, unit_id, method, charge_type, payment_date, amount) VALUES (?, ?, ?, ?,CURRENT_TIMESTAMP, ?)";

    await connection.query(query, [
      payment_id,
      unit_id,
      method,
      charge_type,
      amount,
    ]);

    // Handling the recieved payments
    let newManagementBalance = 0;
    let newSinkingBalance = 0;
    let newUtilityBlanace = 0;
    const [balance] = await connection.query(
      "SELECT * FROM balance WHERE unit_id = ?",
      [unit_id]
    );
    switch (charge_type) {
      case "Management":
        newManagementBalance = balance[0].management_balance - amount;
        break;

      case "Sinking":
        newSinkingBalance = balance[0].sinking_balance - amount;
        break;

      case "Utility":
        newUtilityBlanace = balance[0].utility_balance - amount;
        break;

      case "All":
        newManagementBalance = 0;
        newSinkingBalance = 0;
        newUtilityBlanace = 0;
        break;

      default:
        console.log("Process Failed");
        break;
    }

    await connection.query(
      "UPDATE balance SET utility_balance = ?, sinking_balance = ?, management_balance = ? WHERE unit_id = ?",
      [newUtilityBlanace, newSinkingBalance, newManagementBalance, unit_id]
    );
    return res.status(200).json({ message: "Balance Successfully Updated" });
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllPayments(req, res) {
  let connection;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query =
      "SELECT rp.*, ri.name_with_initials FROM recieved_payments rp INNER JOIN Residents_Information ri ON rp.unit_id = ri.UnitID AND member_type = 'Owner' ORDER BY rp.payment_date DESC LIMIT ? OFFSET ?";

    const result = await connection.query(query, [limit, offset]);
    console.log(result);

    const totalQuery = `SELECT COUNT(*) as count 
      FROM recieved_payments rp INNER JOIN Residents_Information ri ON rp.unit_id = ri.UnitID AND ri.member_type = 'Owner'`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;
    return res.status(200).json({ result: result, total: total });
  } catch (error) {
    console.error("Failed to retrieve data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchPayments(req, res) {
  let connection;
  try {
    const queryParam = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    console.log("Search Called");

    const searchQuery = `
      SELECT rp.*, ri.name_with_initials 
      FROM recieved_payments rp 
      INNER JOIN Residents_Information ri 
      ON rp.unit_id = ri.UnitID 
      AND member_type = 'Owner'
      WHERE rp.payment_id LIKE ? OR
            ri.name_with_initials LIKE ? OR
            rp.amount LIKE ? OR
            rp.payment_date LIKE ?
      ORDER BY rp.payment_date DESC
      LIMIT ? OFFSET ?
    `;

    const searchPattern = `%${queryParam}%`;
    const [result] = await connection.query(searchQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset,
    ]);

    const totalQuery = `
      SELECT COUNT(*) as count 
      FROM recieved_payments rp 
      INNER JOIN Residents_Information ri 
      ON rp.unit_id = ri.UnitID 
      AND ri.member_type = 'Owner'
      WHERE rp.payment_id LIKE ? OR
            ri.name_with_initials LIKE ? OR
            rp.amount LIKE ? OR
            rp.payment_date LIKE ?
      ORDER BY rp.payment_date DESC
    `;

    const [totalResult] = await connection.query(totalQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    ]);

    const total = totalResult[0].count;

    console.log(result);

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
module.exports = { addNewPayment, getAllPayments, searchPayments };
