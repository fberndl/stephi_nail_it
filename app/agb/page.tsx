import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'

export const metadata: Metadata = {
  title: 'AGB · Stephi Nail it!',
  description: 'Allgemeine Geschäftsbedingungen des Nagelstudios Stephi nail it, Wien Floridsdorf.',
}

export default function AGBPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p className="muted">Allgemeine Geschäftsbedingungen (AGB) für das Nagelstudio „Stephi nail it“.</p>

      <h2><span className="n">1.</span>Termine &amp; Stornierungen</h2>
      <p>Termine können persönlich, schriftlich (z.&nbsp;B. WhatsApp) oder telefonisch vereinbart werden.</p>
      <ul>
        <li>Eine Stornierung muss mindestens 24 Stunden vor dem Termin erfolgen.</li>
        <li>Bei Nichterscheinen oder zu kurzfristiger Absage (unter 24 Std.) behalte ich mir vor, eine Ausfallgebühr von 50&nbsp;% des gebuchten Preises zu berechnen, die innerhalb von 10 Tagen zu begleichen ist.</li>
        <li>Bei Verspätung von mehr als 10 Minuten kann der Termin verkürzt oder abgesagt werden (dies gilt als kurzfristige Stornierung).</li>
      </ul>

      <h2><span className="n">2.</span>Preise &amp; Zahlung</h2>
      <p>Es gelten die im Studio oder online veröffentlichten Preise.</p>
      <ul>
        <li>Alle Preise sind Endpreise.</li>
        <li>Die Bezahlung erfolgt direkt nach der erfolgten Leistung in bar.</li>
        <li>Gutscheine sind nicht in bar auszahlbar und 3 Jahre ab dem Ausstelldatum gültig.</li>
      </ul>

      <h2><span className="n">3.</span>Hygiene &amp; Gesundheit</h2>
      <p>Ich arbeite nach höchsten Hygienestandards.</p>
      <ul>
        <li>Kund:innen sind verpflichtet, das Studio über allergische Reaktionen, Haut- und Nagelkrankheiten oder Infektionen vorab zu informieren.</li>
        <li>Bei ansteckenden Erkrankungen behalte ich mir das Recht vor, eine Behandlung abzulehnen.</li>
      </ul>

      <h2><span className="n">4.</span>Haftung</h2>
      <p>Das Studio übernimmt keine Haftung für:</p>
      <ul>
        <li>Schäden, die durch unsachgemäße Nachbehandlung durch die Kund:innen entstehen.</li>
        <li>Allergische Reaktionen, sofern diese vor der Behandlung nicht kommuniziert wurden.</li>
        <li>Verlust oder Beschädigung persönlicher Gegenstände.</li>
      </ul>

      <h2><span className="n">5.</span>Gewährleistung</h2>
      <p>Sollte es nach der Behandlung zu Beanstandungen kommen, müssen diese unverzüglich, spätestens innerhalb von 3 Tagen, gemeldet werden.</p>
      <ul>
        <li>Nachbesserungen erfolgen nach Absprache und Kulanz.</li>
        <li>Eine vollständige Rückerstattung ist in der Regel ausgeschlossen.</li>
        <li>Ab drei fehlenden Nägeln wird ein Setpreis verrechnet.</li>
        <li>Bei Nagelterminen mit einem Abstand von länger als fünf Wochen wird ein Setpreis verrechnet.</li>
        <li>Keine Zufriedenheitsgarantie.</li>
        <li>Kunstnägel sind nicht als Werkzeug zu gebrauchen.</li>
      </ul>
    </LegalPage>
  )
}
