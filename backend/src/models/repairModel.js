const pool = require("../config/db");

const REPAIR_SELECT = `
  SELECT
    r.*,
    i.issue_title,
    i.status AS issue_status,
    i.priority AS issue_priority,
    i.branch_id,
    i.asset_id,
    b.branch_name,
    b.branch_code,
    a.asset_name,
    a.serial_number,
    u.full_name AS assigned_to_name
  FROM repairs r
  JOIN issues i ON r.issue_id = i.issue_id
  JOIN branches b ON i.branch_id = b.branch_id
  LEFT JOIN assets a ON i.asset_id = a.asset_id
  LEFT JOIN users u ON r.assigned_to = u.user_id
`;

const getAllRepairs = async ({ issue_id, assigned_to, status, branch_id } = {}) => {
  const conditions = [];
  const values = [];

  if (issue_id) {
    values.push(issue_id);
    conditions.push(`r.issue_id = $${values.length}`);
  }

  if (assigned_to) {
    values.push(assigned_to);
    conditions.push(`r.assigned_to = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`r.status = $${values.length}`);
  }

  if (branch_id) {
    values.push(branch_id);
    conditions.push(`i.branch_id = $${values.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `${REPAIR_SELECT}
     ${whereClause}
     ORDER BY r.created_at DESC, r.repair_id DESC`,
    values
  );

  return result.rows;
};

const getRepairById = async (id) => {
  const result = await pool.query(
    `${REPAIR_SELECT}
     WHERE r.repair_id = $1`,
    [id]
  );

  return result.rows[0];
};

const createRepair = async ({
  issue_id,
  assigned_to,
  repair_notes,
  cost,
  scheduled_date,
  completed_date,
  status = "Scheduled",
}) => {
  const result = await pool.query(
    `INSERT INTO repairs
       (issue_id, assigned_to, repair_notes, cost, scheduled_date, completed_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      issue_id,
      assigned_to || null,
      repair_notes || null,
      cost !== undefined && cost !== "" ? cost : null,
      scheduled_date || null,
      completed_date || null,
      status,
    ]
  );

  return result.rows[0];
};

const updateRepair = async (
  id,
  { assigned_to, repair_notes, cost, scheduled_date, completed_date, status }
) => {
  const result = await pool.query(
    `UPDATE repairs
     SET assigned_to = $1,
         repair_notes = $2,
         cost = $3,
         scheduled_date = $4,
         completed_date = $5,
         status = $6
     WHERE repair_id = $7
     RETURNING *`,
    [
      assigned_to || null,
      repair_notes || null,
      cost !== undefined && cost !== "" ? cost : null,
      scheduled_date || null,
      completed_date || null,
      status,
      id,
    ]
  );

  return result.rows[0];
};

const deleteRepair = async (id) => {
  const result = await pool.query(
    `DELETE FROM repairs
     WHERE repair_id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllRepairs,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair,
};

