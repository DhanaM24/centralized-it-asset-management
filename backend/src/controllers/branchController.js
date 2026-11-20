const branchModel = require("../models/branchModel");

const validBranchTypes = ["Head Office", "Branch"];

const validateBranch = (data) => {
  const { organization_id, branch_name, branch_code, branch_type } = data;

  if (
    !organization_id ||
    !branch_name?.trim() ||
    !branch_code?.trim() ||
    !validBranchTypes.includes(branch_type)
  ) {
    return false;
  }

  return true;
};

const getBranches = async (req, res) => {
  try {
    const branches = await branchModel.getAllBranches();
    res.json(branches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve branches" });
  }
};

const getBranch = async (req, res) => {
  try {
    const branch = await branchModel.getBranchById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json(branch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve branch" });
  }
};

const addBranch = async (req, res) => {
  try {
    if (!validateBranch(req.body)) {
      return res.status(400).json({
        message:
          "Valid organization, branch name, branch code and branch type are required",
      });
    }

    const branch = await branchModel.createBranch(req.body);

    res.status(201).json({
      message: "Branch created successfully",
      branch,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Branch code already exists",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Organization does not exist",
      });
    }

    res.status(500).json({ message: "Failed to create branch" });
  }
};

const editBranch = async (req, res) => {
  try {
    if (!validateBranch(req.body)) {
      return res.status(400).json({
        message:
          "Valid organization, branch name, branch code and branch type are required",
      });
    }

    const branch = await branchModel.updateBranch(req.params.id, req.body);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({
      message: "Branch updated successfully",
      branch,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "Branch code already exists",
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "Organization does not exist",
      });
    }

    res.status(500).json({ message: "Failed to update branch" });
  }
};

const removeBranch = async (req, res) => {
  try {
    const branch = await branchModel.deleteBranch(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(409).json({
        message: "Cannot delete this branch because it has related records",
      });
    }

    res.status(500).json({ message: "Failed to delete branch" });
  }
};

module.exports = {
  getBranches,
  getBranch,
  addBranch,
  editBranch,
  removeBranch,
};
