/**
 * Liens officiels des réseaux sociaux de l'écosystème Magatte Niang
 * (Magatte Niang Expert, P2M Showroom, SERMA BTP, SB-S Group).
 */

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: 'Linkedin' | 'Facebook' | 'Youtube' | 'Instagram' | 'MessageCircle' | 'Tiktok';
  color: string;
  handle: string;
  badge?: string;
  description: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    url: 'https://wa.me/221788321279?text=Bonjour,%20je%20souhaite%20des%20renseignements%20sur%20les%20services%20et%20mat%C3%A9riaux%20de%20l%27%C3%A9cosyst%C3%A8me%20Magatte%20Niang%20Expert.',
  icon: 'MessageCircle',
    color: '#25D366',
    handle: '+221 78 832 12 79',
    badge: 'Réponse rapide',
    description: 'Assistance directe, devis express et conseils matériaux en direct'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/magatte-niang-expert',
  icon: 'Linkedin',
    color: '#0A66C2',
    handle: 'Magatte Niang Expert BTP',
    badge: 'Réseau pro',
    description: 'Actualités chantiers, publications techniques et partenariats'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/magatteniangexpert',
  icon: 'Facebook',
    color: '#1877F2',
    handle: '@magatteniangexpert',
    badge: 'Communauté',
    description: 'Photos de réalisations, arrivages matériaux showroom et chantiers'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@magatteniangexpert',
  icon: 'Youtube',
    color: '#FF0000',
    handle: 'Magatte Niang BTP TV',
    badge: 'Vidéos',
    description: 'Reportages sur nos chantiers d\'ouvrages d\'art et usinage acier'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/p2m_senegal',
  icon: 'Instagram',
    color: '#E4405F',
    handle: '@p2m_senegal',
    badge: 'Finitions',
    description: 'Showroom carrelages, dalles de prestige et inspirations déco'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@magatteniangexpert',
  icon: 'Tiktok',
    color: '#FE2C55',
    handle: '@magatteniangexpert',
    badge: 'Vidéos',
    description: 'Courtes vidéos chantiers, astuces BTP et coulisses sécurailées'
  }
];
