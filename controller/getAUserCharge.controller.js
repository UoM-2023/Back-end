const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

let connection
async function getAUserCharge(req, res) {
    try {
        console.log("Called");
        const connection = await mysql.createConnection(dbConfig);
        const query = `SELECT * FROM balance WHERE unit_id = ?`;
        const id = req.params.id;

        const result = await connection.query(query, [id]);
        console.log(result[0]);
        return res.status(200).json({ result: result[0] });
    } catch (error) {
        console.error("Failed to save data", error);
        return res.status(201).json({ message: "Process Failed" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = { getAUserCharge };
