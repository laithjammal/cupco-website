# Central Coast NSW — free consultation landing page

**This page has nothing to do with Cupco.** It only shares this repository for
now. It is a self-contained, single-file landing page (`index.html`, ~57 KB, no
build step, no dependencies) for a local lead-generation campaign aimed at
people living on the Central Coast of New South Wales. Open the file directly in
a browser to preview it.

The single conversion goal is a booked **free, private, no-obligation
consultation**.

## Before it goes live

| # | What | Where |
|---|---|---|
| 1 | Real trading name | `<title>`, the header wordmark, the footer, and `name` in the JSON-LD. Search the file for `CONFIGURE`. |
| 2 | `CONTACT_EMAIL` | Script at the foot of the file. Currently `hello@example.com`. |
| 3 | `CONTACT_PHONE` | Script. **Left empty, the "Prefer to call?" CTA stays hidden** rather than showing an invented number. |
| 4 | `FORM_ENDPOINT` | Script. Empty keeps the `mailto:` flow. |
| 5 | Canonical / `og:url` | `<head>`. Currently `example.com`. |
| 6 | **Remove the `noindex` tag** | `<head>`. See *Search* below — this is the one that silently kills the whole local-SEO effort if forgotten. |

## Search

The page currently carries `<meta name="robots" content="noindex, nofollow">`
**on purpose**, because while it sits under the Cupco domain it would otherwise
compete with and confuse `cupco.com.au`. Local search visibility is a core
requirement of this page, and `noindex` cancels all of it — **delete that tag
the moment the page moves to its own domain.**

What is built for search, and deliberately limited:

- Title, description and headings target consultation-shaped terms only —
  *Central Coast consultation*, *free consultation Central Coast*, *wellness
  consultant Central Coast NSW*, *non-pharmaceutical options Central Coast*.
- **No disease or treatment keywords.** Nothing targets "pain treatment",
  "arthritis", "circulation" or similar. Search must never introduce a claim
  the visible page does not make.
- JSON-LD is `Organization` + `Service` + `FAQPage`. There is **no**
  `LocalBusiness` with an address, no `openingHours`, no `aggregateRating` —
  none of that was supplied, and schema must not say more than the page.
  `areaServed` carries the genuine service area and a `GeoCircle` centred on
  the region.
- Every FAQ answer in the structured data is also visible on the page, word for
  word. Keep them in step when editing.

## Compliance

The copy makes **no therapeutic claim of any kind**. It does not name or
describe a product, does not mention a condition, symptom, outcome or benefit,
and never promises relief, treatment or recovery. Every CTA is about the
*conversation*, never an outcome ("Book your free Central Coast consultation",
not "Get relief"). A footer disclaimer states plainly that the page is general
information, is not medical advice, and makes no claim about treating, curing or
preventing anything.

Nothing on the page is invented: no address, clinic, opening hours, review,
award, customer count, "years serving the Coast", partnership or healthcare
affiliation. If genuine testimonials or local social proof become available,
they need a separate compliance review before they go anywhere near this page.

A quick regression check after any copy edit — everything it flags should fall
inside the disclaimer and nowhere else:

```
python3 - <<'PY'
import re
s=open('central-coast/index.html').read()
t=re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->','',s,flags=re.S)
t=re.sub(r'<[^>]+>',' ',t).lower()
for w in ['treat','cure','heal','relief','relieve','remedy','therapy','symptom',
          'pain','arthritis','inflammation','circulation','diagnos','patient',
          'clinic','medicine','medical','doctor','health']:
    for m in re.finditer(r'.{60}\b'+w+r'.{60}', t):
        print(w, '::', ' '.join(m.group(0).split()))
PY
```

## Mobile

Phones get the same document, not a second layout. Two things matter:

**The first-viewport contract.** Central Coast + another approach + free
consultation must all be visible without scrolling. The hero becomes a flex
column — copy first, illustration beneath — and its height is
`100dvh - 68px header - 92px sticky bar`, so the whole hero lands in the space
the visitor can actually see instead of sliding under the sticky CTA. `dvh` is
what stops mobile browser chrome from quietly eating the button; there is a
`100vh` fallback for browsers without it. On phones under 660px tall the
supporting paragraph is dropped and the illustration shrinks rather than pushing
the CTA below the fold — the headline and the CTA are the contract, the
paragraph is not.

**One decision per screen.** Under 720px the header CTA and the hero's secondary
link are both hidden; the sticky bottom bar carries the CTA instead, and stands
down (via `IntersectionObserver`) once the booking form is on screen so it never
covers the thing it points at.

Form controls are 16px on mobile. iOS Safari zooms a focused control with
smaller text and never zooms back out.

Verified at 390×844 and 360×640: the hero CTA and the "Free • Private • No
obligation" line both sit inside the first viewport, and there is no horizontal
scroll at either size or on desktop.

## Imagery

The two coastal scenes are **hand-built inline SVG, not photography** — a
deliberate placeholder decision. Generic overseas stock reads instantly as wrong
to someone who lives here, and no genuine Central Coast photography was
supplied, so nothing is passed off as somewhere it isn't. The scenes are
abstract Australian coastal forms (layered headlands, banded water, dune and
dune grass) and cost about 6 KB, which keeps the first mobile paint fast.

When real photography is available, brief it as **Central Coast NSW, Australia /
Australian coastal lifestyle / New South Wales Central Coast / Australian
suburban environment**. Not Sydney Harbour, not the Gold Coast or anywhere in
Queensland, and no US or European streets or architecture. Avoid landmarks
unless the shot genuinely is the Central Coast.

## The local treatment

The brief's requirement was local relevance without keyword stuffing, so the
suburb list does its work where it is useful rather than in the prose:

- The **service-area section** names seven places and then says "and surrounding
  Central Coast communities" — not twenty.
- The **suburb field on the form** carries the full list as a `datalist`, so a
  local sees their own suburb the moment they start typing, and the page gets no
  keyword stuffing at all.
- Lifestyle references (beaches, hinterland, the northern end of the Coast, the
  commute south) are positioning only. There are no claims about who lives here
  or what they need.

## Quote form delivery

Same pattern as the Cupco page, and the reasoning is the same: a paid click must
never dead-end.

- With `FORM_ENDPOINT` set, submissions `fetch()`-POST as `FormData` with
  `Accept: application/json`, so a provider like Formspree returns JSON instead
  of redirecting away from the page. Success swaps in the "Request sent." panel.
- **Any non-2xx or network failure silently falls back to `mailto:`.** The
  visitor never sees an error; the console carries the diagnosis.
- **Conversions never fire on the email path.** Opening a mail client is not a
  lead, and counting it as one would corrupt the numbers. `generate_lead` fires
  only on a confirmed endpoint accept, and only if a `gtag` is present — no
  analytics tag is installed on this page yet.
- A `_gotcha` honeypot silently discards bot submissions.
- The note under the button changes with the active path ("Submitting opens a
  pre-filled email…" vs "We usually reply within one business day"), so you can
  tell which path is live without opening DevTools.

Verified with Playwright: empty submit marks and focuses the first bad field;
no endpoint builds a correct `mailto:`; a 200 shows the success panel and fires
exactly one lead event; HTTP 500 and a dead network both fall back to email with
no conversion counted and the button restored; a filled honeypot suppresses the
submission entirely.
