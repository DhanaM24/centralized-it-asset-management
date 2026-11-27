const pool = require("../config/db");

const getAllAssets = async ({ branch_id, asset_type, status, search } = {}) => {
  const conditions = [];
  const values = [];

  if (branch_id) {
    values.push(branch_id);
    conditions.push(`a.branch_id = $${values.length}`);
  }

  if (asset_type) {
    values.push(asset_type);
    conditions.push(`a.asset_type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`a.status = $${values.length}`);
  }

  if (search?.trim()) {
    values.push(`%${search.trim()}%`);
    const idx = values.length;
    conditions.push(
      `(a.asset_name ILIKE $${idx} OR a.serial_number ILIKE $${idx} OR a.brand ILIKE $${idx} OR a.model ILIKE $${idx})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT
       a.*,
       b.branch_name,
       b.branch_code
     FROM assets a
     JOIN branches b ON a.branch_id = b.branch_id
     ${whereClause}
     ORDER BY a.asset_id`,
    values
  );

  return result.rows;
};

const getAssetById = async (id) => {
  const result = await pool.query(
    `SELECT
       a.*,
       b.branch_name,
       b.branch_code
     FROM assets a
     JOIN branches b ON a.branch_id = b.branch_id
     WHERE a.asset_id = $1`,
    [id]
  );

  return result.rows[0];
};

const createAsset = async (data) => {
  const {
    branch_id,
    asset_name,
    asset_type = "Other",
    serial_number,
    brand,
    model,
    purchase_date,
    warranty_until,
    status = "Active",
    notes,
  } = data;

  const result = await pool.query(
    `INSERT INTO assets
       (branch_id, asset_name, asset_type, serial_number, brand, model,
        purchase_date, warranty_until, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      branch_id,
      asset_name,
      asset_type,
      serial_number || null,
      brand || null,
      model || null,
      purchase_date || null,
      warranty_until || null,
      status,
      notes || null,
    ]
  );

  return result.rows[0];
};

const updateAsset = async (id, data) => {
  const {
    branch_id,
    asset_name,
    asset_type,
    serial_number,
    brand,
    model,
    purchase_date,
    warranty_until,
    status,
    notes,
  } = data;

  const result = await pool.query(
    `UPDATE assets
     SET branch_id = $1,
         asset_name = $2,
         asset_type = $3,
         serial_number = $4,
         brand = $5,
         model = $6,
         purchase_date = $7,
         warranty_until = $8,
         status = $9,
         notes = $10
     WHERE asset_id = $11
     RETURNING *`,
    [
      branch_id,
      asset_name,
      asset_type,
      serial_number || null,
      brand || null,
      model || null,
      purchase_date || null,
      warranty_until || null,
      status,
      notes || null,
      id,
    ]
  );

  return result.rows[0];
};

const deleteAsset = async (id) => {
  const result = await pool.query(
    `DELETE FROM assets
     WHERE asset_id = $1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};

