#!/bin/sh
set -eu

TIMESTAMP="$(date -u +%Y%m%d-%H%M%S)"
DUMP_FILE="/tmp/magatte-db-${TIMESTAMP}.sql.gz"

echo "[backup] Export PostgreSQL (${TIMESTAMP})..."
pg_dump "${DATABASE_URL}" --no-owner --no-acl | gzip -9 > "${DUMP_FILE}"

mc alias set local "${MINIO_ENDPOINT}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"
mc cp "${DUMP_FILE}" "local/magatte-backups/postgres/magatte-db-${TIMESTAMP}.sql.gz"
rm -f "${DUMP_FILE}"

# Nettoyage des sauvegardes plus anciennes que BACKUP_RETENTION_DAYS (defaut: 30j)
mc rm --recursive --force --older-than "${BACKUP_RETENTION_DAYS:-30}d" local/magatte-backups/postgres/ || true

echo "[backup] Sauvegarde envoyee vers local/magatte-backups/postgres/magatte-db-${TIMESTAMP}.sql.gz"
