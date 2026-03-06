FROM postgres:16-alpine

LABEL maintainer="taskflow-team"
LABEL description="TaskFlow PostgreSQL database with auto-initialized schema"

# Copy init scripts — executed in alphabetical order on first start
COPY init.sql /docker-entrypoint-initdb.d/01-init.sql

# Optional: copy all migration files for reference
# (Flyway / Liquibase would handle these in production)
COPY migrations/ /docker-entrypoint-initdb.d/migrations/

ENV POSTGRES_DB=tododb
ENV POSTGRES_USER=postgres
# Override POSTGRES_PASSWORD at runtime — never hardcode in image

EXPOSE 5432

# Healthcheck
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
