const express = require("express");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  getAllRoomName,
} = require("../controllers/roomController");

router.get("/", index);
router.get("/names", getAllRoomName);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
