const config = require('../config/config');
const sql = require('mssql');
const bcrypt = require('bcrypt');



exports.register = async (req,res) => {
    console.log(req.body);

    const {
        userID,
        password
    } = req.body;

    try{
        await sql.connect(config);
        console.log(userID,password);
        // Check user id is already taken
        const userExit = await sql.query(`SELECT UserID FROM User_Credentials WHERE UserID = '${userID}'`);
        if (userExit.recordset.length > 0){
            return res.sendStatus(409).json({message:"The user id is already taken"});
        }

        // Hashing password and insert data to user_credential table
        const hashedPassword = await bcrypt.hash(password,8);
        console.log(hashedPassword);
        const inserUser = await sql.query(`INSERT INTO User_Credentials (UserID, Password) VALUES ('${userID}', '${hashedPassword}')`);
        return res.sendStatus(201).json({message: "User Successfully Registered"});
    } catch(err){
        console.error("Error connecting to the database:", err);
        return res.sendStatus(500).json({ message: "Internal Server Error" });
    } // finally {
    //     sql.close();
    // }
    
}