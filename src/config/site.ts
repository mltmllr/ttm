/**
 * Zentrale Seitenkonfiguration.
 *
 * ga4MeasurementId: GA4-Measurement-ID (G-XXXXXXXXXX). Leer = weder Consent-Banner
 * noch Google Analytics. Gesetzt wird sie beim Build über PUBLIC_GA4_ID
 * (lokal in .env, im Deploy über die Repository-Variable PUBLIC_GA4_ID).
 * Die ID ist öffentlich und kein Secret.
 */
const rawId = (import.meta.env.PUBLIC_GA4_ID ?? '').trim();

if (rawId && !/^G-[A-Z0-9]+$/.test(rawId)) {
  throw new Error(`PUBLIC_GA4_ID "${rawId}" sieht nicht wie eine GA4-Measurement-ID aus (G-XXXXXXXXXX).`);
}

export const siteConfig = {
  name: 'The Technical Marketer',
  ga4MeasurementId: rawId,
} as const;
