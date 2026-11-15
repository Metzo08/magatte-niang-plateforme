/**
 * Résout l'URL d'un média statique (`/images/...` ou `/videos/...`).
 * Si `NEXT_PUBLIC_MEDIA_BASE_URL` est configuré (ex: MinIO, Garage, SeaweedFS ou Cloudflare R2),
 * redirige automatiquement vers le stockage objet externe.
 * Sinon, sert le fichier local depuis `public/`.
 */
export function getMediaUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/+$/, '');
  if (!baseUrl) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
