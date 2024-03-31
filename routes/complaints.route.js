const express=require('express');
const Complaints=require('../controller/complaints.controller');

const router=express.Router();

console.log(Complaints);
router.post('/complaints',Complaints);

module.exports=router;