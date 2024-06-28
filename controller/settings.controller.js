const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const bcrypt = require("bcrypt");

let connection;
// Update Password Function
async function updatePassword(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { oldPassword, userPassword } = req.body;
    const { UserID } = req.params;

    // Check if the old password is correct
    const checkPasswordQuery =
      "SELECT userPassword FROM User_Credentials WHERE UserID = ?";
    const [results] = await connection.query(checkPasswordQuery, [UserID]);

    if (results.length === 0) {
      await connection.end();
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.userPassword);
    if (!isMatch) {
      await connection.end();
      return res.status(201).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(userPassword, 8);

    // Update the password
    const updatePasswordQuery =
      "UPDATE User_Credentials SET userPassword = ? WHERE UserID = ?";
    await connection.query(updatePasswordQuery, [hashedPassword, UserID]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Failed to update password", error);
    return res.status(500).json({ message: "Failed to update password" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { updatePassword };
