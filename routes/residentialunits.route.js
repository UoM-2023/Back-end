const express = require("express");
const residentialUnits = require("../controller/residentialUnits.controller");

const router = express.Router();

//Post Request
router.post("/addNewUnit", residentialUnits.addNewUnit);

//Get Request
router.get("/addNewUnit", residentialUnits.getAllUnits);
router.get("/addNewUnit/:id", residentialUnits.getAUnit);

//Put Request
router.put("/addNewUnit/:Unit_id", residentialUnits.updateUnit);

//Delete Request
router.delete("/addNewUnit/:id", residentialUnits.deleteUnit);

module.exports = router;
