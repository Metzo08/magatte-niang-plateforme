# Convention de casse des textes

## Règle

Tout texte affiché à l'utilisateur (titres, menus, libellés, badges, breadcrumbs,
titres de pages, contenu de données) respecte la casse **« première lettre
majuscule, le reste en minuscule »** (sentence case), et non le Title Case.

Exemples :

| ❌ À éviter | ✅ Correct |
| --- | --- |
| `Projets & Réalisations` | `Projets & réalisations` |
| `Espace Professionnel` | `Espace professionnel` |
| `Hangar Logistique Grande Portée` | `Hangar logistique grande portée` |
| `Démarrage Immédiat Chantier` | `Démarrage immédiat chantier` |
| `Carrelage Grès Cérame 60x60` | `Carrelage grès cérame 60x60` |

## Exceptions (majuscules conservées)

1. **Sigles et acronymes** : `P2M`, `BTP`, `CRM`, `PDF`, `IA`, `CDP`, `CBR`, `ISO`,
   `NF`, `FCFA`, `HSE`, `VRD`, `DAO`…
2. **Noms propres, lieux, marques et raisons sociales** : `Sénégal`, `Dakar`,
   `Thiès`, `Diamniadio`, `Magatte Niang Expert`, `SB-S Group`, `SB-S Labo`,
   `SERMA BTP`, `P2M`, `PGT`, `WhatsApp`, `Google Maps`, `Eurocodes`,
   `Polytech Matériaux Matériels`, `Bathroom Accessories`, `Calacatta Gold`,
   `Atlas Copco`…
3. **Codes et références techniques** : `P2M-WC-TURQ`, `ENG-GRUE-50T`, `R10`,
   `3D`, `60x60`, `S355`, `C2TE`…
4. **Noms officiels d'institutions** : `Ministère des Infrastructures, des
   Transports Terrestres et du Désenclavement`…

## Source unique de vérité

Le contenu affiché provient de `src/data/initialData.ts` (et `siteImages.ts`).
La base de données est alimentée depuis ces mêmes données par
`prisma/seed.ts` (qui **importe** `ENTITIES`, `PROJECTS`, `PUBLICATIONS`,
`PRODUCTS_P2M` au lieu de les dupliquer) — ce qui garantit qu'aucune
désynchronisation de casse ne peut réapparaître entre la base et les données
statiques.

## Vérifier

Un audit automatique parcourt tout le texte visible et signale les fragments
suspects (Title Case ou TOUT EN MAJUSCULES) hors noms propres connus :

```sh
node scripts/audit-casse-final.cjs
```

Pour un fichier précis :

```sh
node scripts/audit-file-titlecase.cjs <fichier>
```

> Note : sur cette machine, Node n'est pas dans le `PATH`. Utiliser
> `& "$env:ProgramFiles\nodejs\node.exe" scripts/<script>.cjs`.

## Bonnes pratiques à l'ajout de contenu

- Écrire les libellés en sentence case dès la rédaction.
- Ne jamais utiliser la classe Tailwind `uppercase` ni `.toUpperCase()` sur du
  texte destiné à l'affichage (un script `scripts/remove-uppercase.mjs` existe
  pour les retirer).
- Réserver les majuscules aux sigles, noms propres et codes listés ci-dessus.
