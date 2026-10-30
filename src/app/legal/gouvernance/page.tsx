'use client';

import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function GouvernancePage() {
  return (
    <LegalPageLayout
      eyebrow="Transparence · métriques certifiées"
      title="Gouvernance des chiffres"
      intro="Engagement de transparence sur la production, la vérification et la publication des indicateurs opérationnels présentés sur cette plateforme. Chaque métrique affichée est traçable jusqu'à sa source de mesure."
      updatedAt="Janvier 2025"
      sections={[
        {
          heading: 'Principes de gouvernance des données',
          paragraphs: [
            "Toute métrique publiée sur la plateforme respecte quatre principes non négociables : traçabilité de la source, mesurabilité, vérification indépendante et révision périodique.",
          ],
          bullets: [
            'Traçabilité — chaque chiffre est rattaché à un instrument ou un registre identifié',
            'Mesurabilité — aucune estimation non documentée n\'est présentée comme un fait',
            'Vérification — les indicateurs critiques sont contrôlés par une entité indépendante',
            'Révision — les valeurs sont actualisées selon un cycle défini et daté',
          ],
        },
        {
          heading: 'Sources de mesure par entité',
          bullets: [
            'Tonnage d\'acier usiné (SERMA BTP) — registres de pesée atelier et bons de livraison fournisseurs',
            'Capacité de production béton (SB-S Industries) — relevés quotidiens de la centrale à béton',
            'Linéaire de voiries livrées (SB-S Group) — métrés contradictoires et PV de réception',
            'Essais géotechniques (SB-S Labo) — base de données du laboratoire agréé, éprouvettes datées',
            'Taux de disponibilité flotte (SB-S Logistik) — système de gestion de parc et rapports de maintenance',
          ],
        },
        {
          heading: 'Cycle de vérification',
          paragraphs: [
            "Les indicateurs sont collectés mensuellement par les directions opérationnelles, consolidés par la Direction Technique, puis contrôlés par SB-S Labo pour les données à caractère physique (résistances, portances, compacités).",
            "Les chiffres consolidés sont publiés avec leur période de référence et leur état de confirmation. Un indicateur en cours de validation est explicitement signalé comme tel.",
          ],
        },
        {
          heading: 'Certifications et référentiels',
          bullets: [
            'ISO 9001 — Système de management de la qualité',
            'NF EN 1090 — Exécution des structures en acier',
            'NF EN 206 — Spécification, performance, production et conformité des bétons',
            'Eurocodes 3 & NF P — Calcul et dimensionnement des structures',
            'Commissionnaire en douane agréé — Opérations de transit et dédouanement',
          ],
        },
        {
          heading: 'Correction et droit de réponse',
          paragraphs: [
            "Si une métrique publiée s'avère inexacte, elle est corrigée dans les meilleurs délais et l'historique de correction est conservé en interne.",
            "Toute partie prenante peut demander la source d'un indicateur publié en adressant une requête au DPO via contact@magatteniang-expert.sn. Une réponse documentée est fournie sous 72h ouvrées.",
          ],
        },
        {
          heading: 'Indépendance de l\'audit qualité',
          paragraphs: [
            "SB-S Labo, en charge du contrôle qualité de l'écosystème, dispose d'une ligne hiérarchique technique indépendante des entités de production qu'elle contrôle. Cette séparation garantit l'objectivité des procès-verbaux et des résultats d'essais délivrés.",
          ],
        },
      ]}
    />
  );
}
