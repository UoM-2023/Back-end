const express = require("express");
const residentInfoAddNew = require("../controller/residentInfoAddNew.controller");

const router = express.Router();


router.post("/ResidentsInfo", residentInfoAddNew);
router.get("/ResidentsInfo", );

module.exports = router;
