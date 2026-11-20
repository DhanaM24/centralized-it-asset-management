const pool = require("../config/db");

const getAllBranches = async () => {
  const result = await pool.query(`
        SELECT
            b.*,
            o.organization_name
        FROM branches b
        JOIN organizations o
            ON b.organization_id = o.organization_id
        ORDER BY b.branch_id
    `);

  return result.rows;
};

const getBranchById = async (id) => {
  const result = await pool.query(
    `SELECT
            b.*,
            o.organization_name
         FROM branches b
         JOIN organizations o
            ON b.organization_id = o.organization_id
         WHERE b.branch_id = $1`,
    [id],
  );

  return result.rows[0];
};

const createBranch = async (data) => {
  const {
    organization_id,
    branch_name,
    branch_code,
    address,
    contact_number,
    branch_type,
  } = data;

  const result = await pool.query(
    `INSERT INTO branches
        (organization_id, branch_name, branch_code, address,
         contact_number, branch_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
    [
      organization_id,
      branch_name,
      branch_code,
      address,
      contact_number,
      branch_type,
    ],
  );

  return result.rows[0];
};

const updateBranch = async (id, data) => {
  const {
    organization_id,
    branch_name,
    branch_code,
    address,
    contact_number,
    branch_type,
  } = data;

  const result = await pool.query(
    `UPDATE branches
         SET organization_id = $1,
             branch_name = $2,
             branch_code = $3,
             address = $4,
             contact_number = $5,
             branch_type = $6
         WHERE branch_id = $7
         RETURNING *`,
    [
      organization_id,
      branch_name,
      branch_code,
      address,
      contact_number,
      branch_type,
      id,
    ],
  );

  return result.rows[0];
};

const deleteBranch = async (id) => {
  const result = await pool.query(
    `DELETE FROM branches
         WHERE branch_id = $1
         RETURNING *`,
    [id],
  );

  return result.rows[0];
};

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
