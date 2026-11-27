const pool = require("../config/db");

const ISSUE_SELECT = `
  SELECT
    i.*,
    b.branch_name,
    b.branch_code,
    a.asset_name,
    a.asset_type,
    a.serial_number,
    u.full_name AS reported_by_name
  FROM issues i
  JOIN branches b ON i.branch_id = b.branch_id
  LEFT JOIN assets a ON i.asset_id = a.asset_id
  LEFT JOIN users u ON i.reported_by = u.user_id
`;

const getAllIssues = async ({ branch_id, status, priority, asset_id, search } = {}) => {
  const conditions = [];
  const values = [];

  if (branch_id) {
    values.push(branch_id);
    conditions.push(`i.branch_id = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`i.status = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`i.priority = $${values.length}`);
  }

  if (asset_id) {
    values.push(asset_id);
    conditions.push(`i.asset_id = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(
      `(i.issue_title ILIKE $${idx} OR i.description ILIKE $${idx} OR a.asset_name ILIKE $${idx} OR a.serial_number ILIKE $${idx})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `${ISSUE_SELECT}
     ${whereClause}
     ORDER BY i.reported_at DESC, i.issue_id DESC`,
    values
  );

  return result.rows;
};

const getIssueById = async (id) => {
  const result = await pool.query(
    `${ISSUE_SELECT}
     WHERE i.issue_id = $1`,
    [id]
  );

  return result.rows[0];
};

const createIssue = async ({
  asset_id,
  branch_id,
  reported_by,
  issue_title,
  description,
  priority = "Medium",
}) => {
  const result = await pool.query(
    `INSERT INTO issues
       (asset_id, branch_id, reported_by, issue_title, description, priority, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'Submitted')
     RETURNING *`,
    [
      asset_id || null,
      branch_id,
      reported_by || null,
      issue_title,
      description || null,
      priority,
    ]
  );

  return result.rows[0];
};

const updateIssue = async (id, { asset_id, issue_title, description, priority, status }) => {
  const isResolved = status === "Resolved" || status === "Closed";

  const result = await pool.query(
    `UPDATE issues
     SET asset_id = $1,
         issue_title = $2,
         description = $3,
         priority = $4,
         status = $5,
         resolved_at = CASE
           WHEN $6::boolean THEN COALESCE(resolved_at, NOW())
           ELSE NULL
         END
     WHERE issue_id = $7
     RETURNING *`,
    [
      asset_id || null,
      issue_title,
      description || null,
      priority,
      status,
      isResolved,
      id,
    ]
  );

  return result.rows[0];
};

const updateIssueStatus = async (id, status) => {
  const isResolved = status === "Resolved" || status === "Closed";

  const result = await pool.query(
    `UPDATE issues
     SET status = $1,
         resolved_at = CASE
           WHEN $2::boolean THEN COALESCE(resolved_at, NOW())
           ELSE NULL
         END
     WHERE issue_id = $3
     RETURNING *`,
    [status, isResolved, id]
  );

  return result.rows[0];
};

const deleteIssue = async (id) => {
  const result = await pool.query(
    `DELETE FROM issues
     WHERE issue_id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
};

