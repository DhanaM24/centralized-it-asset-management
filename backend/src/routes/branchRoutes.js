const express = require("express");
const router = express.Router();

const {
    getBranches,
    getBranch,
    addBranch,
    editBranch,
    removeBranch
} = require("../controllers/branchController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.get("/", authorizeRoles("Admin", "IT Staff"), getBranches);
router.get("/:id", authorizeRoles("Admin", "IT Staff"), getBranch);

router.post("/", authorizeRoles("Admin"), addBranch);
router.put("/:id", authorizeRoles("Admin"), editBranch);
router.delete("/:id", authorizeRoles("Admin"), removeBranch);

module.exports = router;
