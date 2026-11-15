#!/bin/sh
set -eu

# Script cle-en-main SEN-E-AGENCE (Malick Gueye - sene-devops)
# Etape 2 & Verification : Synchronisation des 308 Mo de medias vers MinIO / S3

: "${MEDIA_BASE_URL:=https://media.magatteniang-expert.sn}"
: "${MINIO_ROOT_USER:=magatte_admin}"
: "${MINIO_ROOT_PASSWORD:?Definir MINIO_ROOT_PASSWORD avant execution}"

echo "[1/3] Configuration alias MinIO..."
mc alias set prod "${MEDIA_BASE_URL}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

echo "[2/3] Synchronisation public/images -> prod/magatte-media/images ..."
mc mirror --overwrite --attr "Cache-Control=public,max-age=31536000,immutable" public/images prod/magatte-media/images

echo "[2/3] Synchronisation public/videos -> prod/magatte-media/videos ..."
mc mirror --overwrite --attr "Cache-Control=public,max-age=31536000,immutable" public/videos prod/magatte-media/videos

echo "[3/3] Verification HTTP 200 OK sur l'image temoin..."
TEST_URL="${MEDIA_BASE_URL}/magatte-media/images/magatte-portrait.webp"
HTTP_CODE="$(curl -s -o /dev/null -w "%{http_code}" "${TEST_URL}")"

if [ "${HTTP_CODE}" != "200" ]; then
  echo "ERREUR: ${TEST_URL} a repondu HTTP ${HTTP_CODE} (attendu: 200)."
  exit 1
fi

echo "OK: ${TEST_URL} -> HTTP 200."
echo "Etape suivante :"
echo "  1) Definir NEXT_PUBLIC_MEDIA_BASE_URL=${MEDIA_BASE_URL}/magatte-media sur Vercel"
echo "  2) Ajouter 'public/images' et 'public/videos' dans .vercelignore"
echo "  3) Redeployer sur Vercel (ou Coolify)"
