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
            const insertQuery = `INSERT INTO User_Credentials (UserID,userPassword,role,added_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
            
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
                userId: user.userID,
                role: user.role
            }, process.env.SECRET_KEY, { 
                expiresIn: '2m'
            });
            res.cookie('token', accessToken, {
                httpOnly: true,
                sameSite: 'None', 
                secure: true,
                maxAge: 2 * 60 * 1000 
            });

            // Refresh Token
            const refreshToken = jwt.sign({
                user: user.userID
            },process.env.REFRESH_TOKEN_SECRET, { 
                expiresIn: '2m'
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'None', 
                secure: true,
                maxAge: 2 * 60 * 1000
            });
            return res.json({ token: accessToken, refeshToken: refreshToken });

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
        console.log('Cookies:', req.cookies);
        const refreshToken = req.cookies.refresh_token;
        console.log(refreshToken);
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(406).json({ message: 'Unauthorized' });
            } else {
                // Fetch user details from database based on the user ID in the token
                const user = getUserByID(decoded.user);
                const accessToken = jwt.sign({ 
                    user: decoded.user,
                    role: user.role // Include user role in the access token payload
                }, process.env.SECRET_KEY, { expiresIn: '2m' });

                // Set access token as a cookie in the response
                res.cookie('token', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 2 * 60 * 1000 });
                return res.status(200).json({ token: accessToken });
            }
        });

    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}
async function logout(req,res){
    try {
        console.log("Logout called");
        res.clearCookie('token');
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log("Failed operation",error);
        return res.status(201).json({message: 'Process Failed'})
    }
}
module.exports = { register, login, refresh, logout };
