const pool = require("../config/db");
const repairModel = require("../models/repairModel");
const issueModel = require("../models/issueModel");

const VALID_REPAIR_STATUSES = [
  "Scheduled",
  "In Progress",
  "Completed",
  "Cancelled",
];

/**
 * Keep the parent issue and linked asset statuses aligned with repair progress.
 */
const syncIssueAndAssetStatus = async (issue, repairStatus) => {
  if (repairStatus === "Scheduled" || repairStatus === "In Progress") {
    if (issue.status === "Submitted") {
      await issueModel.updateIssueStatus(issue.issue_id, "In Progress");
    }
    if (issue.asset_id) {
      await pool.query(
        `UPDATE assets SET status = 'Under Repair' WHERE asset_id = $1`,
        [issue.asset_id]
      );
    }
  } else if (repairStatus === "Completed") {
    await issueModel.updateIssueStatus(issue.issue_id, "Resolved");
    if (issue.asset_id) {
      await pool.query(
        `UPDATE assets SET status = 'Active' WHERE asset_id = $1`,
        [issue.asset_id]
      );
    }
  }
};

const getRepairs = async (req, res) => {
  try {
    const filters = {
      branch_id:
        req.user.role === "Branch User" ? req.user.branch_id : req.query.branch_id,
      issue_id: req.query.issue_id,
      assigned_to: req.query.assigned_to,
      status: req.query.status,
    };

    const repairs = await repairModel.getAllRepairs(filters);
    res.json(repairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve repairs" });
  }
};

const getRepair = async (req, res) => {
  try {
    const repair = await repairModel.getRepairById(req.params.id);

    if (!repair) {
      return res.status(404).json({ message: "Repair record not found" });
    }

    if (req.user.role === "Branch User" && repair.branch_id !== req.user.branch_id) {
      return res.status(403).json({
        message: "Forbidden: You can only view repairs for your branch",
      });
    }

    res.json(repair);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve repair record" });
  }
};

const addRepair = async (req, res) => {
  try {
    const {
      issue_id,
      assigned_to,
      repair_notes,
      cost,
      scheduled_date,
      completed_date,
      status = "Scheduled",
    } = req.body;

    if (!issue_id) {
      return res.status(400).json({ message: "Issue ID is required" });
    }

    if (!VALID_REPAIR_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Repair status must be one of: ${VALID_REPAIR_STATUSES.join(", ")}`,
      });
    }

    const issue = await issueModel.getIssueById(issue_id);
    if (!issue) {
      return res.status(404).json({ message: "Related issue not found" });
    }

    const repair = await repairModel.createRepair({
      issue_id,
      assigned_to,
      repair_notes: repair_notes?.trim(),
      cost,
      scheduled_date,
      completed_date,
      status,
    });

    await syncIssueAndAssetStatus(issue, status);

    res.status(201).json({
      message: "Repair record created successfully",
      repair,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(400).json({ message: "Invalid issue or technician reference" });
    }

    res.status(500).json({ message: "Failed to create repair record" });
  }
};

const editRepair = async (req, res) => {
  try {
    const {
      assigned_to,
      repair_notes,
      cost,
      scheduled_date,
      completed_date,
      status = "Scheduled",
    } = req.body;

    if (!VALID_REPAIR_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Repair status must be one of: ${VALID_REPAIR_STATUSES.join(", ")}`,
      });
    }

    const existing = await repairModel.getRepairById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Repair record not found" });
    }

    const repair = await repairModel.updateRepair(req.params.id, {
      assigned_to,
      repair_notes: repair_notes?.trim(),
      cost,
      scheduled_date,
      completed_date,
      status,
    });

    const issue = await issueModel.getIssueById(existing.issue_id);
    if (issue) {
      await syncIssueAndAssetStatus(issue, status);
    }

    res.json({
      message: "Repair record updated successfully",
      repair,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23503") {
      return res.status(400).json({ message: "Invalid technician reference" });
    }

    res.status(500).json({ message: "Failed to update repair record" });
  }
};

const removeRepair = async (req, res) => {
  try {
    const repair = await repairModel.deleteRepair(req.params.id);

    if (!repair) {
      return res.status(404).json({ message: "Repair record not found" });
    }

    res.json({ message: "Repair record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete repair record" });
  }
};

module.exports = {
  getRepairs,
  getRepair,
  addRepair,
  editRepair,
  removeRepair,
};

