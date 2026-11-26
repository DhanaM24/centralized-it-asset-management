const express = require("express");
const router = express.Router();

const organizationController = require("../controllers/organizationController");

// Get all organizations
router.get("/", organizationController.getOrganizations);

// Create organization
router.post("/", organizationController.createOrganization);

module.exports = router;
