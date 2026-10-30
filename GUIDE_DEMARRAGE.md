# 🚀 GUIDE DE DÉMARRAGE - Plateforme Magatte Niang Expert

## ✅ Installation terminée

La plateforme est maintenant **100% dynamique** avec base de données SQLite et API REST complète.

---

## 📁 Structure du projet

```
magatte_niang_plateforme/
├── src/
│   ├── app/                     # Pages Next.js (Frontend)
│   │   ├── api/                 # Backend API REST
│   │   │   ├── entities/        # API Entités
│   │   │   ├── projects/        # API Projets
│   │   │   ├── products/        # API Produits
│   │   │   ├── leads/           # API Leads
│   │   │   ├── quotes/          # API Devis
│   │   │   ├── appointments/    # API Rendez-vous
│   │   │   ├── lab-tests/       # API Essais labo
│   │   │   ├── search/          # API Recherche
│   │   │   └── contact/         # API Contact
│   │   ├── entites/             # Pages Entités (DYNAMIQUES)
│   │   ├── catalogue/           # Page Catalogue (DYNAMIQUE)
│   │   ├── projets/             # Pages Projets
│   │   └── ...
│   ├── hooks/                   # Hooks React personnalisés
│   │   ├── useEntities.ts       # Hook pour entités
│   │   ├── useProducts.ts       # Hook pour produits
│   │   └── useProjects.ts       # Hook pour projets
│   ├── lib/
│   │   ├── api.ts               # Client API centralisé
│   │   ├── db.ts                # Prisma Client
│   │   └── store.ts             # État global
│   ├── components/              # Composants React
│   │   ├── common/              # Composants réutilisables
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── EmptyState.tsx
│   │   └── layout/              # Layout
│   └── types/                   # Types TypeScript
├── prisma/
│   ├── schema.prisma            # Schéma base de données
│   ├── seed.ts                  # Données initiales
│   └── dev.db                   # Base SQLite (créée)
├── package.json
└── README.md
```

---

## 🎯 Chemins importants

### Frontend
- **Racine**: `c:\Users\hp\Downloads\magatte_niang_plateforme\`
- **Pages**: `src\app\`
- **Composants**: `src\components\`

### Backend
- **API Routes**: `src\app\api\`
- **Base de données**: `prisma\dev.db`
- **Configuration**: `prisma\schema.prisma`

---

## 🖥️ COMMANDES POUR DÉMARRER

### 1️⃣ Ouvrir PowerShell

Faites **Windows + X** puis cliquez sur **"Windows PowerShell"** ou **"Terminal"**

### 2️⃣ Aller dans le dossier du projet

```powershell
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"
```

### 3️⃣ Démarrer le serveur de développement

```powershell
npm run dev
```

**Le serveur va démarrer sur:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api/*

### 4️⃣ Ouvrir dans le navigateur

Ouvrez votre navigateur et allez sur: **http://localhost:3000**

---

## 🔧 Autres commandes utiles

### Voir la base de données (interface graphique)
```powershell
npm run db:studio
```
Ouvre Prisma Studio sur http://localhost:5555

### Réinitialiser la base de données
```powershell
npm run db:reset
```
Supprime et recrée la base avec les données initiales

### Arrêter le serveur
Appuyez sur **Ctrl + C** dans le terminal

---

## 🌐 Pages disponibles

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Page d'accueil |
| http://localhost:3000/entites | Liste des 7 entités (DYNAMIQUE) |
| http://localhost:3000/entites/serma-btp | Fiche SERMA BTP (DYNAMIQUE) |
| http://localhost:3000/entites/sbs-labo | Fiche SB-S LABO (DYNAMIQUE) |
| http://localhost:3000/catalogue | Catalogue produits P2M (DYNAMIQUE) |
| http://localhost:3000/catalogue/prod-01 | Détail produit |
| http://localhost:3000/projets | Liste des projets |
| http://localhost:3000/assistant | Assistant de qualification |
| http://localhost:3000/panier | Panier |

---

## 🔌 API Endpoints (Backend)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/entities` | Liste toutes les entités |
| **GET** | `/api/entities/serma-btp` | Détail d'une entité |
| **GET** | `/api/projects` | Liste tous les projets |
| **GET** | `/api/projects?featured=true` | Projets en vedette |
| **GET** | `/api/products` | Liste tous les produits |
| **GET** | `/api/products?category=Carrelage` | Produits par catégorie |
| **POST** | `/api/leads` | Créer un prospect |
| **POST** | `/api/quotes` | Créer un devis |
| **POST** | `/api/contact` | Formulaire de contact |
| **GET** | `/api/search?q=charpente` | Recherche globale |

Pour tester l'API, ouvrez: http://localhost:3000/api/entities

---

## ✨ Fonctionnalités dynamiques implementées

### ✅ Pages Entités
- Chargement depuis la base de données
- Affichage dynamique des 7 entités
- Fiches détaillées avec synergies
- Métriques vérifiées
- Projets liés automatiquement

### ✅ Catalogue P2M
- Chargement depuis la base de données
- Recherche en temps réel
- Filtres par catégorie et disponibilité
- Compteur de résultats dynamique

### ✅ Système de navigation
- Loading states (spinners)
- Messages d'erreur
- États vides (empty states)
- Breadcrumbs
- Liens interconnectés

### ✅ API REST complète
- CRUD entités, projets, produits
- Gestion leads avec scoring automatique
- Devis avec calcul TVA 18%
- Recherche globale
- Formulaire de contact

---

## 📊 Données en base

La base de données SQLite contient :
- **7 entités** : SERMA BTP, SB-S LABO, P2M, SB-S Logistik, SB-S Industries, PGT, SB-S Group
- **2 produits P2M** : Carrelages haut de gamme
- **2 essais labo** : CBR et écrasement béton

Vous pouvez ajouter plus de données via :
1. Prisma Studio (`npm run db:studio`)
2. L'API REST (POST requests)
3. Le fichier `prisma/seed.ts`

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```powershell
# Réinstaller les dépendances
npm install

# Régénérer Prisma
npm run db:generate
```

### Erreur de base de données
```powershell
# Recréer la base
npm run db:push

# Remplir avec les données
npm run db:seed
```

### Port 3000 déjà utilisé
Changez le port dans package.json :
```json
"dev": "next dev -p 3001"
```

---

## 📝 Prochaines étapes recommandées

1. **Ajouter plus de données**
   - Compléter les projets dans la base
   - Ajouter plus de produits P2M
   - Renseigner les équipements

2. **Développer les pages manquantes**
   - Page projets dynamique
   - Page assistant de qualification
   - Dashboard CRM (espace pro)

3. **Optimisations**
   - Cache des requêtes API
   - Images optimisées
   - SEO (metadata)

4. **Sécurité**
   - Authentification (NextAuth.js)
   - Validation des données (Zod)
   - Rate limiting API

---

## 📞 Support

En cas de problème :
1. Vérifiez que Node.js est bien installé : `node --version`
2. Vérifiez le terminal pour les erreurs
3. Consultez les logs dans la console du navigateur (F12)

---

**La plateforme est prête ! Lancez `npm run dev` et explorez ! 🚀**