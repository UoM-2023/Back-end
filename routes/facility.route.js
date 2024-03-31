const express = require('express');
const facilityReserve = require('../controller/reserveFacility.controller');



const router = express.Router();

console.log(facilityReserve);
router.post('/addFacility',facilityReserve);

module.exports = router;