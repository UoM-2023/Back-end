const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

let connection;
//add reservations
async function addReservation(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      facility_name,
      Unit_id,
      start_date,
      end_date,
      start_time,
      end_time,
      availability,
    } = req.body;

    console.log(
      facility_name,
      Unit_id,
      start_date,
      end_date,
      start_time,
      end_time,
      availability
    );

    //checkdown query parameters
    const add =
      "INSERT INTO Reservations (facility_name, Unit_id,  start_date, end_date, start_time, end_time, requested_date,availability) VALUES (?, ?,  ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)";

    try {
      await connection.query(add, [
        facility_name,
        Unit_id,
        start_date,
        end_date,
        start_time,
        end_time,
        availability,
      ]);

      return res
        .status(200)
        .json({ message: "Reservation Successfully Added" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//get all reservations

async function getAllReservations(req, res) {
  try {
    console.log("called");

    connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Reservations  ORDER BY requested_date DESC`;

    const [result] = await connection.query(query);

    const formattedResult = result.map((row) => {
      const localDate = new Date(row.requested_date);
      const timezoneOffset = localDate.getTimezoneOffset() * 60000; // Convert to milliseconds
      const localTime = new Date(localDate.getTime() - timezoneOffset);
      return {
        ...row,
        requested_date: localTime.toISOString().split("T")[0],
      };
    });
    // console.log(result);
    return res.status(200).json({ result: formattedResult, result });
  } catch (error) {
    console.error("Failed to get all  reservations", error);
    return res.status(500).json({ message: "Failed to get all  reservations" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllByFaciName(req, res) {
  try {
    console.log("Called with facility name");

    connection = await mysql.createConnection(dbConfig);

    const facility_name = req.params.facility_name;

    if (!facility_name) {
      return res.status(400).json({ message: "Facility name is required" });
    }

    const query = "SELECT * FROM Reservations WHERE facility_name = ?";

    try {
      const [rows] = await connection.query(query, [facility_name]);
      await connection.end(); // Close the connection
      return res.status(200).json({ result: rows });
    } catch (error) {
      console.error("Failed to retrieve reservations:", error);
      await connection.end(); // Ensure the connection is closed in case of error
      return res
        .status(500)
        .json({ message: "Failed to retrieve reservations" });
    }
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    return res.status(500).json({ message: "Failed to retrieve reservations" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//get a reservation

async function getAReservation(req, res) {
  try {
    console.log("Called with id");

    connection = await mysql.createConnection(dbConfig);
    const query = `SELECT * FROM Reservations WHERE ref_no = ?`;
    const id = req.params.id;

    const [result] = await connection.query(query, [id]);
    console.log(result);

    // Check if the result is empty
    if (result.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Send the result directly
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Failed to get reservation", error);
    return res.status(500).json({ message: "Failed to get reservation" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//update reservation

async function updateReservation(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const {
      facility_name,
      Unit_id,
      start_date,
      end_date,
      start_time,
      end_time,
      availability,
    } = req.body;

    const id = req.params.id;

    console.log(
      facility_name,
      Unit_id,
      start_date,
      end_date,
      start_time,
      end_time,
      availability
    );

    const query =
      "UPDATE Reservations SET facility_name = ?, Unit_id = ?,  start_date = ?, end_date = ?,  start_time = ?, end_time = ?, availability = ? WHERE ref_no = ?";

    try {
      await connection.query(query, [
        facility_name,
        Unit_id,
        start_date,
        end_date,
        start_time,
        end_time,
        availability,
        id,
      ]);
      return res
        .status(200)
        .json({ message: "Reservation Successfully Updated" });
    } catch (error) {
      console.error("Failed to update data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to update reservation", error);
    return res.status(500).json({ message: "Failed to update reservation" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

//delete reservation

async function deleteReservation(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);
    const id = req.params.id;

    const query = "DELETE FROM Reservations WHERE ref_no = ?";

    try {
      await connection.query(query, [id]);
      // If deletion succeeds, return success message
      return res
        .status(200)
        .json({ message: "Reservation Successfully Deleted" });
    } catch (error) {
      // If deletion fails, return appropriate error message
      console.error("Failed to Delete data", error);
      return res.status(500).json({ message: "Failed to delete reservation" });
    }
  } catch (error) {
    console.error("Failed to Delete data", error);
    return res.status(500).json({ message: "Failed to delete reservation" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  addReservation,
  getAllReservations,
  getAReservation,
  updateReservation,
  deleteReservation,
  getAllByFaciName,
  // getReservationCount,
};
