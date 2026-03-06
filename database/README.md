# Database — PostgreSQL

This folder owns everything related to the PostgreSQL database: schema, migrations, Docker image, and backup tooling.

## Files

```
database/
├── Dockerfile          # Custom PG image with auto-init
├── init.sql            # Schema + seed data (runs on first start)
├── backup.sh           # pg_dump backup with 7-day retention
└── migrations/
    └── V2__add_tags_archived.sql
```

## Local usage

```bash
# Start standalone DB
docker build -t todo-db .
docker run -d \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  --name todo-postgres \
  todo-db
```

## Connect

```bash
psql -h localhost -U postgres -d tododb
```

## Schema overview

| Column      | Type         | Notes                              |
|-------------|-------------|-------------------------------------|
| id          | SERIAL PK   |                                     |
| title       | VARCHAR(255)| Required                            |
| description | TEXT        | Optional                            |
| status      | VARCHAR(20) | pending \| in_progress \| completed |
| priority    | VARCHAR(10) | low \| medium \| high               |
| due_date    | VARCHAR(20) | ISO date string                     |
| created_at  | TIMESTAMP   | Auto-set                            |
| updated_at  | TIMESTAMP   | Auto-updated via trigger            |

## Migrations

Add new migration files under `migrations/` using the `V<N>__description.sql` naming convention. Apply manually or wire into a Flyway/Liquibase job in CI.

## Backup

```bash
DB_HOST=localhost DB_PASSWORD=postgres ./backup.sh
# Output: ./backups/tododb_20240315_120000.sql.gz
```
