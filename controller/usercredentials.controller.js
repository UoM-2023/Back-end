const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const { rows } = require("mssql");

async function usercredentials(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { UserID, userRole, userPassword, Confirmpassword } = req.body;

    console.log(UserID, userRole, userPassword, Confirmpassword);

    const add =
      "INSERT INTO User_Credentials (UserID, userRole, userPassword ) VALUES (?, ?, ?)";

    try {
      await connection.query(add, [
        UserID,
        userRole,
        userPassword,
        Confirmpassword,
      ]);
      return res
        .status(200)
        .json({ message: "New User Account Successfully Added" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

// GET Function

async function getAllUserCredentials(req, res) {
  try {
    console.log("User Credentials Get func Called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM User_Credentials`;

    const [result] = await connection.query(query);
    //console.log(result);
    //res.send(result);

    return res.status(200).json({
      result: result,
    });
  } catch (error) {
    console.error("Failed to retrieve User Credentials Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve User Credentials Details" });
  }
}

// Get By Id Function

async function getAllUserCredentialsById(req, res) {
  try {
    console.log("Called with User ID");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM User_Credentials WHERE UserID = ?`;
    const id = req.params.UserID;

    const result = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve User Credentials Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Staff Details " });
  }
}

// DELETE Function

async function deleteUserCredentials(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const id = req.params.UserID;

    const query = "DELETE FROM User_Credentials WHERE UserID = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "User Account Successfully Deleted" });
    } catch (error) {
      console.error("Failed to delete User Credentials data", error);
      return res
        .status(500)
        .json({ message: "Failed to delete staff details" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res
      .status(500)
      .json({ message: "Failed to delete User Credentials" });
  }
}

// EDIT Function

async function updateUserCredentials(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { userRole, userPassword, Confirmpassword } = req.body;

    const id = req.params.UserID;

    console.log(userRole, userPassword, Confirmpassword);

    const query =
      "UPDATE User_Credentials SET userPassword = ?, userRole = ? WHERE UserID = ?";

    try {
      await connection.query(query, [userRole, userPassword, [id]]);
      return res
        .status(200)
        .json({ message: "User Credentials Successfully Updated" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed..." });
    }
  } catch (error) {
    console.error("Failed to retrieve User Credentials", error);
    return res.status(500).json({ message: "Failed to update Staff Details" });
  }
}

module.exports = {
  usercredentials,
  getAllUserCredentials,
  getAllUserCredentialsById,
  deleteUserCredentials,
  updateUserCredentials,
};
