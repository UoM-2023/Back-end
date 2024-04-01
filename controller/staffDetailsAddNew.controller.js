const sql = require("mssql");
const dbConfig = require("../config/db.config");

async function addNewStaffMember(req, res) {
  try {
    sql.connect(dbConfig);

    const request = new sql.Request();
    const {
      fName,
      mName,
      lName,
      gender,
      dob,
      nic,
      staffCategory,
      qualifications,
      staffID,
      email,
      mobileNo,
      address,
      city,
    } = req.body;

    console.log(
      fName,
      mName,
      lName,
      gender,
      dob,
      nic,
      staffCategory,
      qualifications,
      staffID,
      email,
      mobileNo,
      address,
      city
    );
    const insertQuery = `INSERT INTO Staff_Details(First_Name, Middle_Name, Last_Name, Gender, Date_Of_Birth, NIC, Staff_Category, Qualifications, Staff_ID, Email, Mobile_No, Staff_Address, City) 
                        VALUES (@First_Name, @Middle_Name, @Last_Name, @Gender, @Date_Of_Birth, @NIC, @Staff_Category, @Qualifications, @Staff_ID, @Email, @Mobile_No, @Staff_Address, @City)`;

    request.input("First_Name", sql.VarChar, fName);
    request.input("Middle_Name", sql.VarChar, mName);
    request.input("Last_Name", sql.VarChar, lName);
    request.input("Gender", sql.VarChar, gender);
    request.input("Date_Of_Birth", sql.Date, dob);
    request.input("NIC", sql.VarChar, nic);
    request.input("Staff_Category", sql.VarChar, staffCategory);
    request.input("Qualifications", sql.VarChar, qualifications);
    request.input("Staff_ID", sql.VarChar, staffID);
    request.input("Email", sql.VarChar, email);
    request.input("Mobile_No", sql.VarChar, mobileNo);
    request.input("Staff_Address", sql.VarChar, address);
    request.input("City", sql.VarChar, city);

    await request.query(insertQuery);

    return res
      .status(200)
      .json({ message: "New Staff Member Successfully Added" });
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

async function getAllStaffMembers(req, res) {
  try {
    sql.connect(dbConfig);

    const request = new sql.Request();

    const query = `SELECT * FROM Staff_Details`;

    const result = await request.query(query);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Failed to retrieve funds", error);
    return res.status(500).json({ message: "Failed to retrieve funds" });
  }
}

module.exports = { addNewStaffMember, getAllStaffMembers };
