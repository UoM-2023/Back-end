const express = require("express");
const NewUserCredentials = require("../controller/usercredentials.controller");

const router = express.Router();

// Post Requests
router.post("/NewUserCredentials", NewUserCredentials.usercredentials);

// Get Requests
router.get("/NewUserCredentials", NewUserCredentials.getAllUserCredentials);
router.get(
  "/NewUserCredentials/updateUserCredentials/:UserID",
  NewUserCredentials.getAllUserCredentialsById
);

// Delete Requests
router.delete(
  "/NewUserCredentials/deleteUserCredentials/:UserID",
  NewUserCredentials.deleteUserCredentials
);

// Put Requests
router.put(
  "/NewUserCredentials/updateUserCredentials/:UserID",
  NewUserCredentials.updateUserCredentials
);

module.exports = router;
