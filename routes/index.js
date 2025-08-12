const express = require("express");
const router = express.Router();

router.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hotel Management Backend is Working",
  });
});

module.exports = router;
