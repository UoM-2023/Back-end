const express = require('express');
const addNewFund = require('../controller/fundType.controller');



const router = express.Router();

console.log(addNewFund);
router.post('/editFunds',addNewFund);

module.exports = router;