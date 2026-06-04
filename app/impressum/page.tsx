import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'

export const metadata: Metadata = {
  title: 'Impressum · Stephi Nail it!',
  description: 'Impressum und Offenlegung gemäß §5 ECG und §25 MedienG.',
}

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum">
      <p className="muted">
        Offenlegung gemäß § 5 ECG und § 25 Mediengesetz.
      </p>

      <h2>Medieninhaberin &amp; für den Inhalt verantwortlich</h2>
      <p>
        Stephanie Zimmerhackl<br />
        Nagelstudio „Stephi nail it“<br />
        Schloßhoferstraße 24/3<br />
        1210 Wien, Österreich
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+4367762815410">0677 62815410</a>
        <br />
        E-Mail: <a href="mailto:stephi_nail_it@gmx.at">stephi_nail_it@gmx.at</a>
      </p>

      <h2>Unternehmensgegenstand</h2>
      <p>Nagelstudio · kosmetische (Smart-)Pediküre · kosmetische Dienstleistungen.</p>

      <h2>Gewerberechtliche Angaben</h2>
      <p>
        Berufsrecht: Gewerbeordnung (
        <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener">
          ris.bka.gv.at
        </a>
        )<br />
        Aufsichts-/Gewerbebehörde: Magistrat der Stadt Wien
      </p>

      <h2>Online-Streitbeilegung</h2>
      <p>
        Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit:{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">
          ec.europa.eu/consumers/odr
        </a>
        . Wir sind nicht verpflichtet und nicht bereit, an einem
        Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>

      <h2>Haftung für Inhalte &amp; Links</h2>
      <p>
        Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die
        Richtigkeit, Vollständigkeit und Aktualität kann jedoch keine Gewähr
        übernommen werden. Für Inhalte externer Links sind ausschließlich deren
        Betreiber verantwortlich.
      </p>
    </LegalPage>
  )
}
