const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

//add guest details

async function addGuestDetails(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      unit_ID,
      guest_name,
      guest_NIC,
      vehicle_number,
      arrival_date,
      check_In,
      check_Out,
      checkin_Time,
      checkout_Time,
    } = req.body;

    console.log(
      unit_ID,
      guest_name,
      guest_NIC,
      vehicle_number,
      arrival_date,
      check_In,
      check_Out,
      checkin_Time,
      checkout_Time
    );

    const add =
      "INSERT INTO Guest_Details (unit_ID,  guest_name, guest_NIC, vehicle_number, arrival_date, check_In, check_Out, checkin_Time, checkout_Time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    try {
      await connection.query(add, [
        unit_ID,
        guest_name,
        guest_NIC,
        vehicle_number,
        arrival_date,
        check_In,
        check_Out,
        checkin_Time,
        checkout_Time,
      ]);
      await connection.end(); // Close the connection
      return res.status(200).json({ message: "Guest Successfully Added!" });
    } catch (error) {
      console.error("Failed to save data", error);
      await connection.end(); // Close the connection even on error
      return res.status(500).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// module.exports = addGuestDetails; // Ensure you export the function

//get all guest details

async function getAllGuestDetails(req, res) {
  let connection;
  try {
    console.log("called");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Guest_Details LIMIT ? OFFSET ?`;

    const [result] = await connection.query(query, [limit, offset]); // Access the first element of the result array

    const totalQuery = `SELECT COUNT(*) as count FROM Guest_Details`;
    const [totalResult] = await connection.query(totalQuery);
    const total = totalResult[0].count;

    console.log(result);
    return res.status(200).json({ result: result, total: total }); // Send the result directly without accessing `result.recordset`
  } catch (error) {
    console.error("Failed to retrieve guest details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve guest details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function searchGuests(req, res) {
  let connection;
  try {
    console.log("Called");
    const query = req.query.query || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    const searchQuery = `
            SELECT * FROM Guest_Details
            WHERE unit_ID LIKE ? OR
                    guest_name LIKE ? OR
                    vehicle_number LIKE ? OR
                    guest_NIC LIKE ?
            LIMIT ? OFFSET ?
            `;
    const searchPattern = `%${query}%`;
    const [result] = await connection.query(searchQuery, [
      searchPattern,
      searchPattern,
      searchPattern,
      searchPattern,
      limit,
      offset,
    ]);

    const totalQuery = `
            SELECT COUNT(*) as count FROM Guest_Details
            WHERE unit_ID LIKE ? OR
                    guest_name LIKE ? OR
                    vehicle_number LIKE ? OR
                    guest_NIC LIKE ?
        `;
    const [totalResult] = await connection.query(totalQuery, [
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

//get a guest details

async function getAGuestDetail(req, res) {
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Guest_Details WHERE guest_ID = ?`;
    const guest_ID = req.params.id;

    const [result] = await connection.query(query, [guest_ID]);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to get guest detail", error);
    return res.status(500).json({ message: "Failed to get guest detail" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//update guest Details

async function updateGuestDetails(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      guest_ID,
      unit_ID,
      guest_name,
      guest_NIC,
      vehicle_number,
      arrival_date,
      check_In,
      check_Out,
      checkin_Time,
      checkout_Time,
    } = req.body;

    const id = req.params.id;

    console.log(
      unit_ID,
      guest_name,
      guest_NIC,
      vehicle_number,
      arrival_date,
      check_In,
      check_Out,
      checkin_Time,
      checkout_Time
    );

    const query =
      "UPDATE Guest_Details SET unit_ID = ?, guest_name = ?, guest_NIC = ?, vehicle_number = ?, arrival_date = ?, check_In = ?, check_Out = ?, checkin_Time = ?, checkout_Time = ?, WHERE guest_ID = ?";

    try {
      await connection.query(query, [
        unit_ID,
        guest_name,
        guest_NIC,
        vehicle_number,
        arrival_date,
        check_In,
        check_Out,
        checkin_Time,
        checkout_Time,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Guest Details Successfully Updated" });
    } catch (error) {
      console.error("Failed to update data", error);
      return res
        .status(500)
        .json({ message: "Failed to update guest details" });
    }
  } catch (error) {
    console.error("Failed to update guest details", error);
    return res.status(500).json({ message: "Failed to update guest details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//delete guest details

async function deleteGuestDetails(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM Guest_Details WHERE guest_ID = ?";

    try {
      await connection.query(query, [id]);
      return res
        .status(200)
        .json({ message: "Guest Details Successfully Deleted" });
    } catch (error) {
      console.error("Failed to delete data", error);
      return res.status(500).json({ message: "Failed to delete data" });
    }
  } catch (error) {
    console.error("Failed to delete guest details", error);
    return res.status(500).json({ message: "Failed to delete guest details" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addGuestDetails,
  getAllGuestDetails,
  getAGuestDetail,
  updateGuestDetails,
  deleteGuestDetails,
  searchGuests,
};
