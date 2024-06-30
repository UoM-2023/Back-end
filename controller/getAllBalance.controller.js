const mysql = require('mysql2/promise')
const dbConfig = require('../config/db.config');

// let connection;

async function getAllBalance (req, res) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const query = `SELECT bal.*, ri.name_with_initials FROM balance bal INNER JOIN Residents_Information ri ON bal.unit_id = ri.UnitID AND ri.member_type = 'Owner' LIMIT ? OFFSET ?`;

        const [result] = await connection.query(query, [limit, offset]);

        const totalQuery = `SELECT COUNT(*) as count FROM balance bal INNER JOIN Residents_Information ri ON bal.unit_id = ri.UnitID AND ri.member_type = 'Owner'`;
        const [totalResult] = await connection.query(totalQuery);
        const total = totalResult[0].count;



        return res.status(200).json({ result: result, total: total })

    } catch (error) {
        console.error('Failed to retrieve data',error);
        return res.status(201).json({message:'Process Failed'});
    } finally {
        if (connection) {
          await connection.end();
        }
    }
}

async function searchBalance(req, res) {
    let connection;
    try {
      const queryParam = req.query.query || "";
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      connection = await mysql.createConnection(dbConfig);
  
      console.log("Search Called");
  
      const searchQuery = `
        SELECT bal.*, ri.name_with_initials FROM balance bal INNER JOIN Residents_Information ri ON bal.unit_id = ri.UnitID AND ri.member_type = 'Owner'
        WHERE bal.unit_id LIKE ?
        LIMIT ? OFFSET ?
      `;
  
      const searchPattern = `%${queryParam}%`;
      const [result] = await connection.query(searchQuery, [
        searchPattern,
        limit,
        offset
      ]);
  
      const totalQuery = `
        SELECT COUNT(*) as count FROM balance bal INNER JOIN Residents_Information ri ON bal.unit_id = ri.UnitID AND ri.member_type = 'Owner'
        WHERE bal.unit_id LIKE ? 
      `;
  
      const [totalResult] = await connection.query(totalQuery, [
        searchPattern
      ]);
  
      const total = totalResult[0].count;
  
      console.log(result);
  
      return res.status(200).json({ result: result, total: total });
  
    } catch (error) {
      console.error("Failed to search data", error);
      return res.status(500).json({ message: "Search Process Failed" });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  }

module.exports = { getAllBalance, searchBalance };
