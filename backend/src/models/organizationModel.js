const pool = require("../config/db");

const getOrganization = async () => {
  const result = await pool.query(
    `SELECT * FROM organizations ORDER BY organization_id`
  );

  return result.rows;
};

const createOrganization = async (data) => {
  const { organization_name } = data;

  const result = await pool.query(
    `INSERT INTO organizations (organization_name)
         VALUES ($1)
         RETURNING *`,
    [organization_name]
  );

  return result.rows[0];
};

const updateOrganization = async (id, data) => {
  const { organization_name } = data;

  const result = await pool.query(
    `UPDATE organizations
         SET organization_name = $1
         WHERE organization_id = $2
         RETURNING *`,
    [organization_name, id]
  );

  return result.rows[0];
};

module.exports = {
  getOrganization,
  createOrganization,
  updateOrganization,
};
