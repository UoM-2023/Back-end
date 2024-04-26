const sql=require('mssql');
const dbConfig=require('../config/db.config');

async function addResidentialUnit (req,res){
    try{
        await sql.connect(dbConfig);

        const request=new sql.Request();
        const{
            unit,
            block,
            building,
            category,
            residentName,
            status,
        }=req.body;

        console.log(unit,block,building,category,status)
        const insertQuery=`INSERT INTO Residential_Unit (unit,blockNo,building,category,available) VALUES (@unit,@blockno,@building,@category,@available)`

        request.input('unit',sql.VarChar, unit);
        request.input('blockno',sql.VarChar, block);
        request.input('building',sql.VarChar, building);
        request.input('category',sql.VarChar, category);
        request.input('residentName',sql.VarChar, residentName);
        request.input('available',sql.VarChar, status);
        await request.query(insertQuery);

        return res.status(200).json({message: 'Residential Unit Successfully Added'});
    }
    catch(error){
        console.error('Failed to save data',error);
        return res.status(201).json({message: 'Process failed'});
    }
}

module.exports=addResidentialUnit;