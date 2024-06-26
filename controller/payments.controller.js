const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewPayment(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

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
        newUtilityBlanace = balance[0].sinking_balance - amount;
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
  }
}

async function getAllPayments(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const query = "SELECT * FROM recieved_payments";

    const result = await connection.query(query);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}
module.exports = { addNewPayment, getAllPayments };
