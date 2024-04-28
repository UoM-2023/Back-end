const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewMaintenanceRequest(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { unitID, residentName, maintenanceType, TaskStatus } = req.body;

    console.log(unitID, residentName, maintenanceType, TaskStatus);

    const add =
      "INSERT INTO Maintenance_Requests (Unit_id,Resident_Name,MType,Mnt_Status,requested_date) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)";

    try {
      await connection.query(add, [
        unitID,
        residentName,
        maintenanceType,
        TaskStatus,
      ]);
      return res
        .status(200)
        .json({ message: "New Maintenance Request Successfully Added" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

async function get_All_Maintenance_Requests(req, res) {
  try {
    console.log("called");

    const connection = await mysql.createConnection(dbConfig);

    const query = `SELECT * FROM Maintenance_Requests`;

    const result = await connection.query(query);
    console.log(result);
    return res.status(200).json({ result: result });
  } catch (error) {
    console.error("Failed to retrieve Maintenance Requests", error);
    return res.status(500).json({ message: "Failed to retrieve new maintenance requests" });
  }
}

async function get_A_Maintenance_Request(req,res){
  try{
      console.log("Called with id");

      const connection = await mysql.createConnection(dbConfig);

      const query = `SELECT * FROM Maintenance_Requests WHERE fund_id = ?`;
      const id = req.params.id;

      const result = await connection.query(query, [id]);
      console.log(result);
      return res.status(200).json({result : result});

  } catch(error){
      console.error('Failed to retrieve a maintenance request', error);
      return res.status(500).json({ message: 'Failed to retrieve maintenance request' });
  }
}

async function update_Maintenance_Request(req,res){
  try {
      const connection = await mysql.createConnection(dbConfig);

      const {
        unitID,
        residentName,
        maintenanceType,
        TaskStatus,
      } = req.body;

      const id = req.params.id;

      console.log(unitID,
        residentName,
        maintenanceType,
        TaskStatus);

      const query = 'UPDATE Maintenance_Requests SET Unit_id = ?, Resident_Name = ?, MType = ?, Mnt_Status = ?, requested_date = CURRENT_TIMESTAMP WHERE fund_id = ?'

      try {
          await connection.query(query, [unitID,residentName,maintenanceType,TaskStatus, id]);
          return res.status(200).json({message: 'Maintenance request Successfully Updated'});

      } catch (error) {
          console.error('Failed to save data',error);
          return res.status(201).json({message:'Process Failed'});
      }



  } catch (error) {
      console.error('Failed to retrieve maintenance request', error);
      return res.status(500).json({ message: 'Failed to update maintenance request' });        
  }
}


module.exports = { addNewMaintenanceRequest, get_All_Maintenance_Requests,get_A_Maintenance_Request,update_Maintenance_Request};
