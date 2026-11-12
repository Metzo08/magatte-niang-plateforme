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

  return lowered;
}
