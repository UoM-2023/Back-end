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

        console.log(unit,block,building,category,residentName,status)
        const insertQuery=`INSERT INTO Residential_Units (unit,block,building,category,residentName,status) VALUES (@unit,@block,@building,@category,@residentName,@status)`

        request.input('Unit',sql.VarChar, unit);
        request.input('Block',sql.VarChar, block);
        request.input('Building',sql.VarChar, building);
        request.input('Category',sql.VarChar, category);
        request.input('ResidentName',sql.VarChar, residentName);
        request.input('Status',sql.VarChar, status);
        await request.query(insertQuery);

        return res.status(200).json({message: 'Residential Unit Successfully Added'});
    }
    catch(error){
        console.error('Failed to save data',error);
        return res.status(201).json({message: 'Process failed'});
    }
}

module.exports=addResidentialUnit;