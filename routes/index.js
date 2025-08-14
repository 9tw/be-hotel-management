const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.use("/auth", require("./auth"));
router.use("/booking", authMiddleware, require("./booking"));
router.use("/room", authMiddleware, require("./room"));

router.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hotel Management Backend is Working",
  });
});

module.exports = router;
