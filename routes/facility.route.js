const express = require('express');
const Facilities = require('../controller/Facility.controller');



const router = express.Router();

//post
router.post('/Facilities',Facilities.facilityReserve);


//get
router.get('/Facilities',Facilities.getAllfacilityReserve);
router.get('/Facilities/:id',Facilities.getAFacility);

//update
router.put('/Facilities/:id',Facilities.updateFacility);

//delete
router.delete('/Facilities/:id',Facilities.deleteFacility);

module.exports = router;