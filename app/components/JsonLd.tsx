// Renders a JSON-LD <script> for search engines and AI answer engines.
// Server component — the structured data ships in the initial HTML so crawlers
// see it without executing JavaScript.
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Data comes from our own server-side builders (+ admin-edited CMS text),
      // not anonymous input. Escape `<` so a stray "</script>" in any field
      // can't break out of the tag — the standard guard for inline JSON-LD.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
