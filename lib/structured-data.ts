// Builds schema.org JSON-LD from the live site content, so Google's rich
// results (and AI answer engines like ChatGPT / Perplexity / Google AI
// Overviews) read accurate hours, prices and answers. Everything is derived
// from the same CMS data that renders the page — no hardcoded duplication.

import type { SiteContentData, HoursDay } from './content'
import { SITE_URL, BUSINESS, absoluteUrl } from './site'

// German day name (as stored in the CMS) -> schema.org DayOfWeek.
const DAY_MAP: Record<string, string> = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday',
}

// "08:30 – 16:00" -> { opens: "08:30", closes: "16:00" }. Tolerates hyphen,
// en-dash or em-dash separators. Returns null for closed / unparseable rows.
function parseTimeRange(time: string): { opens: string; closes: string } | null {
  const parts = time.split(/\s*[–—-]\s*/).map((s) => s.trim())
  if (parts.length !== 2 || !/^\d{1,2}:\d{2}$/.test(parts[0])) return null
  return { opens: parts[0], closes: parts[1] }
}

// "25 €" -> 25 ; returns null when there's no number to extract.
function parseEuro(value: string): number | null {
  const match = value.replace(',', '.').match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

// Collapse the week into the fewest specs: open days sharing the same
// opens/closes are grouped into one entry with a dayOfWeek array.
function openingHoursSpecification(days: HoursDay[]) {
  const groups = new Map<string, { days: string[]; opens: string; closes: string }>()
  for (const day of days) {
    if (day.closed) continue
    const range = parseTimeRange(day.time)
    const schemaDay = DAY_MAP[day.name]
    if (!range || !schemaDay) continue
    const key = `${range.opens}-${range.closes}`
    const group = groups.get(key) ?? { days: [], opens: range.opens, closes: range.closes }
    group.days.push(schemaDay)
    groups.set(key, group)
  }
  return [...groups.values()].map((g) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: g.days,
    opens: g.opens,
    closes: g.closes,
  }))
}

export function localBusinessLd(content: SiteContentData) {
  const empSingle = parseEuro(content.emp_prices.single)
  return {
    '@context': 'https://schema.org',
    '@type': 'NailSalon',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: absoluteUrl(BUSINESS.ogImage),
    logo: absoluteUrl('/assets/logo-white.png'),
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      postalCode: BUSINESS.address.postalCode,
      addressLocality: BUSINESS.address.city,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    hasMap: BUSINESS.googleMaps,
    sameAs: [BUSINESS.instagram],
    areaServed: { '@type': 'City', name: 'Wien' },
    openingHoursSpecification: openingHoursSpecification(content.hours.days),
    makesOffer: [
      { name: 'Nageldesign' },
      { name: 'Maniküre' },
      { name: 'Smart Pediküre' },
    ]
      .map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.name } }))
      .concat([
        {
          '@type': 'Offer',
          ...(empSingle != null ? { price: empSingle, priceCurrency: 'EUR' } : {}),
          itemOffered: { '@type': 'Service', name: 'EMP Chair Bodywave — Einzelsitzung' },
        } as { '@type': string; itemOffered: { '@type': string; name: string } },
      ]),
  }
}

export type FaqItem = { q: string; a: string }

// FAQ content — grounded in the on-page copy. Prices/hours interpolate the
// live CMS values so the answers (and the FAQPage schema built from them)
// stay correct when Stephi edits content in /admin.
export function getFaqItems(content: SiteContentData): FaqItem[] {
  const open = content.hours.days.filter((d) => !d.closed)
  const closed = content.hours.days.filter((d) => d.closed)
  const firstRange = open[0] ? parseTimeRange(open[0].time) : null
  const hoursAnswer =
    open.length && firstRange
      ? `${open[0].name} bis ${open[open.length - 1].name} von ${firstRange.opens} bis ${firstRange.closes} Uhr geöffnet` +
        (closed.length ? `, ${closed.map((d) => d.name).join(' und ')} geschlossen` : '') +
        '. Termine nach Vereinbarung — bitte vorher Kontakt aufnehmen.'
      : 'Termine nach Vereinbarung — bitte vorher Kontakt aufnehmen.'

  return [
    {
      q: 'Wie vereinbare ich einen Termin?',
      a: 'Am einfachsten über das Kontaktformular auf dieser Seite, telefonisch unter 0677 62815410, per WhatsApp oder über Instagram. Meistens melde ich mich innerhalb von 24 Stunden.',
    },
    {
      q: 'Wo befindet sich das Studio und wie komme ich hin?',
      a: 'Das Studio ist in der Schloßhoferstraße 24/3, 1210 Wien — nur 4 Minuten zu Fuß von der U6 Floridsdorf, erreichbar mit der Straßenbahn 26 (Haltestelle Schloßhofer Straße), Parkplätze direkt vor der Tür.',
    },
    {
      q: 'Was sind die Öffnungszeiten?',
      a: hoursAnswer,
    },
    {
      q: 'Was kostet Nageldesign, Maniküre oder Smart Pediküre?',
      a: 'Diese Behandlungen stimme ich individuell ab — der Preis hängt von deinem Naturnagel und dem gewünschten Design ab. Sag mir kurz, was du dir vorstellst, und du bekommst ein faires Angebot.',
    },
    {
      q: 'Was kostet eine EMP Chair Bodywave Sitzung?',
      a: `Die Einzelsitzung gibt es aktuell zum Kennenlernpreis für ${content.emp_prices.single} (statt ${content.emp_prices.singleOld}). Zusätzlich gibt es 8er-, 10er- und 16er-Blöcke — die aktuellen Preise findest du im Preisbereich.`,
    },
    {
      q: 'Ist die Smart Pediküre auch bei Diabetes geeignet?',
      a: 'Ja. Die Smart Pediküre arbeitet mit einem speziellen Fräser und innovativen Aufsätzen — ganz ohne Skalpell oder Hobel — und ist auch für sensible Füße geeignet, etwa bei Diabetes oder blutverdünnenden Medikamenten. Hinweis: Nach der Behandlung kann für einige Tage erhöhte Rutschgefahr bestehen.',
    },
    {
      q: 'Für wen ist das EMP Chair Bodywave Training geeignet?',
      a: 'Für Frauen und Männer — bei Blasenschwäche, zur Rückbildung, zur Stärkung der Körpermitte und für einen stabileren Rücken. Du trainierst komplett bekleidet: einfach hinsetzen, walk-in-walk-out, kein Schwitzen, kein Umziehen.',
    },
  ]
}

export function faqLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
