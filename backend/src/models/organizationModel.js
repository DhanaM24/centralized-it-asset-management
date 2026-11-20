const pool = require("../config/db");

const getOrganization = async () => {
  const result = await pool.query(
    "SELECT * FROM organizations ORDER BY organization_id",
  );

  return result.rows;
};

const createOrganization = async (data) => {
  const { organization_name, address, contact_number, email } = data;

  const result = await pool.query(
    `INSERT INTO organizations
        (organization_name, address, contact_number, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
    [organization_name, address, contact_number, email],
  );

  return result.rows[0];
};

const updateOrganization = async (id, data) => {
  const { organization_name, address, contact_number, email } = data;

  const result = await pool.query(
    `UPDATE organizations
         SET organization_name = $1,
             address = $2,
             contact_number = $3,
             email = $4
         WHERE organization_id = $5
         RETURNING *`,
    [organization_name, address, contact_number, email, id],
  );

  return result.rows[0];
};

module.exports = {
  getOrganization,
  createOrganization,
  updateOrganization,
};
