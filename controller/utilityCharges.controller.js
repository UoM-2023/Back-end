const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');



async function addUtilityCharge (req,res){
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const {
            unit_id,
            electricityUsage,
            waterUsage,
            gasUsage,
            staff_id,
            remark
        } = req.body;

        console.log(staff_id);

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
        totalCost = gasCost + waterCost + electricityCost;
        const newBalance = totalCost + previousBalance;

        await connection.query('INSERT INTO balance (unit_id, utility_balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE utility_balance = ?', [unit_id, newBalance, newBalance]);

        // Inserint to main utility table
        const [utilityResult] = await connection.query('INSERT INTO monthUtilityCharge (unit_id, prev_balance, month_amount, tot_amount, staff_id, added_date) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',[unit_id, previousBalance, totalCost, newBalance, staff_id])

        console.log(utilityResult);
        // Take the utility charge id and insert values of gas, water and electricity
        const utilityCharge_id = utilityResult.insertId;
        await connection.query('INSERT INTO gasUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, gasUsage, gasCost]);
        await connection.query('INSERT INTO waterUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, waterUsage, waterCost]);
        await connection.query('INSERT INTO elecUsage (utilityCharge_id, unit_id, no_of_units, month_amount) VALUES (?, ?, ?, ?)',[utilityCharge_id, unit_id, electricityUsage, electricityCost]);

        return res.status(200).json({ message: 'Utility details updated successfully.' });
    } catch (error) {
        console.error('Failed to save data',error);
        return res.status(201).json({message:'Process Failed'});
    
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

module.exports = { addUtilityCharge }