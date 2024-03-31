const express = require('express');
const addReservation = require('../controller/addReservation.controller');



const router = express.Router();

console.log(addReservation);
router.post('/addReservations',addReservation);

module.exports = router;