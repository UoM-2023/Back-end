const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

let connection;

async function retrieveUser(req, res) {
  try {
    connection = await mysql.createConnection(dbConfig);

    const user_id = req.params.id;

    console.log("UserID Called", user_id);

    const query = `SELECT 
            uc.UserName,
            uc.UnitID,
            uc.residentID,
            ri.first_name,
            ri.last_name,
            ri.dob,
            ri.nic,
            ri.member_type,
            ri.email,
            ri.mobile_no,
            ri.Address,
            ri.name_with_initials
        FROM 
            Unit_Credentials uc
        INNER JOIN 
            Residents_Information ri
        ON 
            uc.residentID = ri.residentID
        WHERE 
            uc.UserName = ?`;

    const [result] = await connection.query(query, [user_id]);
    console.log(result);

    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retieve data", error);
    return res.status(201).json({ message: "Process Failed" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { retrieveUser };
