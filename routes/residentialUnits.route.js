const express=require('express');
const addResidentialUnit=require('../controller/residentialUnits.controller');

const router=express.Router();

console.log(addResidentialUnit);
router.post('/residentialUnit',addResidentialUnit);

module.exports=router;