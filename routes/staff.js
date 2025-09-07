const express = require("express");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  getAllStaffPagination,
  getStaffById,
} = require("../controllers/staffController");

router.get("/", index);
router.get("/all", getAllStaffPagination);
router.get("/get/:id", getStaffById);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
