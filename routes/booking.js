const express = require("express");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  getBookingById,
  getCheckInToday,
  getCheckInTomorrow,
  getCheckOutToday,
  getCheckOutTomorrow,
  getBookingToday,
} = require("../controllers/bookingController");

router.get("/", index);
router.get("/get/:id", getBookingById);
router.get("/check-in-today", getCheckInToday);
router.get("/check-in-tomorrow", getCheckInTomorrow);
router.get("/check-out-today", getCheckOutToday);
router.get("/check-out-tomorrow", getCheckOutTomorrow);
router.get("/today", getBookingToday);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
