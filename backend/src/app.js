const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
    res.json({
        message: "IT Asset Management API is running"
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
            database_time: result.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed"
        });
    }
});

module.exports = app;