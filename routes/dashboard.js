const express = require("express");
const router = express.Router();
const {
  index,
  dashboardNotPayYet,
} = require("../controllers/dashboardController");

router.get("/", index);
router.get("/not-paid", dashboardNotPayYet);

module.exports = router;
