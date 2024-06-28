const express = require("express");
const Settings = require("../controller/settings.controller");

const router = express.Router();

router.get("/getUser/:UserID", Settings.getUserByuserID);
router.put("/updateUserCredentials/:UserID", Settings.updatePassword);

module.exports = router;
