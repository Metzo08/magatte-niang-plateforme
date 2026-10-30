'use client';

import React from 'react';
import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout
      eyebrow="Protection des données · CDP Sénégal"
      title="Politique de confidentialité"
      intro="Magatte Niang Expert s'engage à protéger les données à caractère personnel collectées dans le cadre de ses activités d'ingénierie, de construction et de fourniture de matériaux BTP, conformément à la loi n° 2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel au Sénégal."
      updatedAt="Janvier 2025"
      sections={[
        {
          heading: 'Responsable du traitement',
          paragraphs: [
            "Le responsable du traitement des données est l'écosystème Magatte Niang Expert, dont le siège est situé Km 14, Boulevard du Centenaire de la Commune de Dakar, Sénégal.",
            "Un Délégué à la Protection des Données (DPO) est désigné et peut être contacté à l'adresse contact@magatteniang-expert.sn pour toute question relative à vos données personnelles.",
          ],
        },
        {
          heading: 'Données collectées',
          paragraphs: [
            "Nous ne collectons que les données strictement nécessaires à l'instruction de vos demandes techniques et commerciales :",
          ],
          bullets: [
            "Identité et coordonnées professionnelles (nom, société, fonction, téléphone, email)",
            "Données de projet (type d'ouvrage, localisation, stade d'avancement, budget indicatif)",
            "Documents techniques transmis volontairement (plans, CCTP, rapports géotechniques)",
            "Données de navigation agrégées et anonymisées à des fins de mesure d'audience",
          ],
        },
        {
          heading: 'Finalités du traitement',
          bullets: [
            "Qualification et chiffrage de vos demandes de projet",
            "Routage vers l'entité compétente et suivi commercial",
            "Émission de devis, procès-verbaux d'essais et documents de conformité",
            "Respect de nos obligations légales, comptables et douanières",
          ],
        },
        {
          heading: 'Base légale et durée de conservation',
          paragraphs: [
            "Le traitement repose sur votre consentement explicite et sur l'exécution d'un contrat ou de mesures précontractuelles.",
            "Les données de prospection sont conservées 3 ans à compter du dernier contact. Les données contractuelles et comptables sont conservées 10 ans conformément aux obligations légales sénégalaises.",
          ],
        },
        {
          heading: 'Vos droits',
          paragraphs: [
            "Conformément à la loi n° 2008-12, vous disposez des droits suivants, exerçables à tout moment :",
          ],
          bullets: [
            "Droit d'accès, de rectification et d'effacement de vos données",
            "Droit d'opposition et de limitation du traitement",
            "Droit à la portabilité de vos données",
            "Droit de retirer votre consentement à tout moment",
            "Droit d'introduire une réclamation auprès de la CDP (Commission de protection des Données Personnelles du Sénégal)",
          ],
        },
        {
          heading: 'Sécurité et destinataires',
          paragraphs: [
            "Les données sont hébergées de manière sécurisée et chiffrées en transit. L'accès est strictement limité aux collaborateurs habilités de l'écosystème, selon le principe du besoin d'en connaître.",
            "Aucune donnée n'est cédée, louée ou vendue à des tiers. Les sous-traitants techniques (hébergement, messagerie) sont contractuellement engagés au respect de la confidentialité.",
          ],
        },
      ]}
    />
  );
}
