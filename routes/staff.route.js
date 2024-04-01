const express = require("express");
const { addNewStaffMember, getAllStaffMembers } = require("../controller/staffDetailsAddNew.controller");

const router = express.Router();

router.get("/StaffDetails",getAllStaffMembers);
router.post("/StaffDetails", addNewStaffMember);


module.exports = router;
