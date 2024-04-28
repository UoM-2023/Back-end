const express = require("express");
const newStaff = require("../controller/addnewstaff.controller");

const router = express.Router();

// Post Requests
router.post("/addNewStaff", newStaff.addNewStaff);

// Get Requests
router.get("/addNewStaff", newStaff.getAllStaffDetails);

module.exports = router;
