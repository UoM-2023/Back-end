const express = require('express');
const complaints = require('../controller/complaints.controller');

const router = express.Router();

//Post Request
router.post('/newComplaint',complaints.addNewComplaint);

//Get Request
router.get('/newComplaint', complaints.getAllComplaints);
router.get('/searchComplaint',complaints.searchComplaints);
router.get('/newComplaint/:id', complaints.getAComplaint);
router.get('/newComplaint_by_user_id/:Complained_by', complaints.getSupportRequestsByUser)

//Put Request
router.put('/newComplaint/:id', complaints.updateComplaint);

//Delete Request
router.delete('/newComplaint/:id', complaints.deleteComplaint);

module.exports=router;

