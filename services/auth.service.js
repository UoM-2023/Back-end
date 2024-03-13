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

        // Checking the username already exists
        const checkUserQuery = `SELECT * FROM User_Credentials WHERE UserID = @UserID`
        const request = new sql.Request();
        request.input('UserID', sql.VarChar, userID);
        const result = await request.query(checkUserQuery);
        
        // If user isn't exists the length will be null
        if(result.recordset.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        } else {
            // Encrypt the password
            const hashedPassword = await bcrypt.hash(password,8);
            console.log(userID,hashedPassword);
            const insertQuery = `INSERT INTO User_Credentials (UserID,Password,Role) VALUES (@UserName, @Password, @Role)`
            request.input('UserName', sql.VarChar, userID);
            request.input('Password', sql.VarChar, hashedPassword);
            request.input('Role',sql.VarChar, role);
            await request.query(insertQuery);

            // console.log("User Succesfully Registered");
            return res.status(200).json({message: 'User sucessfully Registered'});
            
        }
    } catch(err){
        console.error('Database operation failed',err);
        return res.status(201).json({message:'Server Error'});
    }
}

async function login(req,res){
    try{
        await sql.connect(dbConfig);

        const {userID,password} = req.body;

        // Check user is exists with "getUserByID" function in database.js
        const user = await getUserByID(userID);

        if (!user){
            return res.status(401).json({message: 'Invalid username'});
        } 
        // If User name is correct compare password with the entered password
        const checkValidPassword = bcrypt.compareSync(password,user.Password);
        if (checkValidPassword) {
            user.Password = undefined;
            //Creating token
            const accessToken = jwt.sign({
                user: user
            }, process.env.SECRET_KEY, { 
                expiresIn: '10m'
            });

            // Refresh Token
            const refreshToken = jwt.sign({
                user: user
            },process.env.REFRESH_TOKEN_SECRET, { 
                expiresIn: '1d'
            });
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None', secure: true,
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
                            expiresIn: '10m'
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
