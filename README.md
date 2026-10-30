# Plateforme Magatte Niang Expert

Plateforme web complète pour l'écosystème BTP intégré fondé par Magatte Niang.

## Architecture

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # Backend API Routes
│   │   │   ├── entities/       # CRUD Entités
│   │   │   ├── projects/       # CRUD Projets
│   │   │   ├── products/       # CRUD Produits P2M
│   │   │   ├── leads/          # Gestion des prospects
│   │   │   ├── quotes/         # Gestion des devis
│   │   │   ├── appointments/   # Prise de rendez-vous
│   │   │   ├── lab-tests/      # Essais laboratoire
│   │   │   ├── search/         # Recherche globale
│   │   │   └── contact/        # Formulaire contact
│   │   ├── assistant/          # Assistant qualification
│   │   ├── catalogue/          # Catalogue produits
│   │   ├── entites/            # Pages entités
│   │   ├── projets/            # Pages projets
│   │   ├── expertises/         # Pages expertises
│   │   └── panier/             # Panier
│   ├── components/             # Composants React
│   ├── lib/                    # Utilitaires & DB
│   ├── types/                  # Types TypeScript
│   └── data/                   # Données statiques
├── prisma/
│   ├── schema.prisma           # Schéma base de données
│   └── seed.ts                 # Données initiales
└── package.json
```

## Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Commandes d'installation

```powershell
# 1. Aller dans le dossier du projet
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"

# 2. Installer les dépendances
npm install

# 3. Générer le client Prisma
npm run db:generate

# 4. Créer la base de données SQLite
npm run db:push

# 5. Remplir avec les données initiales
npm run db:seed
```

## Démarrage des serveurs

### Mode développement (frontend + backend ensemble)

```powershell
# Démarrer le serveur de développement Next.js
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api/*

### Mode production

```powershell
# Build de production
npm run build

# Démarrer en production
npm start
```

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/entities` | Liste toutes les entités |
| GET | `/api/entities/[id]` | Détail d'une entité |
| POST | `/api/entities` | Créer une entité |
| PUT | `/api/entities/[id]` | Modifier une entité |
| DELETE | `/api/entities/[id]` | Supprimer une entité |
| GET | `/api/projects` | Liste les projets |
| GET | `/api/projects/[slug]` | Détail d'un projet |
| POST | `/api/projects` | Créer un projet |
| GET | `/api/products` | Liste les produits |
| GET | `/api/products/[id]` | Détail d'un produit |
| POST | `/api/leads` | Créer un lead/prospect |
| GET | `/api/leads` | Liste les leads |
| POST | `/api/quotes` | Créer un devis |
| GET | `/api/quotes` | Liste les devis |
| POST | `/api/appointments` | Prendre rendez-vous |
| GET | `/api/lab-tests` | Liste les essais labo |
| GET | `/api/search?q=...` | Recherche globale |
| POST | `/api/contact` | Formulaire de contact |

## Outils de développement

```powershell
# Visualiser la base de données (interface graphique)
npm run db:studio
```

Ouvre Prisma Studio sur **http://localhost:5555**

## Structure des données

### Entités
Les 7 sociétés du groupe : SERMA BTP, SB-S Group, SB-S LABO, SB-S Industries, SB-S Logistik, P2M, PGT

### Produits
Catalogue P2M : carrelages, sanitaires, robinetterie

### Projets
Réalisations et études de cas

### Leads
Prospects et opportunités commerciales avec scoring automatique

### Devis
Devis clients avec calcul TVA automatique (18% Sénégal)

## Technologies

- **Frontend**: Next.js 15, React 19, Tailwind CSS, TypeScript
- **Backend**: Next.js API Routes (serverless functions)
- **Base de données**: SQLite avec Prisma ORM
- **Icônes**: Lucide React

## Variables d'environnement

Créer un fichier `.env.local` :

```
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

Développé pour Magatte Niang Expert - Écosystème BTP Intégré Sénégal