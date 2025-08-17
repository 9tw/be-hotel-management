const express = require("express");
const router = express.Router();
const { index } = require("../controllers/dashboardController");

router.get("/", index);

module.exports = router;
