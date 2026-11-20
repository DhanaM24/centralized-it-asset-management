const express = require("express");
const router = express.Router();

const {
  getOrganizations,
  addOrganization,
  editOrganization,
} = require("../controllers/organizationController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff"), getOrganizations);

router.post("/", authorizeRoles("Admin"), addOrganization);

router.put("/:id", authorizeRoles("Admin"), editOrganization);

module.exports = router;
