export type NavAppId = 'google' | 'apple' | 'waze';

export const NAV_STORAGE_KEY = 'fueledge.navApp';

export const DEFAULT_NAV_APP: NavAppId = 'waze';

export interface NavApp {
  id: NavAppId;
  label: string;
  icon: string;
  buildUrl: (dest: string) => string;
}

export const NAV_APPS: NavApp[] = [
  { id: 'google', label: 'Google Maps', icon: 'ri-google-line', buildUrl: (dest) => `https://www.google.com/maps/dir/?api=1&destination=${dest}` },
  { id: 'apple', label: 'Apple Maps', icon: 'ri-apple-line', buildUrl: (dest) => `https://maps.apple.com/?daddr=${dest}` },
  { id: 'waze', label: 'Waze', icon: 'ri-navigation-line', buildUrl: (dest) => `https://waze.com/ul?q=${dest}` },
];

/** Returns the saved navigation app, falling back to Waze when none is set yet. */
export function getNavApp(): NavAppId {
  try {
    const saved = localStorage.getItem(NAV_STORAGE_KEY);
    if (saved === 'google' || saved === 'apple' || saved === 'waze') {
      return saved as NavAppId;
    }
  } catch {
    // ignore storage failures
  }
  return DEFAULT_NAV_APP;
}

export function setNavApp(id: NavAppId): void {
  try {
    localStorage.setItem(NAV_STORAGE_KEY, id);
  } catch {
    // ignore storage failures
  }
}

export function openNavigation(id: NavAppId, destination: string): void {
  const app = NAV_APPS.find((item) => item.id === id);
  if (app) window.open(app.buildUrl(destination), '_blank', 'noopener,noreferrer');
}