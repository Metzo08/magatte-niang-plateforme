# 🐘 Configuration PostgreSQL pour la Plateforme

## Étape 1: Installation PostgreSQL

### Si PostgreSQL n'est pas installé :

1. **Télécharger PostgreSQL 17**
   - https://www.postgresql.org/download/windows/
   - Ou via l'installateur : https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Installer PostgreSQL**
   - Exécuter l'installateur
   - Choisir le port **5432** (par défaut)
   - Définir le mot de passe pour l'utilisateur `postgres`

3. **Vérifier l'installation**
   ```powershell
   psql --version
   ```

---

## Étape 2: Créer la base de données et l'utilisateur

### Ouvrir le terminal PostgreSQL (psql)

```powershell
# Se connecter à PostgreSQL
psql -U postgres
```

### Créer l'utilisateur et la base

```sql
-- Créer l'utilisateur
CREATE USER magatte_niang WITH PASSWORD 'senecarte';

-- Donner les privilèges
ALTER USER magatte_niang CREATEDB;

-- Se connecter à la base postgres (ou créer une nouvelle base)
GRANT ALL PRIVILEGES ON DATABASE postgres TO magatte_niang;

-- Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO magatte_niang;

-- Quitter
\q
```

---

## Étape 3: Tester la connexion

```powershell
# Tester avec psql
psql -U magatte_niang -d postgres -h localhost

# Si ça fonctionne, quitter avec \q
```

---

## Étape 4: Configuration du projet

### Le fichier `.env` est déjà configuré avec :
```
DATABASE_URL="postgresql://magatte_niang:senecarte@localhost:5432/postgres?schema=public"
```

---

## Étape 5: Créer les tables dans PostgreSQL

```powershell
# Aller dans le dossier du projet
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"

# Générer le client Prisma
npx prisma generate

# Créer les tables dans PostgreSQL
npx prisma db push

# Remplir avec les données
npx tsx prisma/seed.ts
```

---

## Étape 6: Vérifier que tout fonctionne

```powershell
# Ouvrir Prisma Studio pour voir les données
npx prisma studio
```

Ouvre http://localhost:5555 pour voir la base de données graphiquement.

---

## 🐛 Dépannage

### Erreur: "Authentication failed"

**Solution 1: Vérifier le mot de passe**
```powershell
psql -U magatte_niang -d postgres -h localhost
# Entrer le mot de passe: senecarte
```

**Solution 2: Modifier pg_hba.conf**

Localiser le fichier `pg_hba.conf` (généralement dans `C:\Program Files\PostgreSQL\17\data\`)

Modifier la ligne:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
```

En:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
```

Puis redémarrer PostgreSQL:
```powershell
# Dans les services Windows
services.msc
# Trouver "postgresql-x64-17" et redémarrer
```

### Erreur: "Connection refused"

PostgreSQL n'est pas démarré.

**Solution:**
```powershell
# Démarrer le service
net start postgresql-x64-17
```

### Erreur: "Database does not exist"

**Solution:**
```sql
-- Se connecter en tant que postgres
psql -U postgres

-- Créer la base
CREATE DATABASE magatteniang;

-- Donner les droits
GRANT ALL PRIVILEGES ON DATABASE magatteniang TO magatte_niang;
```

Puis modifier `.env`:
```
DATABASE_URL="postgresql://magatte_niang:senecarte@localhost:5432/magatteniang?schema=public"
```

---

## 📊 Structure de la base après seeding

Tables créées:
- `Entity` (7 entités de l'écosystème)
- `Product` (Catalogue P2M)
- `Project` (Projets de référence)
- `Lead` (Prospects avec scoring)
- `Quote` (Devis clients)
- `Appointment` (Rendez-vous)
- `LabTest` (Essais laboratoire)
- `Equipment` (Matériel disponible)
- `Publication` (Articles scientifiques)
- `Partner` (Partenaires)
- `Testimonial` (Témoignages)
- `BlogPost` (Articles de blog)
- `Contact` (Formulaires de contact)
- `Document` (Documents téléchargeables)

---

## ✅ Une fois configuré

Lancez le serveur:
```powershell
npm run dev
```

La plateforme sera accessible sur http://localhost:3000 avec PostgreSQL comme base de données !

---

## 🔄 Commandes utiles

```powershell
# Voir les tables créées
npx prisma studio

# Réinitialiser la base
npx prisma db push --force-reset
npx tsx prisma/seed.ts

# Voir les migrations
npx prisma migrate status

# Créer une migration
npx prisma migrate dev --name init
```