const express = require("express");
const Settings = require("../controller/settings.controller");

const router = express.Router();

// router.get("/updatePassword/:UserID", Settings.getUserById);
router.put("/updateUserCredentials/:UserID", Settings.updatePassword);

module.exports = router;
