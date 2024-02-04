const sql = require('mssql');
const dbConfig = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByID } = require('../database/database');
const { verifyToken } = require('../middlewares/auth.middleware');

async function register (req,res){
    try {
        await sql.connect(dbConfig);

        const {userID, password, role} = req.body;

        const checkUserQuery = `SELECT * FROM User_Credentials WHERE UserID = @UserID`
        const request = new sql.Request();
        request.input('UserID', sql.VarChar, userID);
        const result = await request.query(checkUserQuery);

        if(result.recordset.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        } else {
            const hashedPassword = await bcrypt.hash(password,8);
            console.log(userID,hashedPassword);
            const insertQuery = `INSERT INTO User_Credentials (UserID,Password,Role) VALUES (@UserName, @Password, @Role)`
            request.input('UserName', sql.VarChar, userID);
            request.input('Password', sql.VarChar, hashedPassword);
            request.input('Role',sql.VarChar, role);
            await request.query(insertQuery);

            console.log("User Succesfully Registered");
            return res.status(200).json({message: 'User sucessfully Registered'});
            
        }
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}

async function login(req,res,next){
    try{
        await sql.connect(dbConfig);

        const {userID,password} = req.body;

        const user = await getUserByID(userID);

        if (!user){
            return res.status(401).json({message: 'Invalid username'});
        } 
        const checkValidPassword = bcrypt.compareSync(password,user.Password);
        if (checkValidPassword) {
            user.Password = undefined;
            const jsontoken = jwt.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
            res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) });
            res.json({token: jsontoken});
            // return res.redirect('/main')
        } else {
            return res.status(401).json({message:'Invalid Password'});

        }
        
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}

module.exports = { register, login, verifyToken};
