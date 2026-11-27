const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
} = require("../controllers/userController");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff"), getUsers);
router.get("/:id", authorizeRoles("Admin", "IT Staff"), getUser);
router.post("/", authorizeRoles("Admin"), addUser);
router.put("/:id", authorizeRoles("Admin"), editUser);
router.delete("/:id", authorizeRoles("Admin"), removeUser);

module.exports = router;

