/**
 * Normalise un texte visible selon la règle :
 * première lettre en majuscule, tout le reste en minuscule.
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

  // Préserve les sigles, normes, codes agréments et acronymes techniques en majuscules
  const PRESERVED_UPPERCASE: Array<[RegExp, string | ((...args: string[]) => string)]> = [
    [/\b([abcd]\.?[1-4]|ec2|ec3|ec7)\b/gi, (m: string) => m.toUpperCase()],
    [/\bdomaine\s+([abcd])\b/gi, (_: string, letter: string) => `Domaine ${letter.toUpperCase()}`],
    [/\b(btp|bim|3d|igh|amo|moe|bpe|vrd|sav|rsa|nf|aci|astm|hlm|p2m|pgt|aps|apd|doe|exe|dwg|pdf|ifc|cbr|fcfa|cfo|cfa|cvc|ssi|ninea|rc|sn|dkr|lnr-btp|sbslabo|gtr|ev2|afnor|2e2|g1|g2|pv|vbs)\b/gi, (m) => m.toUpperCase()],
    [/\ben(?=\s+\d)/gi, 'EN'],
    [/\bz\/22\b/gi, 'Z/22'],
    [/\bserma\b/gi, 'SERMA'],
    [/\bsb-s\b/gi, 'SB-S'],
    [/\bsbs-labo\b/gi, 'SBS-Labo'],
    [/\bsbs-group\b/gi, 'SBS-Group'],
    [/\bsbs-logistik\b/gi, 'SBS-Logistik'],
    [/\bsbs-industries\b/gi, 'SBS-Industries'],
    [/\bmagatte\s+niang\b/gi, 'Magatte NIANG'],
  ];

  for (const [pattern, replacement] of PRESERVED_UPPERCASE) {
    lowered = typeof replacement === 'string'
      ? lowered.replace(pattern, replacement)
      : lowered.replace(pattern, replacement);
  }

  return lowered;
}
