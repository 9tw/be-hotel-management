const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.use("/auth", require("./auth"));
router.use("/dashboard", authMiddleware, require("./dashboard"));
router.use("/booking", authMiddleware, require("./booking"));
router.use("/room", authMiddleware, require("./room"));
router.use("/staff", authMiddleware, require("./staff"));
router.use("/user", authMiddleware, require("./user"));

router.use("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hotel Management Backend is Working",
  });
});

module.exports = router;
