const express = require('express');
const Reservations = require('../controller/Reservations.controller');



const router = express.Router();

//post
router.post('/Reservations',Reservations.addReservation);


//get
router.get('/Reservations',Reservations.getAllReservations);
router.get('/Reservations/:id',Reservations.getAReservation);

//update
router.put('/Reservations/:id',Reservations.updateReservation);

//delete
router.delete('/Reservations/:id',Reservations.deleteReservation);

module.exports = router;