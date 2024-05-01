const express = require("express");
const newStaff = require("../controller/addnewstaff.controller");

const router = express.Router();

// Post Requests
router.post("/addNewStaff", newStaff.addNewStaff);

// Get Requests
router.get("/addNewStaff", newStaff.getAllStaffDetails);
router.get("/addNewStaff/updateStaff/:staffID", newStaff.getStaffById);

// Delete Requests
router.delete("/addNewStaff/deleteStaff/:staffID", newStaff.deleteStaff);

// Put Requests
router.put("/addNewStaff/updateStaff/:staffID", newStaff.updateStaff);

module.exports = router;
