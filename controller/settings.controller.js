// const mysql = require("mysql2/promise");
// const dbConfig = require("../config/db.config");
// const bcrypt = require("bcrypt");

// // Get by UserID Function

// async function getUserById(req, res) {
//   try {
//     console.log("Called with User ID");

//     const connection = await mysql.createConnection(dbConfig);

//     const query = `SELECT * FROM User_Credentials WHERE UserID = ?`;
//     const id = req.params.UserID;

//     const [result] = await connection.query(query, [id]);
//     console.log(result);

//     return res.status(200).json({ result: result });
//   } catch (error) {
//     console.error("Failed to retrieve User Details", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to retrieve User Details " });
//   }
// }

// async (req, res) => {
//   const { UserID } = req.params;
//   const { oldPassword, userPassword } = req.body;

//   if (!oldPassword || !userPassword) {
//     return res
//       .status(400)
//       .send({ message: "Old password and new password are required" });
//   }

//   try {
//     // Get the existing user
//     db.query(
//       "SELECT * FROM user_credentials WHERE UserID = ?",
//       [UserID],
//       async (err, results) => {
//         if (err) {
//           console.error("Error fetching user:", err);
//           return res.status(500).send({ message: "Error fetching user" });
//         }

//         if (results.length === 0) {
//           return res.status(404).send({ message: "User not found" });
//         }

//         const user = results[0];

//         // Verify the old password
//         const isMatch = await bcrypt.compare(oldPassword, user.oldPassword);
//         if (!isMatch) {
//           return res.status(400).send({ message: "Old password is incorrect" });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(userPassword, 10);

//         // Update the user's password
//         db.query(
//           "UPDATE user_credentials SET userPassword = ? WHERE UserID = ?",
//           [hashedPassword, UserID],
//           (err, results) => {
//             if (err) {
//               console.error("Error updating password:", err);
//               return res
//                 .status(500)
//                 .send({ message: "Error updating password" });
//             }

//             res.send({ message: "Password updated successfully" });
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// };

// module.exports = { getUserById };

//--------------------------------------------------------------------------------------------------------------

// // Get by userID Function
// async function getUserById(req, res) {
//   try {
//     console.log("Called with User ID");

//     const connection = await mysql.createConnection(dbConfig);

//     const query = `SELECT * FROM User_Credentials WHERE UserID = ?`;
//     const id = req.params.UserID;

//     const [result] = await connection.query(query, [id]);
//     console.log(result);

//     await connection.end();

//     return res.status(200).json({ result: result });
//   } catch (error) {
//     console.error("Failed to retrieve User Details", error);
//     return res.status(500).json({ message: "Failed to retrieve User Details" });
//   }
// }

// // Update User Password Function
// async function updateUserPassword(req, res) {
//   const { UserID } = req.params;
//   const { oldPassword, userPassword } = req.body;

//   if (!oldPassword || !userPassword) {
//     return res
//       .status(400)
//       .send({ message: "Old password and new password are required" });
//   }

//   try {
//     const connection = await mysql.createConnection(dbConfig);

//     // Get the existing user
//     const [results] = await connection.query(
//       "SELECT * FROM User_Credentials WHERE UserID = ?",
//       [UserID]
//     );

//     if (results.length === 0) {
//       await connection.end();
//       return res.status(404).send({ message: "User not found" });
//     }

//     const user = results[0];

//     // Verify the old password
//     const isMatch = await bcrypt.compare(oldPassword, user.userPassword);
//     if (!isMatch) {
//       await connection.end();
//       return res.status(400).send({ message: "Old password is incorrect" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(userPassword, 10);

//     // Update the user's password
//     await connection.query(
//       "UPDATE User_Credentials SET userPassword = ? WHERE UserID = ?",
//       [hashedPassword, UserID]
//     );

//     await connection.end();

//     return res.send({ message: "Password updated successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).send({ message: "Internal server error" });
//   }
// }

const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");
const bcrypt = require("bcrypt");

// Update Password Function
async function updatePassword(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { oldPassword, userPassword } = req.body;
    const { UserID } = req.params;

    // Check if the old password is correct
    const checkPasswordQuery =
      "SELECT userPassword FROM User_Credentials WHERE UserID = ?";
    const [results] = await connection.query(checkPasswordQuery, [UserID]);

    // const user = results[0];

    // const hashedPassword = await bcrypt.hash(userPassword, 10);

    // if (results.length === 0 || results[0].password !== oldPassword) {
    //  return res.status(400).json({ message: "Old password is incorrect" });
    // }

    if (results.length === 0) {
      await connection.end();
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.userPassword);
    if (!isMatch) {
      await connection.end();
      return res.status(400).send({ message: "Old password is incorrect" });
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
  }
}

// Get By Id Function (UserID)

async function getUserByuserID(req, res) {
  try {
    console.log("Called with UserID");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM User_Credentials WHERE UserID = ?`;
    const id = req.params.UserID;

    const [result] = await connection.query(query, [id]);

    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve User Details by UserID", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve User  Details by UserID" });
  }
}

module.exports = { updatePassword, getUserByuserID };
