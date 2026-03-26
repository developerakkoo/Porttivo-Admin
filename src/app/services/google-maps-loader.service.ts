import { environment } from '../../environments/environment';

declare global {
  interface Window {
    google?: unknown;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  if (loadPromise) return loadPromise;
  const key = (environment as { googleMapsApiKey?: string }).googleMapsApiKey;
  if (!key) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }
  if (typeof window !== 'undefined' && window.google) {
    loadPromise = Promise.resolve();
    return loadPromise;
  }
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=en&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
  return loadPromise;
}
