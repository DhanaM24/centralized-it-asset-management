const express = require("express");
const router = express.Router();

const { login, getMe, changePassword } = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.put("/password", authenticateToken, changePassword);

module.exports = router;

