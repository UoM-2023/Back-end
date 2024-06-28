const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

async function addNewUtility(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const { utilityData, priceData } = req.body;

    const query =
      "INSERT INTO utilityDetails (utility_name, modified_by) VALUES (?, ?)";

    try {
      // Insert utility data into 'utilities' table
      [utilityResult] = await connection.query(query, [
        utilityData.utilityType,
        utilityData.modifiedBy,
      ]);
      const utilityId = utilityResult.insertId;
      console.log(utilityResult);
      // Insert price data into 'prices' table
      const priceValues = priceData.map((price) => [
        utilityId,
        price.priceRange,
        price.basePrice,
        price.unitPrice,
      ]);
      await connection.query(
        "INSERT INTO utility_prices (utility_id, price_range, base_price, unit_price) VALUES ?",
        [priceValues]
      );

      res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
      console.error("Failed to save data", error);
      return res.status(201).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to save data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

async function getUtitlityDetails(req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Execute the query and wait for the results
    const [utilityDetailResults] = await connection.query(
      `SELECT * FROM utilityDetails`
    );
    console.log(utilityDetailResults);
    const [utilityPricesResults] = await connection.query(
      `SELECT * FROM utility_prices`
    );
    console.log(utilityPricesResults);

    // After getting results, you can now process them
    const utilityData = utilityDetailResults.map((utility) => {
      const prices = utilityPricesResults.filter(
        (price) => price.utility_id === utility.utility_id
      );
      return {
        utility_id: utility.utility_id,
        utility_name: utility.utility_name,
        modified_date: utility.modified_date,
        modified_by: utility.modified_by,
        prices: prices.map((price) => ({
          price_id: price.price_id,
          price_range: price.price_range,
          base_price: price.base_price,
          unit_price: price.unit_price,
        })),
      };
    });

    res.status(200).json(utilityData);
  } catch (error) {
    console.error("Failed to retrieve data", error);
    return res.status(201).json({ message: "Process Failed" });
  }
}

async function getOneUtilityDetail(req, res) {
  try {
    const utilityId = req.params.id; // Get the utility_id from request parameters
    console.log("Called GetAUtility", utilityId);
    const connection = await mysql.createConnection(dbConfig);

    // Execute the query and wait for the results
    const [utilityDetailResults] = await connection.query(
      `SELECT * FROM utilityDetails WHERE utility_id = ?`,
      [utilityId]
    );
    console.log(utilityDetailResults);

    // If no utility is found, return a 404 error
    if (utilityDetailResults.length === 0) {
      return res.status(404).json({ message: "Utility not found" });
    }

    const [utilityPricesResults] = await connection.query(
      `SELECT * FROM utility_prices WHERE utility_id = ?`,
      [utilityId]
    );
    console.log(utilityPricesResults);

    // Process the results
    const utility = utilityDetailResults[0];
    const prices = utilityPricesResults.map((price) => ({
      price_id: price.price_id,
      price_range: price.price_range,
      base_price: price.base_price,
      unit_price: price.unit_price,
    }));

    const utilityData = {
      utility_id: utility.utility_id,
      utility_name: utility.utility_name,
      modified_date: utility.modified_date,
      modified_by: utility.modified_by,
      prices: prices,
    };

    console.log("Utility data combined", utilityData);

    return res.status(200).json({ result: utilityData });
  } catch (error) {
    console.error("Failed to retrieve data", error);
    return res.status(500).json({ message: "Process Failed" });
  }
}

async function updateUtilityDetails (req, res) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    console.log("Update")

    const { utility_name, priceRange, basePrice, unitPrice, modifiedBy } = req.body;

    // Update price data in 'utility_prices' table based on utility type and price range
    const updateQuery = `
      UPDATE utility_prices up
      JOIN utilityDetails ud ON up.utility_id = ud.utility_id
      SET up.base_price = ?, up.unit_price = ?, ud.modified_by = ?
      WHERE ud.utility_name = ? AND up.price_range = ?
    `;

    try {
      const [result] = await connection.query(updateQuery, [
        basePrice,
        unitPrice,
        modifiedBy,
        utility_name,
        priceRange
      ]);

      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Data updated successfully" });
      } else {
        res.status(404).json({ message: "Utility or Price Range not found" });
      }
    } catch (error) {
      console.error("Failed to update data", error);
      return res.status(500).json({ message: "Process Failed" });
    }
  } catch (error) {
    console.error("Failed to connect to database", error);
    return res.status(500).json({ message: "Process Failed" });
  }
}

module.exports = { addNewUtility, getUtitlityDetails, getOneUtilityDetail, updateUtilityDetails };
