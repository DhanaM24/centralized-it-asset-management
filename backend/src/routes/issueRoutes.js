const express = require("express");
const router = express.Router();

const {
  getIssues,
  getIssue,
  addIssue,
  editIssue,
  changeIssueStatus,
  removeIssue,
} = require("../controllers/issueController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff", "Branch User"), getIssues);
router.get("/:id", authorizeRoles("Admin", "IT Staff", "Branch User"), getIssue);
router.post("/", authorizeRoles("Admin", "IT Staff", "Branch User"), addIssue);
router.put("/:id", authorizeRoles("Admin", "IT Staff"), editIssue);
router.patch("/:id/status", authorizeRoles("Admin", "IT Staff"), changeIssueStatus);
router.delete("/:id", authorizeRoles("Admin"), removeIssue);

module.exports = router;

