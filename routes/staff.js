const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const {
  index,
  create,
  update,
  destroy,
  getAllStaffPagination,
  getStaffById,
  leaveUpdate,
} = require("../controllers/staffController");

cron.schedule("0 0 1 1 *", leaveUpdate);

router.get("/", index);
router.get("/all", getAllStaffPagination);
router.get("/get/:id", getStaffById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
