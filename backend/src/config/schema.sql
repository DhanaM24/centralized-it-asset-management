-- ============================================================
-- ETFB – Centralized IT Asset Management System
-- Database Schema + Seed Data
-- ============================================================

-- Enable UUID extension (optional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Drop tables (safe re-run) ──────────────────────────────
DROP TABLE IF EXISTS repairs        CASCADE;
DROP TABLE IF EXISTS issues         CASCADE;
DROP TABLE IF EXISTS assets         CASCADE;
DROP TABLE IF EXISTS users          CASCADE;
DROP TABLE IF EXISTS branches       CASCADE;
DROP TABLE IF EXISTS organizations  CASCADE;

-- ── Organizations ──────────────────────────────────────────
CREATE TABLE organizations (
    organization_id   SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL UNIQUE,
    created_at        TIMESTAMP DEFAULT NOW()
);

-- ── Branches ───────────────────────────────────────────────
CREATE TABLE branches (
    branch_id       SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    branch_name     VARCHAR(150) NOT NULL,
    branch_code     VARCHAR(20)  NOT NULL UNIQUE,
    district        VARCHAR(100),
    address         TEXT,
    contact_number  VARCHAR(20),
    branch_type     VARCHAR(50)  CHECK (branch_type IN ('Head Office', 'Branch')) DEFAULT 'Branch',
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ── Users ──────────────────────────────────────────────────
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    branch_id     INTEGER REFERENCES branches(branch_id) ON DELETE SET NULL,
    full_name     VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50) CHECK (role IN ('Admin', 'IT Staff', 'Branch User')) DEFAULT 'Branch User',
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- ── Assets ─────────────────────────────────────────────────
CREATE TABLE assets (
    asset_id       SERIAL PRIMARY KEY,
    branch_id      INTEGER NOT NULL REFERENCES branches(branch_id) ON DELETE CASCADE,
    asset_name     VARCHAR(150) NOT NULL,
    asset_type     VARCHAR(100) CHECK (asset_type IN ('Desktop','Laptop','Printer','Monitor','Switch','Router','UPS','Other')),
    serial_number  VARCHAR(100) UNIQUE,
    brand          VARCHAR(100),
    model          VARCHAR(100),
    purchase_date  DATE,
    warranty_until DATE,
    status         VARCHAR(50) CHECK (status IN ('Active','Under Repair','Retired')) DEFAULT 'Active',
    notes          TEXT,
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ── Issues ─────────────────────────────────────────────────
CREATE TABLE issues (
    issue_id        SERIAL PRIMARY KEY,
    asset_id        INTEGER REFERENCES assets(asset_id) ON DELETE SET NULL,
    branch_id       INTEGER NOT NULL REFERENCES branches(branch_id),
    reported_by     INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    issue_title     VARCHAR(200) NOT NULL,
    description     TEXT,
    priority        VARCHAR(20) CHECK (priority IN ('Low','Medium','High')) DEFAULT 'Medium',
    status          VARCHAR(50) CHECK (status IN ('Submitted','In Progress','Resolved','Closed')) DEFAULT 'Submitted',
    reported_at     TIMESTAMP DEFAULT NOW(),
    resolved_at     TIMESTAMP
);

-- ── Repairs ────────────────────────────────────────────────
CREATE TABLE repairs (
    repair_id       SERIAL PRIMARY KEY,
    issue_id        INTEGER NOT NULL REFERENCES issues(issue_id) ON DELETE CASCADE,
    assigned_to     INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    repair_notes    TEXT,
    cost            NUMERIC(10,2),
    scheduled_date  DATE,
    completed_date  DATE,
    status          VARCHAR(50) CHECK (status IN ('Scheduled','In Progress','Completed','Cancelled')) DEFAULT 'Scheduled',
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ── Organization ───────────────────────────────────────────
INSERT INTO organizations (organization_name) VALUES
  ('Employees'' Trust Fund Board (ETFB)');

-- ── Branches (all 20 ETFB locations) ──────────────────────
INSERT INTO branches
  (organization_id, branch_name, branch_code, district, branch_type)
VALUES
  (1, 'Head Office – Narahenpita', 'ETFB-HO',  'Colombo',      'Head Office'),
  (1, 'Colombo 1–7',               'ETFB-C17', 'Colombo',      'Branch'),
  (1, 'Colombo 8–15',              'ETFB-C815','Colombo',      'Branch'),
  (1, 'Colombo District',          'ETFB-CDO', 'Colombo',      'Branch'),
  (1, 'Gampaha',                   'ETFB-GAM', 'Gampaha',      'Branch'),
  (1, 'Kalutara',                  'ETFB-KAL', 'Kalutara',     'Branch'),
  (1, 'Galle',                     'ETFB-GAL', 'Galle',        'Branch'),
  (1, 'Matara',                    'ETFB-MAT', 'Matara',       'Branch'),
  (1, 'Hambantota',                'ETFB-HAM', 'Hambantota',   'Branch'),
  (1, 'Kandy',                     'ETFB-KAN', 'Kandy',        'Branch'),
  (1, 'Kurunegala',                'ETFB-KUR', 'Kurunegala',   'Branch'),
  (1, 'Anuradhapura',              'ETFB-ANU', 'Anuradhapura', 'Branch'),
  (1, 'Kegalle',                   'ETFB-KEG', 'Kegalle',      'Branch'),
  (1, 'Ratnapura',                 'ETFB-RAT', 'Ratnapura',    'Branch'),
  (1, 'Badulla',                   'ETFB-BAD', 'Badulla',      'Branch'),
  (1, 'Nuwara Eliya',              'ETFB-NUW', 'Nuwara Eliya', 'Branch'),
  (1, 'Jaffna',                    'ETFB-JAF', 'Jaffna',       'Branch'),
  (1, 'Vavuniya',                  'ETFB-VAV', 'Vavuniya',     'Branch'),
  (1, 'Trincomalee',               'ETFB-TRI', 'Trincomalee',  'Branch'),
  (1, 'Ampara',                    'ETFB-AMP', 'Ampara',       'Branch');

-- ── Sample admin user (password: Admin@1234 – bcrypt hash placeholder) ──
INSERT INTO users (branch_id, full_name, email, password_hash, role) VALUES
  (1, 'System Administrator', 'admin@etfb.lk', '$2b$10$PLACEHOLDER_HASH_REPLACE_ME', 'Admin');

