const express = require("express");
const router = express.Router();
const {
  index,
  create,
  update,
  destroy,
  getAllInventoryPagination,
} = require("../controllers/inventoryController");

router.get("/", index);
router.get("/all", getAllInventoryPagination);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", destroy);

module.exports = router;
