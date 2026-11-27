const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await userModel.getUserByEmail(email.trim());
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact an administrator.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured in environment variables");
      return res.status(500).json({ message: "Authentication configuration error" });
    }

    const payload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      branch_id: user.branch_id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    const { password_hash, ...publicUser } = user;

    res.json({
      message: "Login successful",
      token,
      user: publicUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user profile" });
  }
};

module.exports = {
  login,
  getMe,
};

