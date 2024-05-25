// const sql = require('mssql');
const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByID } = require('../database/database');
const { verifyToken } = require('../middlewares/auth.middleware');
const { config } = require('dotenv');

async function register (req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);

        const {userID, password, role} = req.body;

        // Checking the username already exists
        const checkUserQuery = `SELECT * FROM User_Credentials WHERE UserID = ?`
        
        console.log(userID);
        // const result = await connection.query(checkUserQuery,[userID]);
        const result = await getUserByID(userID);
        
        // If user isn't exists the length will be null
        if(result !== null) {
            return res.status(400).json({message: 'User already exists'});
        } else {
            // Encrypt the password
            const hashedPassword = await bcrypt.hash(password,8);
            console.log(userID,hashedPassword);
            const insertQuery = `INSERT INTO User_Credentials (UserID,userPassword,userRole,added_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
            
            try {
                await connection.query(insertQuery,[userID,hashedPassword,role]);
                return res.status(200).json({message: 'User sucessfully Registered'});
            } catch (error) {
                console.log('Failed to save data',error);
                return res.status(201).json({message: 'Failed to register user'});
            }
            
            
        }
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}

async function login(req,res){
    try{
        // await sql.connect(dbConfig);

        const {userID,password} = req.body;
        console.log(userID);
        // Check user is exists with "getUserByID" function in database.js
        const user = await getUserByID(userID);

        if (user == null){
            return res.status(401).json({message: 'Invalid username'});
        } 
        // If User name is correct compare password with the entered password
        const checkValidPassword = bcrypt.compareSync(password,user.userPassword);
        if (checkValidPassword) {
            user.Password = undefined;
            //Creating token
            const accessToken = jwt.sign({
                user: user.userID
            }, process.env.SECRET_KEY, { 
                expiresIn: '30m'
            });
            res.cookie('token', accessToken, {
                httpOnly: true,
                sameSite: 'None', 
                secure: true,
                maxAge: 30 * 60 * 1000 
            });
            

            // Refresh Token
            const refreshToken = jwt.sign({
                user: user.userID
            },process.env.REFRESH_TOKEN_SECRET, { 
                expiresIn: '1d'
            });
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None', 
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            return res.json({ token: accessToken, refeshToken: refreshToken });
            // return res.redirect('/main')
        } else {
            return res.status(401).json({message:'Invalid Password'});

        }
        
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}

async function refresh(req,res){
    try{
        if (req.cookies?.jwt){
            const refreshToken = req.cookies.jwt;

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err) {
                        return res.status(406).json({ message: 'Unauthorized' });
                    }
                    else {
                        // Correct token we send a new access token
                        const accessToken = jwt.sign({
                            user: user
                        }, process.env.SECRET_KEY, {
                            expiresIn: '1d'
                        });
                        return res.json({ token: accessToken });
                    }
                })
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}
module.exports = { register, login, refresh, verifyToken};
