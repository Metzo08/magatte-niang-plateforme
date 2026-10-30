# ⚡ INSTALLATION RAPIDE - 5 MINUTES

## 🎯 Prérequis
- PostgreSQL 17 installé
- Node.js 18+ installé
- PowerShell

---

## 📝 ÉTAPE 1: Configuration PostgreSQL (2 min)

### Ouvrir PowerShell et exécuter:

```powershell
# Se connecter à PostgreSQL
psql -U postgres
```

### Dans psql, taper:

```sql
CREATE USER magatte_niang WITH PASSWORD 'senecarte';
ALTER USER magatte_niang CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE postgres TO magatte_niang;
GRANT ALL ON SCHEMA public TO magatte_niang;
\q
```

### Tester:
```powershell
psql -U magatte_niang -d postgres -h localhost
# Mot de passe: senecarte
# Si ça fonctionne: \q
```

---

## 🚀 ÉTAPE 2: Installation du projet (3 min)

```powershell
# 1. Aller dans le dossier
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"

# 2. Installer les dépendances (déjà fait normalement)
npm install

# 3. Générer Prisma Client
npx prisma generate

# 4. Créer les tables PostgreSQL
npx prisma db push

# 5. Remplir avec les données
npx tsx prisma/seed.ts

# 6. Démarrer le serveur
npm run dev
```

---

## ✅ VÉRIFICATION

### Le terminal doit afficher:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.2s
```

### Ouvrir dans le navigateur:
**http://localhost:3000**

### Tester l'API:
**http://localhost:3000/api/entities**

Vous devriez voir du JSON avec les entités !

---

## 🎨 Pages à tester:

1. **Accueil**: http://localhost:3000
2. **Entités** (dynamique): http://localhost:3000/entites
3. **Détail SERMA BTP**: http://localhost:3000/entites/serma-btp
4. **Catalogue P2M**: http://localhost:3000/catalogue

---

## 🐛 En cas d'erreur:

### "Authentication failed"
```powershell
# Vérifier PostgreSQL
net start postgresql-x64-17

# Retester la connexion
psql -U magatte_niang -d postgres -h localhost
```

### "Port 3000 in use"
```powershell
# Utiliser un autre port
npm run dev -- -p 3001
```

### Voir les données
```powershell
# Ouvre une interface graphique
npx prisma studio
```
Va sur http://localhost:5555

---

## 📚 Documentation complète

Voir les fichiers:
- `README.md` - Documentation générale
- `GUIDE_DEMARRAGE.md` - Guide détaillé
- `CONFIGURATION_POSTGRESQL.md` - Config PostgreSQL
- `GUIDE_COMPLET.md` (artifact) - Guide complet

---

**C'est tout ! La plateforme tourne maintenant avec PostgreSQL ! 🎉**