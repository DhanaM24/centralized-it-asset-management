const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const VALID_ROLES = ["Admin", "IT Staff", "Branch User"];

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user" });
  }
};

const addUser = async (req, res) => {
  try {
    const { branch_id, full_name, email, password, role = "Branch User", is_active = true } = req.body;

    if (!full_name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      branch_id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password_hash,
      role,
      is_active,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ message: "Selected branch does not exist" });
    }

    res.status(500).json({ message: "Failed to create user" });
  }
};

const editUser = async (req, res) => {
  try {
    const { branch_id, full_name, email, role, is_active = true, password } = req.body;

    if (!full_name?.trim() || !email?.trim() || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Valid full name, email, and role are required",
      });
    }

    const user = await userModel.updateUser(req.params.id, {
      branch_id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      role,
      is_active,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password?.trim()) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }
      const password_hash = await bcrypt.hash(password, 10);
      await userModel.updateUserPassword(req.params.id, password_hash);
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (error.code === "23503") {
      return res.status(400).json({ message: "Selected branch does not exist" });
    }

    res.status(500).json({ message: "Failed to update user" });
  }
};

const removeUser = async (req, res) => {
  try {
    const user = await userModel.deactivateUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to deactivate user" });
  }
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  editUser,
  removeUser,
};

