-- ============================================================
-- Migration V2 — Add tags column & archived flag
-- Apply with: psql $DATABASE_URL -f migrations/V2__add_tags_archived.sql
-- ============================================================

ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS tags     TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_todos_archived ON todos (archived);

COMMENT ON COLUMN todos.tags     IS 'Array of free-form label strings';
COMMENT ON COLUMN todos.archived IS 'Soft-delete flag; archived rows hidden by default';
