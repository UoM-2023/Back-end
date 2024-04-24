const express = require('express');
const addNewCompletedMaintenanceReq = require('../controller/completedMaintenance.controller');
const addNewInternalMaintenanceRequest = require('../controller/InternalMaintenanceReq.controller');
const addNewMaintenanceRequest = require('../controller/newMaintenanceReq.controller');




const router = express.Router();


router.post('/completedMaintenanceReq',addNewCompletedMaintenanceReq.addNewCompletedMaintenanceReq);
router.get('/getCompletedMaintenanceReq',addNewCompletedMaintenanceReq.getCompletedMaintenanceReq);


router.post('/addNewInternalMaintenanceRequest',addNewInternalMaintenanceRequest.addNewInternalMaintenanceRequest);
router.get('/getNewInternalMaintenanceRequest',addNewInternalMaintenanceRequest.getInternalMaintenanceReq);

router.post('/addNewMaintenanceRequest',addNewMaintenanceRequest.addNewMaintenanceRequest);
router.get('/getNewMaintenanceRequest',addNewMaintenanceRequest.getNewMaintenanceReq);


module.exports = router;

