-- ============================================================
-- TaskFlow — PostgreSQL Schema
-- Run automatically on first container start via Docker / K8s
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    description TEXT            DEFAULT '',
    status      VARCHAR(20)     DEFAULT 'pending'
                    CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority    VARCHAR(10)     DEFAULT 'medium'
                    CHECK (priority IN ('low', 'medium', 'high')),
    due_date    VARCHAR(20),
    created_at  TIMESTAMP       DEFAULT NOW(),
    updated_at  TIMESTAMP       DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_updated_at
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_todos_status   ON todos (status);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos (priority);
CREATE INDEX IF NOT EXISTS idx_todos_created  ON todos (created_at DESC);

-- Seed data (optional demo rows)
INSERT INTO todos (title, description, priority, status) VALUES
    ('Set up the project',   'Initialize repo and install dependencies', 'high',   'completed'),
    ('Build REST API',       'Flask endpoints for CRUD operations',      'high',   'in_progress'),
    ('Design the frontend',  'ReactJS components with dark theme',       'medium', 'pending'),
    ('Write unit tests',     'Backend and frontend coverage',            'medium', 'pending'),
    ('Configure CI/CD',      'GitLab pipeline → AWS EKS',               'low',    'pending')
ON CONFLICT DO NOTHING;
