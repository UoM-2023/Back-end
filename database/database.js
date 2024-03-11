const sql = require('mssql');
const config = require('../config/db.config');

async function connection() {
    try {
        await sql.connect(config);
        console.log('Connected to the database successfully!');
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    } finally {
        await sql.close();
    }
}

const getUserByID = async (userID) => {
    const checkUserQuery = 'SELECT * FROM User_Credentials WHERE UserID = @UserID';

    try {
        const request = new sql.Request();
        request.input('UserID', sql.VarChar, userID);
        const result = await request.query(checkUserQuery);

        // Returning the first user found or null if none found
        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
        console.error('Database error:', error);
        return res.status(201).json({message:'Server error'});
    }
};
// async function createTable(){
//     try {
//         await sql.connect(config);
//         const tableCreateQuery = `
//         IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employees')
//         CREATE TABLE Employees (
//             Id INT PRIMARY KEY,
//             Name NVARCHAR(50),
//             Position NVARCHAR(50)
//             );
//         `;
//         await sql.query(tableCreateQuery); 
//     } catch (err) {
//         console.log(`An error occurs: `,err);
//     } finally {
//         await sql.close();
//     }
// }

// async function insertDummyData() {
//     try {
//         await sql.connect(config);
//         const insertQuery = `
//             INSERT INTO Employees (Id, Name, Position) VALUES
//             (1, 'John Doe', 'Software Developer'),
//             (2, 'Jane Smith', 'Project Manager'),
//             (3, 'Emily Davis', 'UI/UX Designer');
//         `;
//         await sql.query(insertQuery);
//         console.log('Data inserted successfully!');
//     } catch (err) {
//         console.error('Error inserting data:', err);
//     } finally {
//         await sql.close();
//     }
// }

// async function readData() {
//     try {
//         await sql.connect(config);
//         const result = await sql.query('SELECT * FROM Employees');
//         console.dir(result.recordset);
//     } catch (err) {
//         console.error('Error reading data:', err);
//     } finally {
//         await sql.close();
//     }
// }

module.exports = { 
    connection,
    getUserByID
//     createTable,
//     insertDummyData,
//     readData
 };
