const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const { rows } = require("mssql");

// POST Function

async function usercredentials(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { UserID, userRole, userPassword, Confirmpassword } = req.body;
    const added_time = req.body.added_time || new Date();

    console.log(UserID, userRole, userPassword, added_time, Confirmpassword);

    const add =
      "INSERT INTO UserCredentials (UserID, userRole, userPassword, Confirmpassword, added_time ) VALUES (?, ?, ?, ?, ?)";

    try {
      await connection.query(add, [
        UserID,
        userRole,
        userPassword,
        Confirmpassword,
        added_time,
      ]);
      return res
        .status(200)
        .json({ message: "Your account has been successfully created!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Oops! There was an issue creating your account." });
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

    const query = `SELECT * FROM UserCredentials`;

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

    const query = `SELECT * FROM UserCredentials WHERE UserID = ?`;
    const id = req.params.UserID;

    const result = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve User Credentials Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve User Credentials Details " });
  }
}

// DELETE Function

async function deleteUserCredentials(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const id = req.params.UserID;

    const query = "DELETE FROM UserCredentials WHERE UserID = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "User Account Successfully Deleted" });
    } catch (error) {
      console.error("Failed to delete User Credentials data", error);
      return res
        .status(500)
        .json({ message: "Failed to delete User Credentials details" });
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

    const { userRole, userPassword, added_time } = req.body;

    const id = req.params.UserID;

    console.log(userRole, userPassword, added_time);

    const query =
      "UPDATE UserCredentials SET userPassword = ?, userRole = ? WHERE UserID = ?";

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
    return res
      .status(500)
      .json({ message: "Failed to update User Credentials Details" });
  }
}

module.exports = {
  usercredentials,
  getAllUserCredentials,
  getAllUserCredentialsById,
  deleteUserCredentials,
  updateUserCredentials,
};
