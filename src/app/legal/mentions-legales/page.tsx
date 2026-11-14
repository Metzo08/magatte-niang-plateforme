'use client';

import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      eyebrow="Institutionnel · registre CDP"
      title="Mentions légales & registre CDP"
      intro="Informations légales relatives à l'écosystème Magatte Niang Expert, regroupant sept entités complémentaires intervenant dans le génie civil, la charpente métallique, la géotechnique, la préfabrication béton, la logistique lourde, le sourcing international et les matériaux de finition."
      updatedAt="Janvier 2025"
      sections={[
        {
          heading: 'Éditeur du site',
          bullets: [
            'Dénomination : Écosystème Magatte Niang Expert',
            'Siège social : Km 14, Boulevard du Centenaire de la Commune de Dakar, Sénégal',
            'Standard : +221 33 832 40 10 · Urgence chantiers 24/7 : +221 77 267 16 17',
            'Courriel : contact@magatteniang-expert.sn',
            'Fondateur et Directeur de la publication : Magatte Niang, Ingénieur en Chef des Ponts & Chaussées',
          ],
        },
        {
          heading: 'Entités de l\'écosystème',
          paragraphs: [
            "Le site présente les sept filiales spécialisées suivantes, chacune disposant de sa propre direction opérationnelle :",
          ],
          bullets: [
            'SERMA BTP — Génie civil, charpente métallique et entreprise générale',
            'SB-S Group — Infrastructures, travaux publics et ouvrages d\'art',
            'SB-S Labo — Géotechnique, contrôle qualité et essais matériaux (laboratoire agréé)',
            'SB-S Industries — Préfabrication béton et production industrielle BTP',
            'SB-S Logistik — Parc d\'engins lourds, levage et transport spécialisé',
            'P2M — Carrelage de prestige, sanitaires, robinetterie et finitions',
            'PGT — Sourcing international, fret maritime, transit et approvisionnement',
          ],
        },
        {
          heading: 'Registre CDP',
          paragraphs: [
            "Conformément à la loi n° 2008-12 du 25 janvier 2008, les traitements de données à caractère personnel mis en œuvre par l'écosystème font l'objet d'un registre tenu à jour.",
            "Les déclarations et demandes d'autorisation sont adressées à la Commission de protection des Données Personnelles (CDP) du Sénégal. Toute personne peut consulter le registre des traitements sur demande motivée adressée au DPO.",
          ],
        },
        {
          heading: 'Propriété intellectuelle',
          paragraphs: [
            "L'ensemble des contenus du site (textes, données techniques, fiches produits, photographies de chantiers, code source, identité visuelle) est la propriété exclusive de l'écosystème Magatte Niang Expert, protégée par le droit d'auteur et le droit des marques.",
            "Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon.",
          ],
        },
        {
          heading: 'Responsabilité technique',
          paragraphs: [
            "Les données techniques, capacités de production et métriques opérationnelles publiées sur ce site sont issues des systèmes de suivi interne et font l'objet d'un contrôle qualité indépendant par SB-S Labo.",
            "Les informations de chiffrage indicatif ne constituent en aucun cas un engagement contractuel : seul un devis signé, établi après étude technique et visite de site, a valeur d'engagement.",
          ],
        },
        {
          heading: 'Hébergement',
          bullets: [
            'Le site est hébergé sur une infrastructure sécurisée avec chiffrement TLS en transit',
            'Sauvegardes régulières et journalisation des accès au back-office CRM',
          ],
        },
      ]}
    />
  );
}
