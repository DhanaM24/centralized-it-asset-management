const issueModel = require("../models/issueModel");
const assetModel = require("../models/assetModel");

const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_STATUSES = ["Submitted", "In Progress", "Resolved", "Closed"];

const getIssues = async (req, res) => {
  try {
    const filters = {
      branch_id:
        req.user.role === "Branch User" ? req.user.branch_id : req.query.branch_id,
      status: req.query.status,
      priority: req.query.priority,
      asset_id: req.query.asset_id,
      search: req.query.search,
    };

    const issues = await issueModel.getAllIssues(filters);
    res.json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve issues" });
  }
};

const getIssue = async (req, res) => {
  try {
    const issue = await issueModel.getIssueById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (req.user.role === "Branch User" && issue.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        message: "Forbidden: You can only view issues for your branch",
      });
    }

    res.json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve issue" });
  }
};

const addIssue = async (req, res) => {
  try {
    const { asset_id, issue_title, description, priority = "Medium" } = req.body;
    const branch_id =
      req.user.role === "Branch User"
        ? req.user.branch_id
        : req.body.branch_id || req.user.branch_id;

    if (!branch_id || !issue_title?.trim()) {
      return res.status(400).json({
        message: "Branch and issue title are required",
      });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
      });
    }

    if (asset_id) {
      const asset = await assetModel.getAssetById(asset_id);
      if (!asset) {
        return res.status(400).json({ message: "Selected asset does not exist" });
      }
      if (req.user.role === "Branch User" && asset.branch_id !== branch_id) {
        return res.status(403).json({
          message: "Forbidden: You can only report issues for assets in your branch",
        });
      }
    }

    const issue = await issueModel.createIssue({
      asset_id,
      branch_id,
      reported_by: req.user.user_id,
      issue_title: issue_title.trim(),
      description: description?.trim(),
      priority,
    });

    res.status(201).json({
      message: "Hardware issue reported successfully",
      issue,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(400).json({ message: "Invalid branch or asset reference" });
    }

    res.status(500).json({ message: "Failed to report issue" });
  }
};

const editIssue = async (req, res) => {
  try {
    const {
      asset_id,
      issue_title,
      description,
      priority = "Medium",
      status = "Submitted",
    } = req.body;

    if (!issue_title?.trim()) {
      return res.status(400).json({ message: "Issue title is required" });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        message: `Priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const issue = await issueModel.updateIssue(req.params.id, {
      asset_id,
      issue_title: issue_title.trim(),
      description: description?.trim(),
      priority,
      status,
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({
      message: "Issue updated successfully",
      issue,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(400).json({ message: "Invalid asset reference" });
    }

    res.status(500).json({ message: "Failed to update issue" });
  }
};

const changeIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const issue = await issueModel.updateIssueStatus(req.params.id, status);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update issue status" });
  }
};

const removeIssue = async (req, res) => {
  try {
    const issue = await issueModel.deleteIssue(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete issue" });
  }
};

module.exports = {
  getIssues,
  getIssue,
  addIssue,
  editIssue,
  changeIssueStatus,
  removeIssue,
};

