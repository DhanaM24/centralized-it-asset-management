const express = require("express");
const router = express.Router();

const organizationController = require("../controllers/organizationController");

// Get all organizations
router.get("/", organizationController.getOrganizations);

// Create organization
router.post("/", organizationController.addOrganization);

// Update organization
router.put("/:id", organizationController.editOrganization);

module.exports = router;
