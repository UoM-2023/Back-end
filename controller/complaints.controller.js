const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// let connection;

async function addNewComplaint(req, res) {
  let connection;
  try {
    const { Nature, Title, Complained_by, C_Description, CStatus } = req.body;
    connection = await mysql.createConnection(dbConfig);

    console.log(Nature, Title, Complained_by, C_Description, CStatus);

    const addQuery =
      "INSERT INTO Complaints (Nature, Title, Complained_by, C_Date, C_Description, CStatus) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)";

    await connection.query(addQuery, [
      Nature,
      Title,
      Complained_by,
      C_Description,
      CStatus,
    ]);
    await connection.end(); // Close the connection after query execution
    return res.status(200).json({ message: "Complaint Successfully Added" });
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Internal Server Error" }); // Return appropriate error response
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllComplaints(req, res) {
  let connection;
  try {
    console.log("called");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = "SELECT * FROM Complaints ORDER BY Reference_id DESC LIMIT ? OFFSET ? ";

    const [result] = await connection.query(query, [limit, offset]);

    console.log(result);

    const totalQuery = `SELECT COUNT(*) as count FROM Complaints`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;
    // await connection.end(); // Properly close the connection

    return res.status(200).json({ result: result, total: total });

    return res.status(200).json({ result: rows });
  } catch (error) {
    console.error("Failed to retrieve complaints", error);
    return res.status(500).json({ message: "Failed to retrieve complaints" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchComplaints(req, res) {
  let connection;
  try {
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `
        SELECT * FROM Complaints
        WHERE Reference_id LIKE ? OR
              Nature LIKE ? OR
              Title LIKE ? OR
              Complained_by LIKE ? OR
              C_Date LIKE ? OR
              C_Description LIKE ? OR
              CStatus LIKE ?
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
      offset,
    ]);

    const totalQuery = `
        SELECT COUNT(*) as count FROM Complaints
        WHERE Reference_id LIKE ? OR
              Nature LIKE ? OR
              Title LIKE ? OR
              Complained_by LIKE ? OR
              C_Date LIKE ? OR
              C_Description LIKE ? OR
              CStatus LIKE ?
      `;

    const [totalResult] = await connection.query(totalQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
    ]);
    const total = totalResult[0].count;

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

async function getAComplaint(req, res) {
  let connection;
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Unit ID is required" });
    }

    const query = `SELECT * FROM Complaints WHERE Reference_id = ?`;

    try {
      const [rows] = await connection.query(query, [id]);
      await connection.end(); // Close the connection
      return res.status(200).json({ result: rows });
    } catch (error) {
      console.error("Failed to retrieve complaint:", error);
      await connection.end(); // Ensure the connection is closed in case of error
      return res.status(500).json({ message: "Failed to retrieve complaint" });
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return res.status(500).json({ message: "Failed to retrieve complaint" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// async function updateComplaint(req, res) {
//   let connection;
//   try {
//     connection = await mysql.createConnection(dbConfig);

//     const { CStatus } = req.body;

//     const id = req.params.id;

//     console.log(CStatus);

//     const query = "UPDATE Complaints SET CStatus = ? WHERE Reference_id = ?";

//     // try {
//     //   let connection = await mysql.createConnection(dbConfig);

//     //   const { Nature, Title, Complained_by, C_Description, CStatus } = req.body;

//     //   const id = req.params.id;

//     //   console.log(id, Nature, Title, Complained_by, C_Description, CStatus);

//     //   const query =
//     //     "UPDATE Complaints SET Nature = ?, Title = ?, Complained_by = ?, C_Date = CURRENT_TIMESTAMP, C_Description = ?, CStatus = ? WHERE Reference_id = ?";

//     //   try {
//     //     await connection.query(query, [
//     //       Nature,
//     //       Title,
//     //       Complained_by,
//     //       C_Description,
//     //       CStatus,
//     //       id,
//     //     ]);
//     //     return res
//     //       .status(200)
//     //       .json({ message: "Complaint Successfully Updated" });
//     //   } catch (error) {
//     //     console.error("Failed to save data", error);
//     //     return res.status(201).json({ message: "Process Failed" });
//     //   }
//     } catch (error) {
//       console.error("Failed to save data", error);
//       return res
//         .status(201)
//         .json({ message: "Faild to Update Complaint Status !" });
//     }
//   } catch (error) {
//     console.error("Failed to retrieve complaint", error);
//     return res.status(500).json({ message: "Failed to update complaint" });
//   } finally {
//     if (connection) {
//       await connection.end();
//     }
//   }
// }

async function updateComplaint(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const { CStatus } = req.body;

    const id = req.params.id;

    console.log(CStatus);

    const query = "UPDATE Complaints SET CStatus = ? WHERE Reference_id = ?";

    try {
      await connection.query(query, [CStatus, id]);
      return res
        .status(200)
        .json({ message: "Complaint Status Successfully Updated !" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Faild to Update Complaint Status !" });
    }
  } catch (error) {
    console.error("Failed to retrieve complaint", error);
    return res.status(500).json({ message: "Failed to update complaint" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function deleteComplaint(req, res) {
  try {
    let connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM Complaints WHERE Reference_id = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Complaint Successfully Deleted" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve complaint", error);
    return res.status(500).json({ message: "Failed to update complaint" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addNewComplaint,
  getAllComplaints,
  getAComplaint,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
};
