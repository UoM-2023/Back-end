const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function updateBalanace(req, res) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = `SELECT fundName, amount FROM fundTypes`;

        let sinkingFundAmount = 0;
        let managementFundAmount = 0;

        const [funds] = await connection.query(query);



        console.log(funds);

        funds.forEach(fund => {
            if (fund.fundName === 'Sinking') {
              sinkingFundAmount = fund.amount;
            } else if (fund.fundName === 'Management') {
              managementFundAmount = fund.amount;
            }
        });
        
        const updateQuery = `
            UPDATE balance
            SET sinking_balance = COALESCE(sinking_balance, 0) + ?,
                management_balance = COALESCE(management_balance, 0) + ?
        `;
        console.log(managementFundAmount, sinkingFundAmount)
        const [updateResult] = await connection.query(updateQuery,[sinkingFundAmount, managementFundAmount]);

        console.log('Balances updated successfully', updateResult);

        // return res.status(200).json({ message: "Balances Updated Successfully" });

        
    } catch (error) {
        console.error("Failed to save data", error);
        return res.status(201).json({ message: "Process Failed" });
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

module.exports = { updateBalanace }