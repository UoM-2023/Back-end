const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');
const io = require('../index')

let connection;

async function addUtilityCharge (req,res){
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const {
            unit_id,
            month,
            electricityUsage,
            waterUsage,
            gasUsage,
            staffID,
            remark
        } = req.body;

        console.log(staffID);

        let totalCost = 0.0;
        let gasCost = 0.0;
        let waterCost = 0.0;
        let electricityCost  = 0.0;

        waterCost += await calculateUtilityCost('Water',waterUsage);

        gasCost += await calculateUtilityCost('Gas',gasUsage);

        electricityCost += await calculateUtilityCost('Electricity',electricityUsage);

        
        const [balance] = await connection.query('SELECT utility_balance FROM balance WHERE unit_id = ?',[unit_id]);
        let previousBalance = 0;
        if (balance.length>0) {
            previousBalance = balance[0].utility_balance;
        }
        console.log("Prev Balance: ",previousBalance);
        totalCost = gasCost + waterCost + electricityCost;
        const newBalance = totalCost + previousBalance;
        console.log("New Balance: ",newBalance);
        await connection.query('INSERT INTO balance (unit_id, utility_balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE utility_balance = ?', [unit_id, newBalance, newBalance]);

        // Inserint to main utility table
        const [utilityResult] = await connection.query(`INSERT INTO monthUtilityCharge (unit_id, util_month, prev_balance, month_amount, tot_amount, staff_id, added_date) VALUES (?, ?, ?, ?, ?, 'AP0001F', CURRENT_TIMESTAMP)`,[unit_id, month, previousBalance, totalCost, newBalance, staffID])

        console.log(utilityResult);
        // Take the utility charge id and insert values of gas, water and electricity
        const utilityCharge_id = utilityResult.insertId;
        await connection.query('INSERT INTO gasUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, gasUsage, gasCost]);
        await connection.query('INSERT INTO waterUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, waterUsage, waterCost]);
        await connection.query('INSERT INTO elecUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, electricityUsage, electricityCost]);

        // Socket connection
        const [userResult] = await connection.query('SELECT UserName FROM Unit_Credentials WHERE UnitID = ?',[unit_id]);
        const userId = userResult[0].user_id;
        // Emit the update to the specific user's room
        io.to(userId).emit('utilityUpdate', {
            unit_id,
            month,
            previousBalance,
            totalCost,
            newBalance,
            gasUsage,
            gasCost,
            waterUsage,
            waterCost,
            electricityUsage,
            electricityCost
        });

        return res.status(200).json({ message: 'Utility details updated successfully.' });
    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    
    } finally {
        await connection.end();
    }
}

// Function that calculate utility cost according to the utility name
async function calculateUtilityCost(utilityType, numOfUnits){

    const connection = await mysql.createConnection(dbConfig);
    const query = 'SELECT * FROM utility_prices up JOIN utilityDetails ud ON ud.utility_id = up.utility_id WHERE ud.utility_name = ?'

    const [pricing] = await connection.query(query,[utilityType]);

    if (pricing.length > 0 ) { 
        const unitRanges = pricing.map(row=>({
            range: row.price_range,
            base_price: row.base_price,
            unit_price: row.unit_price
        }));
        // Calculate usage cost based on unit ranges
        for (const rangeData of unitRanges) {
            const [rangeStart, rangeEnd] = rangeData.range.split('-').map(Number);
            if (!rangeEnd || numOfUnits <= rangeEnd) {
              return rangeData.base_price + (numOfUnits * rangeData.unit_price);
            }
        }
    } else {
        res.status(404).json({ message: `Utility pricing details not found for ${type}.` });
        return; 
    }
}

async function getUtilityCharges (req,res) {
    try {
        connection = await mysql.createConnection(dbConfig);

        const query = `SELECT 
            muc.unit_id,
            muc.util_month,
            muc.prev_balance,
            muc.month_amount,
            muc.tot_amount,
            muc.staff_id,
            muc.added_date,
            gu.no_of_units AS gasUsage,
            gu.month_amount AS gasCost,
            wu.no_of_units AS waterUsage,
            wu.month_amount AS waterCost,
            eu.no_of_units AS electricityUsage,
            eu.month_amount AS electricityCost
        FROM 
            monthUtilityCharge muc
        LEFT JOIN 
            gasUsage gu ON muc.id = gu.utilityCharge_id
        LEFT JOIN 
            waterUsage wu ON muc.id = wu.utilityCharge_id
        LEFT JOIN 
            elecUsage eu ON muc.id = eu.utilityCharge_id
        ORDER BY muc.added_date DESC ;
        `

        const [result] = await connection.query(query);
        console.log(result);
        return res.status(200).json({ result: result });
    } catch (error) {
        console.error('Failed to retrieve data',error);
        return res.status(201).json({message:'Process Failed'});
    } 
}
module.exports = { addUtilityCharge, getUtilityCharges }