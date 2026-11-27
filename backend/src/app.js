const express = require("express");
const cors = require("cors");
const organizationRoutes = require("./routes/organizationRoutes");
const branchRoutes = require("./routes/branchRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const issueRoutes = require("./routes/issueRoutes");
const repairRoutes = require("./routes/repairRoutes");
const app = express();

// Middleware (must be before routes)
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/branches", branchRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "IT Asset Management API is running",
  });
});

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const pool = require("./config/db");

    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "success",
      message: "Backend and PostgreSQL connected",
      database_time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

module.exports = app;
