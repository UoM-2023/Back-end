const express = require("express");
const newResident = require("../controller/addnewresident.controller");

const router = express.Router();

// Post Requests
router.post("/addNewResident", newResident.addNewResident);

// Get Requests
router.get("/addNewResident", newResident.getAllResidentsDetails);

module.exports = router;
