# 🐘 Configuration PostgreSQL via pgAdmin (Interface Graphique)

## Étape 1: Ouvrir pgAdmin

1. Chercher **"pgAdmin"** dans le menu Windows
2. Ouvrir pgAdmin 4
3. Un navigateur web s'ouvre automatiquement

---

## Étape 2: Se connecter au serveur PostgreSQL

1. Dans la barre latérale gauche, cliquer sur **"Servers"**
2. Cliquer sur **"PostgreSQL 17"** (ou la version installée)
3. Entrer le mot de passe du superutilisateur `postgres` : **senecarte**
4. Cliquer **OK**

---

## Étape 3: Créer l'utilisateur `magatte_niang`

### 3.1 Aller dans Login/Group Roles
1. Dans l'arbre à gauche, dérouler **PostgreSQL 17**
2. Cliquer droit sur **"Login/Group Roles"**
3. Sélectionner **"Create" → "Login/Group Role..."**

### 3.2 Configurer le rôle

**Onglet "General" :**
- Name: `magatte_niang`

**Onglet "Definition" :**
- Password: `senecarte`
- Cocher **"Password valid until"** et laisser vide (jamais expire)

**Onglet "Privileges" :**
- ✅ Cocher **"Can login?"** → **YES**
- ✅ Cocher **"Create databases?"** → **YES**
- ✅ Cocher **"Create roles?"** → **NO** (pas nécessaire)
- ✅ Cocher **"Superuser?"** → **NO** (pas nécessaire)

**Cliquer sur "Save"**

---

## Étape 4: Donner les privilèges sur la base `postgres`

### 4.1 Ouvrir l'outil de requête SQL
1. Cliquer droit sur **"PostgreSQL 17"** dans l'arbre
2. Sélectionner **"Query Tool"** (ou appuyer sur Alt+Shift+Q)

### 4.2 Exécuter les commandes SQL

Copier-coller ce code dans la fenêtre de requête :

```sql
-- Donner tous les privilèges sur la base postgres
GRANT ALL PRIVILEGES ON DATABASE postgres TO magatte_niang;

-- Se connecter à la base postgres
\c postgres

-- Donner les privilèges sur le schéma public
GRANT ALL ON SCHEMA public TO magatte_niang;

-- Donner les privilèges sur toutes les tables existantes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magatte_niang;

-- Donner les privilèges sur toutes les séquences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO magatte_niang;

-- Donner les privilèges par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO magatte_niang;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO magatte_niang;
```

### 4.3 Exécuter
Cliquer sur le bouton **▶ Execute/Refresh** (F5) ou icône ⚡

Vous devriez voir : **"Query returned successfully"**

---

## Étape 5: Vérifier que tout fonctionne

### 5.1 Créer une nouvelle connexion de test
1. Dans pgAdmin, cliquer droit sur **"Servers"**
2. Sélectionner **"Register" → "Server..."**

### 5.2 Configurer la connexion

**Onglet "General" :**
- Name: `Magatte Niang User Test`

**Onglet "Connection" :**
- Host name/address: `localhost`
- Port: `5432`
- Maintenance database: `postgres`
- Username: `magatte_niang`
- Password: `senecarte`
- ✅ Cocher **"Save password?"**

**Cliquer sur "Save"**

### 5.3 Test de connexion
Si vous voyez le nouveau serveur "Magatte Niang User Test" dans l'arbre sans erreur :
✅ **La configuration est réussie !**

---

## Étape 6: Retour au projet - Créer les tables

Maintenant que PostgreSQL est configuré, retournez dans PowerShell :

```powershell
# Aller dans le dossier du projet
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"

# Générer le client Prisma
npx prisma generate

# Créer les tables dans PostgreSQL
npx prisma db push

# Vérifier dans pgAdmin
# Les tables devraient apparaître dans:
# Servers → PostgreSQL 17 → Databases → postgres → Schemas → public → Tables
```

---

## Étape 7: Remplir la base avec les données

```powershell
# Exécuter le seed
npx tsx prisma/seed.ts
```

Vous devriez voir :
```
🌱 Début du seeding PostgreSQL...
🧹 Nettoyage des tables...
📦 Création des entités...
✅ Entité créée: SERMA BTP
✅ Entité créée: P2M
✅ Entité créée: PGT
...
✨ Seeding PostgreSQL terminé avec succès!
```

---

## Étape 8: Vérifier les données dans pgAdmin

1. Dans pgAdmin, dérouler :
   - **Servers** → **PostgreSQL 17** → **Databases** → **postgres** → **Schemas** → **public** → **Tables**

2. Cliquer droit sur **"Entity"** → **"View/Edit Data"** → **"All Rows"**

Vous devriez voir les 3 entités (SERMA BTP, P2M, PGT) !

---

## Étape 9: Démarrer le serveur Next.js

```powershell
npm run dev
```

Ouvrir : **http://localhost:3000**

---

## 🎯 Récapitulatif des étapes

| Étape | Outil | Action |
|-------|-------|--------|
| 1 | pgAdmin | Ouvrir pgAdmin |
| 2 | pgAdmin | Se connecter avec mot de passe `senecarte` |
| 3 | pgAdmin | Créer l'utilisateur `magatte_niang` |
| 4 | pgAdmin | Exécuter les commandes SQL pour donner les privilèges |
| 5 | pgAdmin | Tester la connexion |
| 6 | PowerShell | `npx prisma db push` |
| 7 | PowerShell | `npx tsx prisma/seed.ts` |
| 8 | pgAdmin | Vérifier que les données sont là |
| 9 | PowerShell | `npm run dev` |

---

## 🐛 Dépannage

### L'utilisateur existe déjà
```sql
-- Dans Query Tool
DROP ROLE IF EXISTS magatte_niang;
-- Puis recréer avec les étapes ci-dessus
```

### Erreur de permissions
```sql
-- Exécuter dans Query Tool
ALTER USER magatte_niang WITH SUPERUSER;
```

### Voir tous les utilisateurs
```sql
-- Dans Query Tool
SELECT usename, usecreatedb, usesuper FROM pg_user;
```

Vous devriez voir :
```
usename         | usecreatedb | usesuper
----------------|-------------|----------
postgres        | t           | t
magatte_niang   | t           | f
```

---

## ✅ Vérification finale

### Dans pgAdmin, Query Tool, exécuter :
```sql
-- Vérifier que l'utilisateur existe
SELECT * FROM pg_user WHERE usename = 'magatte_niang';
```

### Dans PowerShell :
```powershell
# Vérifier la connexion Prisma
npx prisma db push
# Devrait afficher: "Your database is now in sync with your Prisma schema"
```

---

**Maintenant PostgreSQL est configuré ! Vous pouvez passer à l'étape suivante.** 🎉