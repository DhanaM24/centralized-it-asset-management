const express = require("express");
const router = express.Router();

const {
  getRepairs,
  getRepair,
  addRepair,
  editRepair,
  removeRepair,
} = require("../controllers/repairController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff", "Branch User"), getRepairs);
router.get("/:id", authorizeRoles("Admin", "IT Staff", "Branch User"), getRepair);
router.post("/", authorizeRoles("Admin", "IT Staff"), addRepair);
router.put("/:id", authorizeRoles("Admin", "IT Staff"), editRepair);
router.delete("/:id", authorizeRoles("Admin"), removeRepair);

module.exports = router;

