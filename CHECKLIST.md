# ✅ CHECKLIST DE CONFIGURATION - Étape par étape

Cochez chaque étape au fur et à mesure.

---

## 📋 Phase 1 : Configuration PostgreSQL (pgAdmin)

### □ 1.1 Ouvrir pgAdmin
- [ ] Menu Windows → "pgAdmin" → Ouvrir
- [ ] Attendre que le navigateur s'ouvre

### □ 1.2 Se connecter au serveur
- [ ] Cliquer sur "PostgreSQL 17" dans la barre latérale
- [ ] Entrer le mot de passe : `senecarte`
- [ ] Cocher "Save Password"
- [ ] Cliquer OK

### □ 1.3 Ouvrir Query Tool
- [ ] Clic droit sur "PostgreSQL 17"
- [ ] Sélectionner "Query Tool"

### □ 1.4 Exécuter le script SQL
- [ ] Ouvrir le fichier `setup-postgres.sql`
- [ ] Copier TOUT le contenu
- [ ] Coller dans Query Tool
- [ ] Cliquer sur ▶ Execute (F5)
- [ ] Vérifier : "Query returned successfully" ✓

### □ 1.5 Vérifier l'utilisateur créé
- [ ] Dans Query Tool, exécuter :
  ```sql
  SELECT usename FROM pg_user WHERE usename = 'magatte_niang';
  ```
- [ ] Résultat attendu : `magatte_niang` ✓

---

## 📋 Phase 2 : Configuration du projet (PowerShell)

### □ 2.1 Ouvrir PowerShell
- [ ] Windows + X → "Windows PowerShell"

### □ 2.2 Aller dans le dossier
```powershell
cd "c:\Users\hp\Downloads\magatte_niang_plateforme"
```
- [ ] Exécuté ✓

### □ 2.3 Vérifier .env
```powershell
Get-Content .env
```
- [ ] Voir : `DATABASE_URL="postgresql://magatte_niang:senecarte@localhost:5432/postgres..."` ✓

### □ 2.4 Générer Prisma Client
```powershell
npx prisma generate
```
- [ ] Voir : "Generated Prisma Client" ✓

### □ 2.5 Créer les tables
```powershell
npx prisma db push
```
- [ ] Voir : "Your database is now in sync" ✓

### □ 2.6 Insérer les données
```powershell
npx tsx prisma/seed.ts
```
- [ ] Voir : "Seeding PostgreSQL terminé avec succès!" ✓

---

## 📋 Phase 3 : Vérification (pgAdmin)

### □ 3.1 Voir les tables créées
- [ ] Aller dans : Servers → PostgreSQL 17 → Databases → postgres → Schemas → public → Tables
- [ ] Compter 14 tables ✓

### □ 3.2 Voir les données insérées
- [ ] Clic droit sur "Entity" → "View/Edit Data" → "All Rows"
- [ ] Voir 3 lignes : serma-btp, p2m, pgt ✓

---

## 📋 Phase 4 : Démarrage du serveur (PowerShell)

### □ 4.1 Démarrer Next.js
```powershell
npm run dev
```
- [ ] Voir : "Ready in X.Xs" ✓
- [ ] Voir : "Local: http://localhost:3000" ✓

### □ 4.2 Garder PowerShell ouvert
- [ ] NE PAS FERMER le terminal !
- [ ] Le serveur tourne ✓

---

## 📋 Phase 5 : Tests (Navigateur)

### □ 5.1 Page d'accueil
- [ ] Ouvrir : http://localhost:3000
- [ ] La page s'affiche ✓

### □ 5.2 Page Entités (DYNAMIQUE)
- [ ] Ouvrir : http://localhost:3000/entites
- [ ] Voir 3 cartes d'entités ✓
- [ ] Voir : "Les 3 Piliers de l'Écosystème BTP" ✓

### □ 5.3 Détail SERMA BTP (DYNAMIQUE)
- [ ] Cliquer sur la carte "SERMA BTP"
- [ ] Ou ouvrir : http://localhost:3000/entites/serma-btp
- [ ] Voir toutes les infos de SERMA BTP ✓
- [ ] Voir les synergies avec autres entités ✓

### □ 5.4 Détail P2M (DYNAMIQUE)
- [ ] Ouvrir : http://localhost:3000/entites/p2m
- [ ] Voir les infos de P2M ✓

### □ 5.5 Catalogue P2M (DYNAMIQUE)
- [ ] Ouvrir : http://localhost:3000/catalogue
- [ ] Voir 2 produits ✓
- [ ] Voir le compteur : "2 produits trouvés" ✓
- [ ] Tester la barre de recherche ✓
- [ ] Tester les filtres (catégorie, disponibilité) ✓

### □ 5.6 API JSON (Backend)
- [ ] Ouvrir : http://localhost:3000/api/entities
- [ ] Voir du JSON avec les 3 entités ✓

---

## 📋 Phase 6 : Tests avancés

### □ 6.1 Navigation fluide
- [ ] Depuis /entites, cliquer sur "SERMA BTP"
- [ ] Cliquer sur "Retour aux entités"
- [ ] Navigation fonctionne ✓

### □ 6.2 Recherche catalogue
- [ ] Sur /catalogue, taper "grès" dans la recherche
- [ ] Voir 1 produit filtré ✓
- [ ] Effacer la recherche (X)
- [ ] Voir 2 produits à nouveau ✓

### □ 6.3 Filtres catalogue
- [ ] Sélectionner "Carrelage Sol Intérieur"
- [ ] Voir 1 produit ✓
- [ ] Réinitialiser les filtres
- [ ] Voir 2 produits ✓

---

## 🎉 RÉSULTAT FINAL

Si toutes les cases sont cochées :

**✅ FÉLICITATIONS ! Votre plateforme fonctionne parfaitement avec PostgreSQL !**

---

## 📊 Récapitulatif des URLs fonctionnelles

### Frontend
- ✅ http://localhost:3000 (Accueil)
- ✅ http://localhost:3000/entites (Liste dynamique)
- ✅ http://localhost:3000/entites/serma-btp (Détail dynamique)
- ✅ http://localhost:3000/entites/p2m (Détail dynamique)
- ✅ http://localhost:3000/entites/pgt (Détail dynamique)
- ✅ http://localhost:3000/catalogue (Catalogue dynamique)

### Backend API (JSON)
- ✅ http://localhost:3000/api/entities
- ✅ http://localhost:3000/api/entities/serma-btp
- ✅ http://localhost:3000/api/products
- ✅ http://localhost:3000/api/search?q=charpente

---

## 🔧 Commandes utiles

### Voir la base de données (GUI)
```powershell
npx prisma studio
```
Ouvre : http://localhost:5555

### Arrêter le serveur
Dans PowerShell : **Ctrl + C**

### Redémarrer le serveur
```powershell
npm run dev
```

### Réinitialiser la base
```powershell
npx prisma db push --force-reset
npx tsx prisma/seed.ts
```

---

## 📞 Besoin d'aide ?

Consulter les guides :
- `CONFIGURATION_PGADMIN.md` - Guide pgAdmin détaillé
- `INSTALLATION_RAPIDE.md` - Installation rapide
- `README.md` - Documentation générale
- Artifact ci-dessus - Guide visuel complet

---

**Date de configuration : _____________**

**Tout fonctionne ! ✓**