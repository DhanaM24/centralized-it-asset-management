const express = require("express");
const router = express.Router();

const {
  getAssets,
  getAsset,
  addAsset,
  editAsset,
  removeAsset,
} = require("../controllers/assetController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff", "Branch User"), getAssets);
router.get("/:id", authorizeRoles("Admin", "IT Staff", "Branch User"), getAsset);
router.post("/", authorizeRoles("Admin", "IT Staff"), addAsset);
router.put("/:id", authorizeRoles("Admin", "IT Staff"), editAsset);
router.delete("/:id", authorizeRoles("Admin"), removeAsset);

module.exports = router;

