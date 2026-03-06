#!/bin/sh
# ============================================================
# TaskFlow — PostgreSQL Backup Script
# Usage: ./backup.sh
# Env vars: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# ============================================================

set -e

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-tododb}"
DB_USER="${DB_USER:-postgres}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "→ Backing up $DB_NAME to $BACKUP_FILE ..."

PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-password \
    --format=plain \
    --clean \
    --if-exists \
  | gzip > "$BACKUP_FILE"

echo "✅ Backup complete: $BACKUP_FILE"

# Retain only the last 7 backups
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -type f \
    | sort -r | tail -n +8 | xargs -r rm --
echo "🗑  Old backups pruned (keeping last 7)"
