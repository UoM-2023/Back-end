const sql = require("mssql");
const dbConfig = require("../config/db.config");

async function residentInfoAddNew(req, res) {
  try {
    sql.connect(dbConfig);

    const request = new sql.Request();
    const {
      unitID,
      nameWithInitials,
      building,
      block,
      unitCategory,
      unit,
      fName,
      mName,
      lName,
      gender,
      dob,
      nic,
      memberType,
      email,
      mobileNo,
      address,
    } = req.body;

    console.log(
      unitID,
      nameWithInitials,
      building,
      block,
      unitCategory,
      unit,
      fName,
      mName,
      lName,
      gender,
      dob,
      nic,
      memberType,
      email,
      mobileNo,
      address
    );
    const insertQuery = `INSERT INTO Residents_Information(Unit_ID, Name_with_initials, Building, Block_No, Unit_Category, Unit_No, First_Name, Middle_Name, Last_Name, Gender, Date_Of_Birth, NIC, Member_Type, Email, Mobile_No, Resident_Address ) 
                        VALUES (@Unit_ID, @Name_with_initials, @Building, @Block_No, @Unit_Category, @Unit_No, @First_Name, @Middle_Name, @Last_Name, @Gender, @Date_Of_Birth, @NIC, @Member_Type, @Email, @Mobile_No, @Resident_Address)`;

    request.input("Unit_ID", sql.VarChar, unitID);
    request.input("Name_with_initials", sql.VarChar, nameWithInitials);
    request.input("Building", sql.VarChar, building);
    request.input("Block_No", sql.VarChar, block);
    request.input("Unit_Category", sql.VarChar, unitCategory);
    request.input("Unit_No", sql.VarChar, unit);
    request.input("First_Name", sql.VarChar, fName);
    request.input("Middle_Name", sql.VarChar, mName);
    request.input("Last_Name", sql.VarChar, lName);
    request.input("Gender", sql.VarChar, gender);
    request.input("Date_Of_Birth", sql.Date, dob);
    request.input("NIC", sql.VarChar, nic);
    request.input("Member_Type", sql.VarChar, memberType);
    request.input("Email", sql.VarChar, email);
    request.input("Mobile_No", sql.VarChar, mobileNo);
    request.input("Resident_Address", sql.VarChar, address);
    await request.query(insertQuery);

    return res
      .status(200)
      .json({ message: "New Resident Successfully Added !" });
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

async function getAllResidentsDetails(req, res) {
  try {
    sql.connect(dbConfig);

    const request = new sql.Request();

    const query = `SELECT * FROM Residents_Information`;

    const result = await request.query(query);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Failed to retrieve Residents Details", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve Residents Details" });
  }
}

module.exports = { residentInfoAddNew, getAllResidentsDetails };
