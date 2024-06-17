const express = require('express');
const newGuest = require('../controller/guestDetails.controller');


const router = express.Router();

//post
router.post('/GuestDetails',newGuest.addGuestDetails);

//get
router.get('/GuestDetails',newGuest.getAllGuestDetails);
router.get('/GuestDetails/:id',newGuest.getAGuestDetail);

//update
router.put('/GuestDetails/:id',newGuest.updateGuestDetails);

//delete
router.delete('/GuestDetails/:id',newGuest.deleteGuestDetails);



module.exports = router;



// const {addGuestDetails,getAllGuestDetails}= require('../controller/guestDetails.controller.js')