const express = require("express");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/hello", verifyToken, checkRole(["admin"]), (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
