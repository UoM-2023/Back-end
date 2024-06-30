const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

// POST Function
// let connection;

async function add_Completed_Mnt_Request(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const {
      Mnt_id,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Mnt_Payment_id,
    } = req.body;

    console.log(
      Mnt_id,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Mnt_Payment_id
    );
    const add =
      "INSERT INTO Completed_MRequests (Mnt_id, ServiceProvider, MobileNo, completed_date, Payment_Status, Mnt_Payment_id ) VALUES (?, ?, ?, ?, ?, ?)";

    try {
      await connection.query(add, [
        Mnt_id,
        ServiceProvider,
        MobileNo,
        completed_date,
        Payment_Status,
        Mnt_Payment_id,
      ]);
      return res
        .status(200)
        .json({ message: "New Completed Maintenance Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({
        message:
          "Oops! There was an issue Adding Completed Maintenance Details",
      });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({
      message: "Oops! There was an issue Adding Completed Maintenance Details",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET all Function

async function get_All_Completed_Mnt_Request(req, res) {
  let connection;
  try {
    console.log("get_All_Completed_Mnt_Request called");

    connection = await mysql.createConnection(dbConfig);

    // const query = `SELECT * FROM Completed_MRequests ORDER BY completed_date DESC`;
    const query = ` SELECT 
                      Completed_MRequests.*,
                      Maintenance_Requests.requested_date
                    FROM 
                      Completed_MRequests
                    JOIN 
                      Maintenance_Requests
                    ON 
                      Completed_MRequests.Mnt_id = Maintenance_Requests.Mnt_Request_id
                    ORDER BY completed_date DESC`;

    const [result] = await connection.query(query);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve completed maintenance", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve completed maintenance" });
  } finally {
    if (connection) {
      await connection.end();
    }
}
}

// Get By Id Function

async function get_A_Completed_Mnt_Request(req, res) {
  let connection;
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Completed_MRequests WHERE id = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve completed maintenance", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve completed maintenance" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// EDIT Function

async function update_completed_Mnt_Request(req, res) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      Mnt_id,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Mnt_Payment_id,
    } = req.body;

    const id = req.params.id;

    console.log(
      Mnt_id,
      ServiceProvider,
      MobileNo,
      completed_date,
      Payment_Status,
      Mnt_Payment_id
    );

    const query =
      "UPDATE Completed_MRequests SET Mnt_id = ?, ServiceProvider = ?, MobileNo = ?, completed_date = ?, Payment_Status = ?, Mnt_Payment_id = ? WHERE id = ?";

    try {
      await connection.query(query, [
        Mnt_id,
        ServiceProvider,
        MobileNo,
        completed_date,
        Payment_Status,
        Mnt_Payment_id,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Completed maintenance Successfully Updated!" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({
        message: "Oops! There was an issue Updating Completed Maintenance",
      });
    }
  } catch (error) {
    console.error("Failed to retrieve Completed maintenance", error);
    return res
      .status(500)
      .json({ message: "Failed to update Completed maintenance" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE Function

async function delete_Completed_Mnt_Request(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM Completed_MRequests WHERE id = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Completed Maintenance deleted successfully" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res
        .status(201)
        .json({ message: "Completed Maintenance Delete Process Failed" });
    }
  } catch (error) {
    console.error("Failed to retrieve completed maintenance", error);
    return res
      .status(500)
      .json({ message: "Failed to update completed maintenance" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  add_Completed_Mnt_Request,
  get_All_Completed_Mnt_Request,
  get_A_Completed_Mnt_Request,
  update_completed_Mnt_Request,
  delete_Completed_Mnt_Request,
};
