# Guide Stockage Open Source (MinIO / S3) & Sauvegardes Automatisées

## Pourquoi cette migration ?

Le dossier `public/` du dépôt pèse actuellement **~308 Mo** (`public/images` : 303,88 Mo, `public/videos` : 3,93 Mo).
À chaque déploiement Vercel, ces 308 Mo sont dupliqués, ce qui consomme rapidement les **10 Go** gratuits de *Deployment Storage*.

En déportant les médias vers **MinIO** (stockage objet open source compatible S3) :
1. Chaque déploiement Vercel passe de **~308 Mo à ~2–5 Mo**.
2. Vous disposez d'un stockage illimité (taille du disque de votre VPS) pour toutes vos images, vidéos, devis PDF et sauvegardes PostgreSQL.
3. Aucun code de composant n'a besoin d'être réécrit grâce aux redirections automatiques dans `next.config.mjs` et à l'utilitaire `src/lib/mediaUrl.ts`.

---

## Étape 1 — Démarrer MinIO + Sauvegarde PostgreSQL automatique (sur votre VPS / Coolify)

Dans `infra/storage/` :

```bash
export MINIO_ROOT_USER="magatte_admin"
export MINIO_ROOT_PASSWORD="MotDePasseTresRobusteChangeMe!"
export DATABASE_URL="postgresql://user:pass@host:5432/magatte_db"
export MINIO_CONSOLE_URL="https://console-media.magatteniang-expert.sn"

docker compose -f infra/storage/docker-compose.minio.yml up -d
```

Ce stack crée automatiquement :
- `magatte-media` : bucket public pour `images/` et `videos/`
- `magatte-backups` : bucket privé pour les dumps PostgreSQL quotidiens compressés (`gzip`, rétention 30 jours)

Exposez ensuite le port `9000` derrière Nginx/Caddy/Coolify en HTTPS sur `https://media.magatteniang-expert.sn` (pointant vers `/magatte-media`).

---

## Étape 2 — Transférer les 308 Mo de médias existants

Avec `mc` (MinIO Client, open source) :

```bash
mc alias set prod https://media.magatteniang-expert.sn "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mirror --overwrite --attr "Cache-Control=public,max-age=31536000,immutable" public/images prod/magatte-media/images
mc mirror --overwrite --attr "Cache-Control=public,max-age=31536000,immutable" public/videos prod/magatte-media/videos
```

*(Compatible aussi avec **Cloudflare R2**, **Garage**, **SeaweedFS** ou **Supabase Storage** via `rclone sync`.)*

---

## Étape 3 — Activer le basculement sur Vercel (ou Coolify)

1. Dans **Vercel → Project → Settings → Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_MEDIA_BASE_URL` = `https://media.magatteniang-expert.sn/magatte-media`
2. Une fois vérifié que `https://media.magatteniang-expert.sn/magatte-media/images/magatte-portrait.webp` répond en `200 OK`, ajoutez ces 2 lignes dans `.vercelignore` à la racine du projet :
   ```text
   public/images
   public/videos
   ```
3. Redéployez : `next.config.mjs` redirigera automatiquement `/images/*` et `/videos/*` vers votre stockage MinIO, et votre empreinte de déploiement Vercel sera divisée par ~60.
