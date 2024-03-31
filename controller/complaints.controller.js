const sql=require('mssql');
const dbconfig=require('../config/db.config');

async function Complaints (req,res){
    try{
       await sql.connect(dbconfig) ;

       const request=new sql.Request();
       const{
        refNo,
        nature,
        title,
        by,
        description,
        status,
       }=req.body;

       console.log(nature,title,by,description,status)
       const insertQuery=`INSERT INTO Complaints (refNo,nature,title,by,description,status) VALUES (@refNo,@nature,@title,@by,@description,@status)`

       request.input('RefNo',sql.VarChar,refNo);
       request.input('Nature',sql.VarChar,nature);
       request.input('Title',sql.VarChar,title);
       request.input('By',sql.VarChar,by);
       request.input('Description',sql.VarChar,description);
       request.input('Status',sql.VarChar,status);
       await request.query(insertQuery);

       return res.status(200).json({message: 'Complaint Successfully Added'});
    }
    catch(error){
        console.error('Failed to ave data',error);
        return res.status(201).json({message: 'Process failed'});
    }
}
module.exports=Complaints;
