import type { Metadata } from 'next'
import LegalPage from '../components/LegalPage'

export const metadata: Metadata = {
  title: 'Datenschutz · Stephi Nail it!',
  description: 'Datenschutzerklärung gemäß DSGVO.',
}

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>Verantwortliche Stelle</h2>
      <p>
        Stephanie Zimmerhackl, „Stephi nail it“, Schloßhoferstraße 24/3, 1210 Wien.
        Kontakt: <a href="mailto:stephi_nail_it@gmx.at">stephi_nail_it@gmx.at</a>,
        Tel. 0677 62815410.
      </p>

      <h2>Welche Daten wir verarbeiten</h2>
      <ul>
        <li>
          <strong>Terminanfragen:</strong> Wenn du das Kontaktformular nutzt oder
          uns per Telefon, E-Mail, WhatsApp oder Instagram schreibst,
          verarbeiten wir die übermittelten Daten (z.&nbsp;B. Name, Telefon,
          E-Mail, Nachricht) ausschließlich zur Bearbeitung deiner Anfrage.
        </li>
        <li>
          <strong>Server-Logfiles:</strong> Beim Aufruf der Website werden
          technisch notwendige Daten (z.&nbsp;B. IP-Adresse, Zeitpunkt, Browser)
          durch unseren Hosting-Anbieter verarbeitet.
        </li>
      </ul>

      <h2>Hosting &amp; Dienste</h2>
      <ul>
        <li>
          <strong>Vercel</strong> (Hosting der Website) — Vercel Inc., USA.
        </li>
        <li>
          <strong>Supabase</strong> (Datenbank &amp; Bildspeicher, Region
          EU/Frankfurt) zur Bereitstellung der Galerie und Inhalte.
        </li>
        <li>
          <strong>Google Maps</strong> (eingebettete Karte) — beim Anzeigen der
          Karte werden Daten an Google übertragen.
        </li>
        <li>
          <strong>Instagram</strong> (Verlinkungen) — erst beim Klick werden Daten
          an Meta übertragen.
        </li>
        <li>
          <strong>Google Fonts</strong> werden zur Darstellung der Schriften
          geladen.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Wir verwenden nur technisch notwendige bzw. minimale Cookies (z.&nbsp;B.
        zum Speichern deiner Cookie-Auswahl). Es findet kein Tracking zu
        Werbezwecken statt.
      </p>

      <h2>Deine Rechte</h2>
      <p>
        Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
        Einschränkung, Datenübertragbarkeit und Widerspruch. Wende dich dazu an
        die oben genannte Kontaktadresse. Außerdem steht dir ein Beschwerderecht
        bei der Österreichischen Datenschutzbehörde (
        <a href="https://www.dsb.gv.at" target="_blank" rel="noopener">
          dsb.gv.at
        </a>
        ) zu.
      </p>
    </LegalPage>
  )
}
