const express = require('express');
const fundType = require('../controller/fundType.controller');

const router = express.Router();

console.log(fundType[0]);
router.post('/editFunds',fundType.addNewFund);

module.exports = router;