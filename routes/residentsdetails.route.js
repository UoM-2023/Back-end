const express = require("express");
const newResident = require("../controller/addnewresident.controller");
const {
  retrieveUser,
} = require("../controller/retireveUserDetails.controller");

const router = express.Router();

// Post Requests
router.post("/addNewResident", newResident.addNewResident);

// Get Requests
router.get("/addNewResident", newResident.getAllResidentsDetails);
router.get("/searchResident", newResident.searchDetails);
router.get(
  "/addNewResident/updateResident/:residentID",
  newResident.getResidentById
);
router.get("/viewResident/:UnitID", newResident.getResidentByUnitID);


// Delete Requests
router.delete(
  "/addNewResident/deleteResident/:residentID",
  newResident.deleteResident
);

// Put Requests
router.put(
  "/addNewResident/updateResident/:residentID",
  newResident.updateResident
);

router.get("/getResidentInfo/:id", retrieveUser);

module.exports = router;

//"residentsDetails/addNewResident/updateResident/:residentID"
