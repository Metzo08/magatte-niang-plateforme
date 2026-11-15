# Guide Cloudflare R2 (100 % Gratuit — 10 Go + Bande passante illimitée)

Ce guide permet de libérer **~308 Mo par déploiement Vercel** sans louer de serveur VPS.

## Étape 1 — Créer le bucket gratuit sur Cloudflare R2
1. Connectez-vous sur `https://dash.cloudflare.com` (compte gratuit).
2. Dans le menu de gauche, cliquez sur **R2 Object Storage** → **Create bucket**.
3. Nom du bucket : `magatte-media` → **Create bucket**.
4. Ouvrez le bucket `magatte-media` → onglet **Settings** → section **Public Access** :
   - Activez **Allow Access** sur le sous-domaine gratuit `r2.dev` (ou liez votre propre domaine `media.magatteniang-expert.sn`).
   - Copiez l'URL publique affichée (ex: `https://pub-xxxxxxxxxxxxxxxx.r2.dev`).

## Étape 2 — Créer les clés API d'envoi
1. Dans **R2 Object Storage**, cliquez sur **Manage R2 API Tokens** → **Create API token**.
2. Permissions : **Object Read & Write** sur le bucket `magatte-media`.
3. Notez les 3 informations affichées :
   - `Account ID` (affiché dans l'URL ou le panneau droit de R2)
   - `Access Key ID`
   - `Secret Access Key`

## Étape 3 — Envoyer les 308 Mo depuis votre PC (1 commande)
Dans PowerShell, à la racine du projet :

```powershell
$env:R2_ACCOUNT_ID="VOTRE_ACCOUNT_ID"
$env:R2_ACCESS_KEY_ID="VOTRE_ACCESS_KEY_ID"
$env:R2_SECRET_ACCESS_KEY="VOTRE_SECRET_ACCESS_KEY"
$env:R2_BUCKET="magatte-media"
$env:R2_PUBLIC_URL="https://pub-xxxxxxxxxxxxxxxx.r2.dev"

node infra/storage/upload-to-r2.mjs
```

Le script envoie automatiquement tous les fichiers de `public/images` et `public/videos` (sans rien installer) et vérifie que l'URL publique répond `HTTP 200`.

## Étape 4 — Activer sur Vercel
1. Dans **Vercel → magatte-niang-plateforme → Settings → Environment Variables**, ajoutez :
   - Name : `NEXT_PUBLIC_MEDIA_BASE_URL`
   - Value : `https://pub-xxxxxxxxxxxxxxxx.r2.dev` *(votre URL publique R2, sans `/` final)*
2. Créez/modifiez le fichier `.vercelignore` à la racine du dépôt avec ces 2 lignes :
   ```text
   public/images
   public/videos
   ```
3. Poussez sur GitHub : chaque déploiement Vercel passe de **~308 Mo à quelques Mo** !
