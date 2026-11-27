const pool = require("../config/db");

const USER_PUBLIC_COLUMNS = `
  u.user_id,
  u.branch_id,
  u.full_name,
  u.email,
  u.role,
  u.is_active,
  u.created_at,
  b.branch_name,
  b.branch_code
`;

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT ${USER_PUBLIC_COLUMNS}
    FROM users u
    LEFT JOIN branches b ON u.branch_id = b.branch_id
    ORDER BY u.user_id
  `);
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT ${USER_PUBLIC_COLUMNS}
     FROM users u
     LEFT JOIN branches b ON u.branch_id = b.branch_id
     WHERE u.user_id = $1`,
    [id]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.branch_id,
       u.full_name,
       u.email,
       u.password_hash,
       u.role,
       u.is_active,
       u.created_at,
       b.branch_name,
       b.branch_code
     FROM users u
     LEFT JOIN branches b ON u.branch_id = b.branch_id
     WHERE LOWER(u.email) = LOWER($1)`,
    [email]
  );
  return result.rows[0];
};

const createUser = async ({ branch_id, full_name, email, password_hash, role, is_active = true }) => {
  const result = await pool.query(
    `INSERT INTO users (branch_id, full_name, email, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING user_id, branch_id, full_name, email, role, is_active, created_at`,
    [branch_id || null, full_name, email, password_hash, role, is_active]
  );
  return result.rows[0];
};

const updateUser = async (id, { branch_id, full_name, email, role, is_active }) => {
  const result = await pool.query(
    `UPDATE users
     SET branch_id = $1,
         full_name = $2,
         email = $3,
         role = $4,
         is_active = $5
     WHERE user_id = $6
     RETURNING user_id, branch_id, full_name, email, role, is_active, created_at`,
    [branch_id || null, full_name, email, role, is_active, id]
  );
  return result.rows[0];
};

const updateUserPassword = async (id, password_hash) => {
  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1
     WHERE user_id = $2
     RETURNING user_id`,
    [password_hash, id]
  );
  return result.rows[0];
};

const deactivateUser = async (id) => {
  const result = await pool.query(
    `UPDATE users
     SET is_active = FALSE
     WHERE user_id = $1
     RETURNING user_id, branch_id, full_name, email, role, is_active, created_at`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  updateUserPassword,
  deactivateUser,
};

