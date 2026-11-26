const organizationModel = require("../models/organizationModel");

const getOrganizations = async (req, res) => {
  try {
    const organizations = await organizationModel.getOrganization();
    res.json(organizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve organizations" });
  }
};

const addOrganization = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name || !organization_name.trim()) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }

    const organization = await organizationModel.createOrganization(req.body);

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create organization" });
  }
};

const editOrganization = async (req, res) => {
  try {
    const { organization_name } = req.body;

    if (!organization_name || !organization_name.trim()) {
      return res.status(400).json({
        message: "Organization name is required",
      });
    }

    const organization = await organizationModel.updateOrganization(
      req.params.id,
      req.body,
    );

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    res.json({
      message: "Organization updated successfully",
      organization,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update organization" });
  }
};

module.exports = {
  getOrganizations,
  addOrganization,
  editOrganization,
};

const Organization = require("../models/organizationModel");

exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
