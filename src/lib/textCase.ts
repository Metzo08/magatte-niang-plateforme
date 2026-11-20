/**
 * Normalise un texte visible tout en préservant systématiquement
 * tous les noms propres (personnes, entités, villes, pays, institutions, marques et sigles).
 */

const EMAIL_OR_URL_REGEX =
  /^(?:https?:\/\/|www\.|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/i;

export function toFirstUpperRestLower(
  input: string,
  capitalizeFirstLetter = true
): string {
  if (!input) return input;
  const trimmed = input.trim();
  if (!trimmed) return input;

  if (EMAIL_OR_URL_REGEX.test(trimmed)) {
    return input.toLocaleLowerCase('fr-FR');
  }

  let lowered = input.toLocaleLowerCase('fr-FR');

  if (capitalizeFirstLetter) {
    lowered = lowered.replace(/\p{L}/u, (ch) => ch.toLocaleUpperCase('fr-FR'));
  }

  // Conserve une majuscule au début d'une nouvelle phrase après ponctuation forte (. ! ?)
  lowered = lowered.replace(
    /(\p{L}{2,}[.!?]\s+)(\p{L})/gu,
    (_, prefix: string, letter: string) =>
      `${prefix}${letter.toLocaleUpperCase('fr-FR')}`
  );

  // Préserve les sigles, normes, noms propres de personnes, entités, lieux et partenaires
  const PRESERVED_PROPER_NOUNS: Array<[RegExp, string | ((...args: string[]) => string)]> = [
    // Sigles & normes techniques
    [/\b([abcd]\.?[1-4]|ec2|ec3|ec4|ec7)\b/gi, (m: string) => m.toUpperCase()],
    [/\bdomaine\s+([abcd])\b/gi, (_: string, letter: string) => `Domaine ${letter.toUpperCase()}`],
    [
      /\b(btp|bim|3d|4k|hd|igh|amo|moe|bpe|vrd|sav|rsa|nf|aci|astm|hlm|p2m|pgt|aps|apd|doe|exe|dwg|pdf|mp4|ifc|cbr|fcfa|cfo|cfa|cvc|ssi|ninea|rc|rccm|sn|dkr|lnr-btp|mitta|sarl|sbslabo|gtr|ev2|afnor|2e2|g1|g2|pv|vbs|btc|ept|esp|chem|oim|onu|ces|ldc|gco|secaa|css|aibd|zfi|pad|etm-ci|psa|suv|epi|tva|ht|ttc|erp|crm|DG|DT|DAF|BA)\b/gi,
      (m: string) => m.toUpperCase(),
    ],
    [/\b24\/s1\/ag6\b/gi, '24/S1/AG6'],
    [/\ben(?=\s+\d)/gi, 'EN'],
    [/\bz\/22\b/gi, 'Z/22'],
    [/\bs\/04\b/gi, 'S/04'],
    [/\bs04\b/gi, 'S04'],
    [/\br\+(\d+)\b/gi, (_: string, n: string) => `R+${n}`],

    // Entités de l'écosystème
    [/\bserma\s+btp\b/gi, 'SERMA BTP'],
    [/\bserma\b/gi, 'SERMA'],
    [/\bstein\s+bauer\s+s[eé]n[eé]gal\s+group\b/gi, 'Stein Bauer Sénégal Group'],
    [/\bstein\s+bauer\s+s[eé]n[eé]gal\b/gi, 'Stein Bauer Sénégal'],
    [/\bsb-s\s+labo\b/gi, 'SB-S Labo'],
    [/\bsbs[- ]labo\b/gi, 'SB-S Labo'],
    [/\bsb-s\s+group\b/gi, 'SB-S Group'],
    [/\bsbs[- ]group\b/gi, 'SB-S Group'],
    [/\bsb-s\s+logistik\b/gi, 'SB-S Logistik'],
    [/\bsbs[- ]logistik\b/gi, 'SB-S Logistik'],
    [/\bsb-s\s+industries\b/gi, 'SB-S Industries'],
    [/\bsbs[- ]industries\b/gi, 'SB-S Industries'],
    [/\bsb-s\s+industrie\b/gi, 'SB-S Industrie'],
    [/\bsbs[- ]industrie\b/gi, 'SB-S Industrie'],
    [/\bsb-s\b/gi, 'SB-S'],
    [/\bpolytech\s+mat[eé]riaux\s+mat[eé]riels\b/gi, 'Polytech Matériaux Matériels'],
    [/\bpolytech\s+general\s+trading\b/gi, 'Polytech General Trading'],
    [/\bpolytech\s+entreprise\b/gi, 'Polytech Entreprise'],

    // Noms propres des dirigeants, ingénieurs, responsables et chercheurs (Prénom NOM)
    [/\bmagatte\s+niang\b/gi, 'Magatte NIANG'],
    [/\bmaguette\s+niang\b/gi, 'Magatte NIANG'],
    [/\baminata\s+dram[eé]\b/gi, 'Aminata DRAMÉ'],
    [/\babdoulaye\s+niang\b/gi, 'Abdoulaye NIANG'],
    [/\brokhaya\s+kane\b/gi, 'Rokhaya KANE'],
    [/\bsalimata\s+sow\b/gi, 'Salimata SOW'],
    [/\boumou\s+diop\b/gi, 'Oumou DIOP'],
    [/\bfatima\s+ba\b/gi, 'Fatima BA'],
    [/\bfatoumata\s+bald[eé]\b/gi, 'Fatoumata BALDE'],
    [/\bndeye\s+sokhna\s+bakhoum\b/gi, 'Ndeye Sokhna BAKHOUM'],
    [/\bmouhamed\s+diallo\b/gi, 'Mouhamed DIALLO'],
    [/\bousse?ynou\s+fall\b/gi, 'Ousseynou FALL'],
    [/\bmamadou\s+lamine\s+diallo\b/gi, 'Mamadou Lamine DIALLO'],
    [/\badji?a\s+mar[eè]me\b/gi, 'Adjia MAREME'],
    [/\badjy\s+mar[eè]me\b/gi, 'Adjia MAREME'],
    [/\bpr\.\s*ch[eé]rif\s+balde\b/gi, 'Pr. Chérif BALDE'],
    [/\bch[eé]rif\s+balde\b/gi, 'Chérif BALDE'],
    [/\bstein\s+bauer\s+senegal\s+laboratoire\s+sarl\b/gi, 'STEIN BAUER SENEGAL LABORATOIRE SARL'],
    [/\bsbs\s+labo\s+sarl\b/gi, 'SBS LABO SARL'],
    [/\bmouhamed\s+diop\b/gi, 'Mouhamed DIOP'],
    [/\bcheikh\s+b[eè]ye\b/gi, 'Cheikh BÈYE'],
    [/\babdou\s+karim\s+fall\b/gi, 'Abdou Karim FALL'],
    [/\bibrahima\s+khalil\s+ciss[eé]\b/gi, 'Ibrahima Khalil CISSÉ'],
    [/\bgalaye\s+niang\b/gi, 'Galaye NIANG'],
    [/\bcheikh\s+tidiane\s+diop\b/gi, 'Cheikh Tidiane DIOP'],
    [/\bsokhna\b/gi, 'Sokhna'],
    [/\bsohna\b/gi, 'Sokhna'],
    [/\bdiallo\b/gi, 'DIALLO'],

    // Villes, régions, pays & lieux
    [/\bs[eé]n[eé]gal\b/gi, 'Sénégal'],
    [/\bdakar\b/gi, 'Dakar'],
    [/\bmbao\b/gi, 'Mbao'],
    [/\bvilleneuve\b/gi, 'Villeneuve'],
    [/\bville\s+neuve\b/gi, 'Ville Neuve'],
    [/\bkeur\s+massar\b/gi, 'Keur Massar'],
    [/\bpikine\b/gi, 'Pikine'],
    [/\bthi[eè]s\b/gi, 'Thiès'],
    [/\bdiamniadio\b/gi, 'Diamniadio'],
    [/\bsangalkam\b/gi, 'Sangalkam'],
    [/\bndiakhirate\b/gi, 'Ndiakhirate'],
    [/\bhann\s+mariste\b/gi, 'Hann Mariste'],
    [/\bsindia\b/gi, 'Sindia'],
    [/\bngalane\b/gi, 'Ngalane'],
    [/\bsendou\b/gi, 'Sendou'],
    [/\bmako\b/gi, 'Mako'],
    [/\bk[eé]dougou\b/gi, 'Kédougou'],
    [/\brichard[- ]toll\b/gi, 'Richard-Toll'],
    [/\bsandaga\b/gi, 'Sandaga'],
    [/\bbel\s+air\b/gi, 'Bel Air'],
    [/\bdiass\b/gi, 'Diass'],
    [/\bpout\b/gi, 'Pout'],
    [/\bgor[eé]e\b/gi, 'Gorée'],
    [/\babidjan\b/gi, 'Abidjan'],
    [/\bduba[iï]\b/gi, 'Dubaï'],
    [/\bajman\b/gi, 'Ajman'],
    [/\b[eé]mirats\s+arabes\s+unis\b/gi, 'Émirats Arabes Unis'],
    [/\binde\b/gi, 'Inde'],
    [/\bfrance\b/gi, 'France'],
    [/\bitalie\b/gi, 'Italie'],
    [/\bespagne\b/gi, 'Espagne'],
    [/\bturquie\b/gi, 'Turquie'],
    [/\bafrique\s+de\s+l['’]ouest\b/gi, "Afrique de l'Ouest"],
    [/\bafrique\b/gi, 'Afrique'],

    // Institutions, partenaires, marques & outils
    [/\bwhatsapp\b/gi, 'WhatsApp'],
    [/\bfacebook\b/gi, 'Facebook'],
    [/\bleadsen\b/gi, 'LeadSen'],
    [/\bsolene\b/gi, 'Solene'],
    [/\beiffage\b/gi, 'Eiffage'],
    [/\blouis\s+dreyfus\s+company\b/gi, 'Louis Dreyfus Company'],
    [/\bautoroute\s+de\s+l['’]avenir\b/gi, "Autoroute de l'Avenir"],
    [/\bgrande\s+c[oô]te\s+operations\b/gi, 'Grande Côte Operations'],
    [/\beramet\b/gi, 'Eramet'],
    [/\bpress\s+high[- ]tech\b/gi, 'Press High-Tech'],
    [/\bsococim\b/gi, 'SOCOCIM'],
    [/\bcaterpillar\b/gi, 'Caterpillar'],
    [/\bsamsung\b/gi, 'Samsung'],
    [/\brenault\b/gi, 'Renault'],
    [/\baquarius\b/gi, 'Aquarius'],
    [/\bteknomac\b/gi, 'TeknoMac'],
    [/\baichi\b/gi, 'Aichi'],
    [/\btoyota\b/gi, 'Toyota'],
    [/\bmitsubishi\b/gi, 'Mitsubishi'],
    [/\bsinotruk\b/gi, 'Sinotruk'],
    [/\bhowo\b/gi, 'HOWO'],
    [/\bmka\s+excellence\b/gi, 'MKA EXCELLENCE'],
    [/\bcrat[eé]rre\b/gi, 'CRATerre'],
    [/\beurocodes\b/gi, 'Eurocodes'],
    [/\beurocode\b/gi, 'Eurocode'],
  ];

  for (const [pattern, replacement] of PRESERVED_PROPER_NOUNS) {
    lowered =
      typeof replacement === 'string'
        ? lowered.replace(pattern, replacement)
        : lowered.replace(pattern, replacement);
  }

  return lowered;
}
