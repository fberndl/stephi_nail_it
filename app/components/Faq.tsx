import type { FaqItem } from '@/lib/structured-data'

// Visible FAQ accordion built on native <details> — keyboard-accessible and
// works without JavaScript. The same items power the FAQPage JSON-LD, so the
// visible text and the structured data always match (Google requires this).
export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq-acc reveal">
      <style>{`
        .faq-acc details {
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .faq-acc summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 4px;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(20px, 2.4vw, 26px);
          color: var(--ink);
        }
        .faq-acc summary::-webkit-details-marker { display: none; }
        .faq-acc .faq-chevron {
          flex: 0 0 auto;
          color: var(--copper-deep);
          transition: transform 0.25s ease;
        }
        .faq-acc details[open] .faq-chevron { transform: rotate(45deg); }
        .faq-acc .faq-answer {
          padding: 0 4px 24px;
          margin: 0;
          max-width: 68ch;
          color: var(--ink-soft);
          font-family: 'Jost', sans-serif;
          font-size: 16px;
          line-height: 1.75;
        }
      `}</style>
      {items.map((item, i) => (
        <details key={i} open={i === 0}>
          <summary>
            {item.q}
            <span className="faq-chevron" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
          </summary>
          <p className="faq-answer">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
