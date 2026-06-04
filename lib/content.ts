// Editable site text: defaults + shape. Stored in the site_content table
// (one row per top-level key, value = JSON). Public page falls back to these.

export type HoursDay = { name: string; time: string; closed?: boolean }

export type SiteContentData = {
  about: { paragraph: string }
  hours: { days: HoursDay[] }
  emp_prices: {
    single: string
    singleOld: string
    block8: string
    block10: string
    block16: string
  }
  promo: { price: string; oldPrice: string }
}

export const CONTENT_DEFAULTS: SiteContentData = {
  about: {
    paragraph:
      'In meinem Studio in Wien-Floridsdorf steht dein Wohlbefinden im Mittelpunkt. Als zertifizierte Nagelspezialistin und geprüfte Smart-Pediküre-Anwenderin nehme ich mir Zeit für dich — für gesunde, schöne und langanhaltende Ergebnisse in ruhiger, angenehmer Atmosphäre.',
  },
  hours: {
    days: [
      { name: 'Montag', time: '08:30 – 16:00' },
      { name: 'Dienstag', time: '08:30 – 16:00' },
      { name: 'Mittwoch', time: '08:30 – 16:00' },
      { name: 'Donnerstag', time: '08:30 – 16:00' },
      { name: 'Freitag', time: '08:30 – 16:00' },
      { name: 'Samstag', time: 'geschlossen', closed: true },
      { name: 'Sonntag', time: 'geschlossen', closed: true },
    ],
  },
  emp_prices: {
    single: '25 €',
    singleOld: '45 €',
    block8: '280 €',
    block10: '350 €',
    block16: '480 €',
  },
  promo: { price: '25 €', oldPrice: '45 €' },
}

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS) as (keyof SiteContentData)[]

// Merge stored content over defaults so missing keys still render.
export function mergeContent(
  stored: Record<string, Record<string, unknown>>,
): SiteContentData {
  return {
    about: { ...CONTENT_DEFAULTS.about, ...(stored.about as object) },
    hours: (stored.hours as SiteContentData['hours']) ?? CONTENT_DEFAULTS.hours,
    emp_prices: { ...CONTENT_DEFAULTS.emp_prices, ...(stored.emp_prices as object) },
    promo: { ...CONTENT_DEFAULTS.promo, ...(stored.promo as object) },
  }
}
