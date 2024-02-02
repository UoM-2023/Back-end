const sql = require('mssql');
const dbConfig = require('../config/db.config');
const bcrypt = require('bcrypt');

exports.register = async (req,res) => {
    try {
        await sql.connect(dbConfig);

        const {userID, password} = req.body;

        const checkUserQuery = `SELECT * FROM User_Credentials WHERE UserID = @UserID`
        const request = new sql.Request();
        request.input('UserID', sql.VarChar, userID);
        const result = await request.query(checkUserQuery);

        if(result.recordset.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        } else {
            const hashedPassword = await bcrypt.hash(password,8);
            console.log(userID,hashedPassword);
            const insertQuery = `INSERT INTO User_Credentials (UserID,Password) VALUES (@UserName, @Password)`
            request.input('UserName', sql.VarChar, userID);
            request.input('Password', sql.VarChar, hashedPassword);
            await request.query(insertQuery);

            console.log("User Succesfully Registered");
            return res.status(200).json({message: 'User sucessfully Registered'});
            
        }
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}