const express = require("express");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  getBookingById,
  getCheckInToday,
  getBookingToday,
} = require("../controllers/bookingController");

router.get("/", index);
router.get("/get/:id", getBookingById);
router.get("/check-in", getCheckInToday);
router.get("/today", getBookingToday);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
