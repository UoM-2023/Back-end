const express = require('express');
const {addGuestDetails,getAllGuestDetails}= require('../controller/guestDetails.controller.js')


const router = express.Router();


router.post('/GuestDetails',addGuestDetails);
router.get('/GuestDetails',getAllGuestDetails);

module.exports = router;