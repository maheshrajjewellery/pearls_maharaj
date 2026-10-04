/**
 * Utility to resolve the public customer-facing website URL.
 *
 * Checks environment variables in order of priority:
 * 1. VITE_SITE_URL
 * 2. VITE_APP_URL
 * 3. NEXT_PUBLIC_SITE_URL
 * 4. NEXT_PUBLIC_APP_URL
 * 5. PUBLIC_SITE_URL
 *
 * Fallback: Current window origin in browser environment, or '/' if SSR.
 */
export function getPublicStoreUrl(path: string = ''): string {
  const envUrl =
    import.meta.env.VITE_SITE_URL ||
    import.meta.env.VITE_APP_URL ||
    import.meta.env.NEXT_PUBLIC_SITE_URL ||
    import.meta.env.NEXT_PUBLIC_APP_URL ||
    import.meta.env.PUBLIC_SITE_URL;

  let baseUrl = '';

  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    baseUrl = envUrl.trim().replace(/\/+$/, '');
  } else if (typeof window !== 'undefined' && window.location && window.location.origin) {
    baseUrl = window.location.origin;
  } else {
    baseUrl = '';
  }

  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (baseUrl) {
    return `${baseUrl}${cleanPath || '/'}`;
  }

  return cleanPath || '/';
}
