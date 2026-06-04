import { Fragment } from 'react'
import Gallery from './components/Gallery'
import SiteInteractions from './components/SiteInteractions'
import ContactForm from './components/ContactForm'
import JsonLd from './components/JsonLd'
import Faq from './components/Faq'
import { getGallery, getSiteContent } from '@/lib/gallery'
import { mergeContent } from '@/lib/content'
import { localBusinessLd, faqLd, getFaqItems } from '@/lib/structured-data'

const MARQUEE_ITEMS = [
  'Nageldesign',
  'Smart Pediküre',
  'EMP Chair Bodywave',
  'Maniküre',
  'Wohlbefinden',
  'Wien Floridsdorf',
]

function MarqueeCycle() {
  return (
    <span>
      {MARQUEE_ITEMS.map((it, i) => (
        <Fragment key={i}>
          {it}
          <span className="star">✦</span>
        </Fragment>
      ))}
    </span>
  )
}

export default async function Home() {
  const gallery = await getGallery()
  const content = mergeContent(await getSiteContent())
  const faqItems = getFaqItems(content)
  const year = new Date().getFullYear()

  return (
    <>
      {/* Structured data — derived from the live CMS content above. */}
      <JsonLd data={localBusinessLd(content)} />
      <JsonLd data={faqLd(faqItems)} />

      {/* ===== Header ===== */}
      <header className="header" id="site-header">
        <a href="#home" className="logo" data-scroll-top="">
          <img className="logo-svg" src="/assets/logo.svg" alt="Stephi Nail it!" />
        </a>
        <nav className="nav-links" id="nav-links">
          <a href="#ueber-mich" data-nav="ueber-mich">Über mich</a>
          <a href="#leistungen" data-nav="leistungen">Leistungen</a>
          <a href="#galerie" data-nav="galerie">Galerie</a>
          <a href="#preise" data-nav="preise">Preise</a>
          <a href="#standort" data-nav="standort">Standort</a>
          <a href="#kontakt" data-nav="kontakt">Kontakt</a>
          <a href="#kontakt" className="btn btn-soft mobile-cta" data-nav="kontakt" style={{ marginTop: 24 }}>
            Termin buchen <span className="arrow">→</span>
          </a>
        </nav>
        <a href="#kontakt" className="btn btn-soft" data-nav="kontakt">
          Termin buchen <span className="arrow">→</span>
        </a>
        <button className="menu-toggle" id="menu-toggle" aria-label="Menü">
          <span></span>
          <span></span>
        </button>
      </header>

      {/* ===== Hero ===== */}
      <section id="home" className="hero" data-screen-label="01 Hero">
        <div className="hero-text reveal in">
          <span className="eyebrow">Nagelstudio · Wien Floridsdorf</span>
          <h1 className="script">Stephi<br />Nail it!</h1>
          <div className="subtitle">Beauty inside and outside.</div>
          <div className="services-line">
            <span>Nageldesign</span>
            <span className="dot"></span>
            <span>Maniküre</span>
            <span className="dot"></span>
            <span>Smart Pediküre</span>
            <span className="dot"></span>
            <span>EMP Chair Bodywave</span>
          </div>
          <div className="hero-cta">
            <a href="#kontakt" className="btn btn-soft" data-nav="kontakt">
              Termin buchen <span className="arrow">→</span>
            </a>
            <a href="#leistungen" className="btn btn-ghost" data-nav="leistungen">
              Leistungen entdecken
            </a>
          </div>
        </div>
        <div className="hero-visual reveal in">
          <div
            className="hero-photo"
            style={{ backgroundImage: "url('/assets/nails/n22.jpeg')", backgroundSize: 'cover' }}
          ></div>
          <div className="hero-tag">
            <span className="pulse"></span>
            <span>Termine verfügbar</span>
          </div>
          <div className="hero-card">
            <div className="quote">„Zeit nur für dich.”</div>
            <div className="author">— Me Time Manifest</div>
          </div>
        </div>
        <div className="hero-scroll">scroll</div>
      </section>

      {/* ===== Marquee ===== */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track" id="marquee-track">
          <MarqueeCycle />
          <MarqueeCycle />
          <MarqueeCycle />
        </div>
      </div>

      {/* ===== About ===== */}
      <section id="ueber-mich" className="about" data-screen-label="02 About">
        <div className="container">
          <div className="about-grid">
            <div className="about-photo reveal" style={{ backgroundImage: "url('/assets/portrait.jpeg')" }}>
              <div className="badge">
                <span>seit</span>
                <span className="big">2025</span>
                <span>im Studio</span>
              </div>
            </div>
            <div className="about-content reveal">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--copper-deep)', fontSize: 14 }}>— 02</div>
                <div className="eyebrow" style={{ marginTop: 8 }}>Über mich</div>
              </div>
              <h2 className="serif" style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}>
                Hi, ich bin <em>Stephanie</em>.
              </h2>
              <p className="lead" style={{ marginTop: 28 }}>{content.about.paragraph}</p>
              <div className="signature">Stephi</div>
              <div className="signature-sub">Inhaberin · Stephi Nail it!</div>

              <div className="about-stats">
                <div className="stat"><div className="num" style={{ fontSize: 36, lineHeight: 1.1, fontStyle: 'italic' }}>jahrelange</div><div className="lbl">Erfahrung</div></div>
                <div className="stat"><div className="num">8</div><div className="lbl">Zertifizierungen</div></div>
                <div className="stat"><div className="num">∞</div><div className="lbl">Me-Time</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services ===== */}
      <section id="leistungen" data-screen-label="03 Services">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 03</div>
              <div className="label">Leistungen</div>
            </div>
            <div>
              <h2 className="serif">Drei Wege zu <em>deiner Auszeit</em>.</h2>
            </div>
          </div>
          <div className="services-list reveal" id="services-list">
            <div className="service-row open" data-service="s1">
              <div className="num">01</div>
              <div className="title">
                <h3 className="serif">Nageldesign</h3>
                <div className="tag">Deine Nägel. Deine Zeit. Dein Stil.</div>
              </div>
              <div className="desc">Individuell abgestimmt auf deine Naturnägel — natürlich, elegant oder kreativ.</div>
              <div className="visual" style={{ backgroundImage: "url('/assets/nails/n19.jpeg')" }}></div>
              <div className="service-detail">
                <div className="service-detail-inner">
                  <ul>
                    <li><strong>Individuell &amp; hochwertig</strong><span> Produkte speziell auf deine Naturnägel abgestimmt</span></li>
                    <li><strong>Vielfalt</strong><span> natürlich, elegant oder kreativ — große Auswahl an Farben, Formen, Designs</span></li>
                    <li><strong>Professionell</strong><span> zertifizierte Nagelspezialistin, gesunde und langanhaltende Ergebnisse</span></li>
                    <li>Wohlfühlatmosphäre: zurücklehnen und abschalten</li>
                  </ul>
                  <div>
                    <a href="#kontakt" className="btn btn-soft" data-nav="kontakt" style={{ marginTop: 16 }}>Termin anfragen <span className="arrow">→</span></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-row" data-service="s2">
              <div className="num">02</div>
              <div className="title">
                <h3 className="serif">Smart Pediküre</h3>
                <div className="tag">Sanfte Pflege. Moderne Technik. Zeit nur für dich.</div>
              </div>
              <div className="desc">Spezieller Fräser mit innovativen Aufsätzen — ohne Skalpell oder Hobel, auch für sensible Füße.</div>
              <div className="visual" style={{ backgroundImage: "url('/assets/smart-pedikuere.jpeg')", backgroundPosition: 'center' }}></div>
              <div className="service-detail">
                <div className="service-detail-inner">
                  <ul>
                    <li><strong>Sanft &amp; effektiv</strong><span> spezieller Fräser mit innovativen Aufsätzen — ganz ohne Skalpell oder Hobel</span></li>
                    <li><strong>Langanhaltende Pflege</strong><span> hochwertiges Öl wird tief in die Haut einpoliert</span></li>
                    <li>Auch für sensible Füße geeignet (z.&nbsp;B. bei Diabetes oder blutverdünnenden Medikamenten)</li>
                    <li><strong>Geprüft &amp; zertifiziert · große Auswahl an Shellack-Farben</strong></li>
                  </ul>
                  <div>
                    <div className="note">Hinweis: Nach der Behandlung kann es für mehrere Tage zu erhöhter Rutschgefahr kommen.</div>
                    <a href="#kontakt" className="btn btn-soft" data-nav="kontakt" style={{ marginTop: 16 }}>Termin anfragen <span className="arrow">→</span></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-row" data-service="s3">
              <div className="num">03</div>
              <div className="title">
                <h3 className="serif">EMP Chair Bodywave</h3>
                <div className="tag">Starke Mitte. Mehr Vitalität.</div>
              </div>
              <div className="desc">High-Tech-Training für Beckenboden &amp; Rücken. Schmerzfrei, diskret und hocheffektiv — für Frauen und Männer.</div>
              <div className="visual" style={{ backgroundImage: "url('/assets/emp-chair.jpeg')" }}></div>
              <div className="service-detail">
                <div className="service-detail-inner">
                  <ul>
                    <li><strong>Maximaler Effekt</strong><span> 30 Minuten ersetzen ca. 10.000 gezielte Kontraktionen der Tiefenmuskulatur</span></li>
                    <li><strong>Voller Komfort</strong><span> komplett bekleidet, einfach hinsetzen und trainieren lassen</span></li>
                    <li><strong>Mehr Lebensqualität</strong><span> bei Blasenschwäche, zur Rückbildung, zur Stärkung der Kernkraft</span></li>
                    <li><strong>Stärkerer Rücken</strong><span> stabilisiert die Wirbelsäule für bessere Haltung</span></li>
                    <li>Walk-in-walk-out — kein Schwitzen, kein Umziehen, direkt zurück in den Alltag</li>
                  </ul>
                  <div>
                    <a href="#kontakt" className="btn btn-soft" data-nav="kontakt" style={{ marginTop: 16 }}>Termin anfragen <span className="arrow">→</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Gallery ===== */}
      <section id="galerie" className="gallery" data-screen-label="04 Gallery">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 04</div>
              <div className="label">Galerie</div>
            </div>
            <div>
              <h2 className="serif">Arbeiten, die <em>für sich sprechen</em>.</h2>
              <p className="lead" style={{ marginTop: 16 }}>Ein Blick in mein Studio: ehrliche Fotos echter Kundinnen — keine Stock-Bilder, keine Filter.</p>
            </div>
          </div>

          <Gallery sections={gallery} />
        </div>
      </section>

      {/* ===== Prices ===== */}
      <section id="preise" className="prices" data-screen-label="05 Prices">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 05</div>
              <div className="label">Preise</div>
            </div>
            <div>
              <h2 className="serif">Klare Preise, <em>ehrliche Beratung</em>.</h2>
              <p className="lead" style={{ marginTop: 16 }}>Maniküre &amp; Pediküre besprechen wir individuell — abhängig von Naturnagel und Wunschdesign.</p>
            </div>
          </div>

          <div className="prices-grid">
            <div className="price-card featured reveal">
              <div className="cat-eyebrow" style={{ fontSize: 18 }}>EMP Chair Bodywave</div>
              <h3 className="serif" style={{ fontSize: 22 }}>Pakete &amp; Einzelsitzungen</h3>
              <ul className="price-list">
                <li><span className="pkg">Einzelsitzung<span className="sub">30 Minuten Training</span><span className="action-tag">★ KENNENLERNPREIS — SIEHE UNTEN</span></span><span className="price">{content.emp_prices.singleOld}</span></li>
                <li><span className="pkg">8er Block</span><span className="price">{content.emp_prices.block8}</span></li>
                <li><span className="pkg">10er Block</span><span className="price">{content.emp_prices.block10}</span></li>
                <li><span className="pkg">16er Block<span className="sub">30 € pro Sitzung — bestes Angebot</span></span><span className="price">{content.emp_prices.block16}</span></li>
              </ul>
              <div className="footnote">Walk-in-walk-out · keine Umkleide nötig</div>
            </div>

            <div className="price-card reveal">
              <div className="cat-eyebrow" style={{ fontSize: 22 }}>Nageldesign · Pediküre</div>
              <h3 className="serif" style={{ fontSize: 22 }}>Maniküre &amp; Smart Pediküre</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginTop: -12 }}>
                Jede Behandlung ist individuell. Sag mir kurz, was du dir vorstellst — ich erstelle dir gerne ein faires Angebot.
              </p>
              <div className="price-placeholder">
                „Preise auf Anfrage — abgestimmt auf deine Naturnägel und das gewünschte Design.”
              </div>
              <a href="#kontakt" className="btn btn-ghost" data-nav="kontakt" style={{ marginTop: 24 }}>Angebot anfragen <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Action banner ===== */}
      <div className="action-banner reveal" data-screen-label="06 Promo">
        <div className="ab-content">
          <div className="ab-eyebrow">Kennenlernpreis · Aktion</div>
          <div className="ab-title serif">EMP Chair Bodywave — jetzt zum Kennenlernpreis.</div>
          <div className="ab-deadline">solange Plätze verfügbar</div>
        </div>
        <div className="ab-price serif">
          {content.promo.price} <span className="strike">{content.promo.oldPrice}</span>
        </div>
        <a href="#kontakt" className="btn btn-primary" data-nav="kontakt">Sitzung sichern <span className="arrow">→</span></a>
      </div>

      {/* ===== Instagram ===== */}
      <section data-screen-label="07 Instagram">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 07</div>
              <div className="label">Instagram</div>
            </div>
            <div>
              <h2 className="serif">Folge mir auf <em>Instagram</em>.</h2>
              <p className="lead" style={{ marginTop: 16 }}>Frische Designs, Aktionen, Behind-the-Scenes — direkt aus dem Studio.</p>
            </div>
          </div>
        </div>
        <div className="instagram-feed reveal">
          {['n03', 'n07', 'n11', 'n15', 'n22', 'n26'].map((n) => (
            <a
              key={n}
              className="ig-post"
              href="https://instagram.com/stephi_nail_it"
              target="_blank"
              rel="noopener"
              style={{ backgroundImage: `url('/assets/nails/${n}.jpeg')` }}
            >
              <div className="ig-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
                </svg>
              </div>
            </a>
          ))}
        </div>
        <div className="instagram-cta reveal">
          <div className="handle">@Stephi_nail_it</div>
          <a href="https://instagram.com/stephi_nail_it" target="_blank" rel="noopener" className="btn btn-ghost" style={{ marginTop: 20 }}>Auf Instagram öffnen <span className="arrow">↗</span></a>
        </div>
      </section>

      {/* ===== Location ===== */}
      <section id="standort" className="location" data-screen-label="08 Location">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 08</div>
              <div className="label">Standort &amp; Zeiten</div>
            </div>
            <div>
              <h2 className="serif">Mitten in <em>Floridsdorf</em>.</h2>
              <p className="lead" style={{ marginTop: 16 }}>Drei Minuten von der U6 Floridsdorf, ruhige Lage, gute Parkmöglichkeiten direkt vor der Tür.</p>
            </div>
          </div>

          <div className="location-grid">
            <div className="location-info reveal">
              <div className="row">
                <div className="lbl">Adresse</div>
                <div className="val">Schloßhoferstraße 24/3<br />1210 Wien</div>
              </div>
              <div className="row">
                <div className="lbl">Anfahrt</div>
                <div className="val" style={{ fontSize: 16, fontFamily: "'Jost', sans-serif", color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  U6 Floridsdorf · 4 Minuten zu Fuß<br />
                  Straßenbahn 26 · Haltestelle Schloßhofer Straße<br />
                  Parkplätze direkt vor der Tür
                </div>
              </div>
              <div className="row">
                <div className="lbl">Öffnungszeiten</div>
                <div className="location-hours" style={{ marginTop: 12 }}>
                  {content.hours.days.map((d, i) => (
                    <div className={`day${d.closed ? ' closed' : ''}`} key={i}>
                      <span className="name">{d.name}</span>
                      <span className="time">{d.time}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 16, fontStyle: 'italic' }}>
                  Termine nach Vereinbarung — bitte vorher Kontakt aufnehmen.
                </div>
              </div>
            </div>
            <div className="map-frame reveal">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2657.0!2d16.402229!3d48.2563995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d075b9a82f98d%3A0x21d0978bab0c3833!2sStephi%20nail%20it!5e0!3m2!1sde!2sat!4v1700000000000"
                title="Google Maps · Stephi Nail it!, Schloßhoferstraße 24/3, 1210 Wien"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="map-actions">
                <a href="https://www.google.com/maps/dir/?api=1&destination=Schlo%C3%9Fhoferstra%C3%9Fe+24%2C+1210+Wien" target="_blank" rel="noopener" className="map-btn primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l18-8-8 18-2-8-8-2z" /></svg>
                  Route planen
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=Stephi+nail+it%2C+Schlo%C3%9Fhoferstra%C3%9Fe+24%2C+1210+Wien" target="_blank" rel="noopener" className="map-btn">Auf Google Maps öffnen</a>
                <a href="https://search.google.com/local/writereview?placeid=ChIJjfmCmltwbUcRMzgMq4uX0CE" target="_blank" rel="noopener" className="map-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  Bewertung schreiben
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact ===== */}
      <section id="kontakt" data-screen-label="09 Contact">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-side reveal">
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: 'var(--copper-deep)', fontSize: 14 }}>— 09</div>
                <div className="eyebrow" style={{ marginTop: 8 }}>Kontakt</div>
              </div>
              <h2 className="serif">Lass uns einen <em>Termin</em> finden.</h2>
              <p className="lead" style={{ marginTop: 16, marginBottom: 32 }}>Schreib mir kurz oder ruf an — meistens antworte ich innerhalb von 24 Stunden.</p>

              <a href="tel:+4367762815410" className="channel">
                <div className="ch-icon">☎</div>
                <div>
                  <div className="ch-lbl">Telefon</div>
                  <div className="ch-val">0677 62815410</div>
                </div>
              </a>
              <a href="mailto:stephi_nail_it@gmx.at" className="channel">
                <div className="ch-icon">✉</div>
                <div>
                  <div className="ch-lbl">E-Mail</div>
                  <div className="ch-val">stephi_nail_it@gmx.at</div>
                </div>
              </a>
              <a href="https://wa.me/4367762815410" target="_blank" rel="noopener" className="channel">
                <div className="ch-icon">●</div>
                <div>
                  <div className="ch-lbl">WhatsApp</div>
                  <div className="ch-val">Direkt schreiben</div>
                </div>
              </a>
              <a href="https://instagram.com/stephi_nail_it" target="_blank" rel="noopener" className="channel">
                <div className="ch-icon">@</div>
                <div>
                  <div className="ch-lbl">Instagram</div>
                  <div className="ch-val">@Stephi_nail_it</div>
                </div>
              </a>
            </div>

            <div className="reveal">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" data-screen-label="10 FAQ">
        <div className="container">
          <div className="section-head reveal">
            <div className="left">
              <div className="num">— 10</div>
              <div className="label">FAQ</div>
            </div>
            <div>
              <h2 className="serif">Häufige <em>Fragen</em>.</h2>
              <p className="lead" style={{ marginTop: 16 }}>
                Kurz erklärt: Termine, Anfahrt, Preise und Behandlungen.
              </p>
            </div>
          </div>
          <Faq items={faqItems} />
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="logo">
              <img className="logo-img" src="/assets/logo-white.png" alt="Stephi Nail it!" />
            </div>
            <p className="footer-tagline">Nageldesign · Smart Pediküre · EMP Chair Bodywave — Beauty inside and outside, mitten in Wien-Floridsdorf.</p>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <ul>
              <li><a href="#ueber-mich">Über mich</a></li>
              <li><a href="#leistungen">Leistungen</a></li>
              <li><a href="#galerie">Galerie</a></li>
              <li><a href="#preise">Preise</a></li>
              <li><a href="#faq">Fragen</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Kontakt</h4>
            <ul>
              <li><a href="tel:+4367762815410">0677 62815410</a></li>
              <li><a href="mailto:stephi_nail_it@gmx.at">stephi_nail_it@gmx.at</a></li>
              <li>Schloßhoferstraße 24/3<br />1210 Wien</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Folgen</h4>
            <ul>
              <li><a href="https://instagram.com/stephi_nail_it" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://wa.me/4367762815410" target="_blank" rel="noopener">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {year} Stephi Nail it! · Alle Rechte vorbehalten</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="/impressum" style={{ opacity: 0.85 }}>Impressum</a>
            <a href="/agb" style={{ opacity: 0.85 }}>AGB</a>
            <a href="/datenschutz" style={{ opacity: 0.85 }}>Datenschutz</a>
          </div>
        </div>
      </footer>

      {/* ===== WhatsApp FAB ===== */}
      <a href="https://wa.me/4367762815410" target="_blank" rel="noopener" className="fab" aria-label="WhatsApp Kontakt">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.4-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1.1-1.1 2.6 0 1.5 1.1 3 1.3 3.2.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4 0-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
        </svg>
      </a>

      {/* ===== Cookie banner ===== */}
      <div className="cookie-banner" id="cookie-banner">
        <div>Diese Website nutzt minimale Cookies für Karten- und Instagram-Einbettungen, um dir den besten Service zu bieten.</div>
        <div className="ck-actions">
          <button className="btn btn-soft" data-cookie-accept="">Akzeptieren</button>
          <button className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} data-cookie-accept="">Nur Notwendige</button>
        </div>
      </div>

      <SiteInteractions />
    </>
  )
}
