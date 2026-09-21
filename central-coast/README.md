# Lifestyle For You — Central Coast NSW landing page

**This page has nothing to do with Cupco.** It only shares this repository for
now. It is a self-contained, single-file landing page (`index.html`, no build
step, no dependencies) for a local lead-generation campaign aimed at people
living on the Central Coast of New South Wales. Open the file directly in a
browser to preview it.

The conversion goal is a booked **free, private, no-obligation in-house
treatment and consultation**, by phone or through the form.

## Configured

| What | Value |
|---|---|
| Business name | **Lifestyle For You** — in `<title>`, the wordmark, the footer and the JSON-LD |
| Phone | **0416 915 173** (`tel:+61416915173`) — header, hero, FAQ, booking section, footer, and the mobile sticky bar |
| Email | **None.** No email address appears anywhere on the page, because none was supplied |

## Still to do before launch

1. **`FORM_ENDPOINT`** — still empty, in the script at the foot of the file.
   Read the next section before deciding this is optional.
2. **Canonical and `og:url`** — still `example.com`, in `<head>`.
3. **Remove the `noindex` tag** — see *Search* below. It is the one that
   silently kills the whole local-SEO effort if forgotten.

### Why the empty endpoint matters more than usual

With no endpoint *and* no email address, there is nowhere for a form submission
to be delivered. Accepting someone's details and showing "Request sent." would
be a lie, so while `FORM_ENDPOINT` is empty the form does something else: it
validates the fields, then hands the visitor to the phone — one tap to call,
one tap to send **the same details as a pre-filled text message**. Nothing is
silently dropped and no lead is lost.

Set `FORM_ENDPOINT` and the normal POST path takes over automatically; the
phone handoff stays on as the failure fallback, exactly where the old `mailto:`
fallback used to sit.

## Design basis

The visual design follows a template supplied by the client (eucalypt green
`#2F6F63` primary, terracotta `#E2895F` accent, paper `#FBF6EC` and card
`#F3ECDC` grounds, Fraunces over Work Sans). Structure carried across from it:
the hero badge and two-column hero with a photo panel and review chip, the
dark suburb strip, the "our story" section with a stat row, the testimonial
grid, the closing CTA banner and the four-column footer.

What was **not** carried across is the template's content. It described a
different business — naturopathy, nutrition, remedial massage and acupuncture
from a clinic with an address and opening hours — and it carried claims this
page cannot make ("feel like yourself again", "get to the root of fatigue,
digestion and hormone concerns", "relief for tradie backs", Medicare and
private health rebates). The content here remains the free in-house treatment
and consultation.

## Placeholders — this page is NOT ready to publish

Every placeholder is styled to look unfinished: dashed sage border, hatched
background, a "Placeholder" tag, bracketed text. That is deliberate, so the
page cannot be mistaken for finished. **Fill each one in or delete the block
before launch.**

| Where | Placeholder | Notes |
|---|---|---|
| Hero | `[PHOTO — consultant with a client, Central Coast NSW, natural light]` | Real Central Coast photography. Brief it as *Central Coast NSW, Australia / Australian coastal lifestyle*. Not Sydney Harbour, not Queensland, no US or European streets. |
| Hero | `[X.X / 5 from local clients]` review chip | Needs a real, verifiable rating or the whole chip goes. |
| About | `[PHOTO — Michelle or the team, Central Coast NSW]` | Get Michelle's consent before publishing her photo or name. |
| About | `[X]+ Coast locals visited`, `[X] Years on the Central Coast` | Only publish numbers you can evidence. Delete any you can't. "100% locally owned" stays only if true. |
| Testimonials | Three bracketed quotes and client names | See the compliance note below — these need more than just filling in. |
| Footer | `[Street address]`, `[Suburb], NSW [Postcode]`, `Mon–Fri: [Hours]`, `Sat: [Hours]` | If there is no premises, **delete the whole Visit column** rather than inventing one. |
| Footer | `[Email address]`, `[Instagram · Facebook]` | No email was supplied. Delete if there isn't one. |
| Head | canonical and `og:url` still point at `example.com` | |
| Head | `<meta name="robots" content="noindex, nofollow">` | Remove only when the page moves to its own domain. |
| Script | `FORM_ENDPOINT` still empty | See *Booking form delivery*. |

Also confirm before launch: **"Central Coast owned & operated"** in the hero
badge and **"Michelle, our leading expert"** are both true and that Michelle
consents to being named.

### Testimonials need a compliance read, not just content

Real reviews cannot simply be dropped into those three cards. A customer
saying a product fixed their pain is a therapeutic claim in exactly the same
way as the page saying it — the fact that a customer said it is not a defence.
Any testimonial used here needs checking against the same rules as the rest of
the copy before it goes live.

## Search

The page currently carries `<meta name="robots" content="noindex, nofollow">`
**on purpose**, because while it sits under the Cupco domain it would otherwise
compete with and confuse `cupco.com.au`. Local search visibility is a core
requirement of this page, and `noindex` cancels all of it — **delete that tag
the moment the page moves to its own domain.**

What is built for search, and deliberately limited:

- Title, description and headings target booking-shaped terms —
  *free in-house treatment Central Coast*, *free consultation Central Coast*,
  *Central Coast NSW consultation*, *non-pharmaceutical options Central Coast*.
- **No disease keywords.** "Treatment" appears only as the name of the free
  session, never attached to a condition: nothing targets "pain treatment",
  "arthritis", "circulation" or anything like them, and nothing in the metadata
  says more than the visible page does.
- The phone number is in the meta description, so it is one tap away straight
  from a search result.
- JSON-LD is `Organization` + `Service` + `FAQPage`. There is **no**
  `LocalBusiness` with an address, no `openingHours`, no `aggregateRating` —
  none of that was supplied, and schema must not say more than the page.
  `areaServed` carries the genuine service area and a `GeoCircle` centred on
  the region.
- Every FAQ answer in the structured data is also visible on the page, word for
  word. Keep them in step when editing.

## Compliance — read before editing copy

The page offers a **free in-house treatment**, and says so in the hero, the
CTAs, the steps, the FAQ, the booking section and the metadata. That wording
was requested directly. It is worth being clear about what it changes:

- The page still makes **no therapeutic claim**. It never names a product, a
  condition, a symptom, a benefit or an outcome, and it never promises relief,
  improvement or recovery. "Treatment" appears only as the name of the free
  session being offered — never as a claim about what that session does.
- Every CTA is still about **booking the session**, never about a result.
  "Book your free in-house treatment", never "Get relief" or "Treat your pain".
- The footer disclaimer states plainly that Lifestyle For You is **not a
  medical practice**, does not provide diagnosis or medical treatment, makes no
  claim about any outcome, and that nobody should change or stop a medication
  without their doctor.
- A **"What this is / What this isn't"** panel does the same work in the body
  of the page. Every line in it is a limit, not a claim.

If the underlying product is a therapeutic good, offering a free "treatment" is
the wording most likely to attract attention under Australian therapeutic-goods
advertising rules, precisely because "treatment" implies a therapeutic purpose
even when nothing else on the page does. That is a judgement for the business,
and for someone qualified to advise on it if it matters commercially. The page
is built so the terminology can be swapped back to "consultation" with a
find-and-replace if that call goes the other way.

### What was deliberately not added

The brief asked the page to "feel more like it's run by a medical
professional". The page has been given a **clinical, precise visual language** —
the anatomical figure, the specification-style session list, the
this-is/this-isn't panel, restrained typography — because all of that is
presentation, and it is honest.

What it does **not** contain, and must not be given without evidence:

- Any title, qualification, degree, registration or accreditation.
- "Dr", "practitioner", "clinician", "therapist", "nurse" or "specialist".
- AHPRA, TGA, association or healthcare-partner logos or mentions.
- "Clinic", "practice", "medically supervised", "clinically proven".
- Medical insignia — a cross, a caduceus, a stethoscope, a white coat.

Implying medical qualifications the operator does not hold misleads the people
this page is asking to trust it, and in Australia it is taken seriously. If
Lifestyle For You genuinely holds relevant qualifications or registrations,
name them — a real credential is far more persuasive than the *impression* of
one, and it can be stated plainly.

Also still absent, as before: no address, clinic, opening hours, review, award,
customer count, "years serving the Coast", partnership or affiliation. Nothing
on this page is invented.

A regression check after any copy edit. "Treatment" is expected now; everything
else it flags should fall inside the disclaimer or the "what this isn't" panel
and nowhere else:

    python3 -c "
    import re
    s=open('central-coast/index.html').read()
    t=re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->','',s,flags=re.S)
    t=re.sub(r'<[^>]+>',' ',t).lower()
    for w in ['cure','heal','relief','relieve','remedy','therapy','symptom','pain',
              'arthritis','inflammation','circulation','diagnos','patient','clinic',
              'medicine','medical','doctor','registered','qualified','specialist']:
        if re.search(r'\b'+w, t): print('FLAG', w)
    "

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

Everything on the page is **hand-built inline SVG, not photography** — a
placeholder decision for the coastal scenes, and a permanent one for the figure.

**The two coastal scenes.** Generic overseas stock reads instantly as wrong to
someone who lives here, and no genuine Central Coast photography was supplied,
so nothing is passed off as somewhere it isn't. The scenes are abstract
Australian coastal forms (layered headlands, banded water, dune and dune grass)
and cost about 6 KB, which keeps the first mobile paint fast. When real
photography is available, brief it as **Central Coast NSW, Australia /
Australian coastal lifestyle / New South Wales Central Coast / Australian
suburban environment**. Not Sydney Harbour, not the Gold Coast or anywhere in
Queensland, and no US or European streets or architecture.

**The anatomical figure** in the dark "session" band is an anterior view of the
muscular system, drawn as one mirrored half so it stays symmetrical and is half
the work to edit. It carries **no labels, markers, pointers or highlighted
regions, deliberately** — an annotated region would read as "we treat this",
which is a therapeutic claim this page does not make. Keep it that way. The
slow light pass across it is decorative and stops dead under
`prefers-reduced-motion`.

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

## Booking form delivery

The order of preference is: endpoint POST, then phone handoff. A paid click must
never dead-end, and a lead must never be silently dropped.

- With `FORM_ENDPOINT` set, submissions `fetch()`-POST as `FormData` with an
  `Accept: application/json` header, so a provider like Formspree returns JSON
  instead of redirecting away from the page. Success swaps in "Request sent."
- **With no endpoint, or on any non-2xx or network failure**, the card swaps to
  "One last step" with two buttons: call, or send the same details as a
  pre-filled SMS (iOS wants `?&body=`, everything else takes `?body=`). The
  visitor never sees an error; the console carries the diagnosis.
- **Conversions never fire on the phone handoff.** Opening a dialler is not a
  confirmed lead. `generate_lead` fires only on a confirmed endpoint accept, and
  only if a `gtag` is present — no analytics tag is installed on this page yet.
- The visitor's name is HTML-escaped before it goes into the handoff panel.
- A `_gotcha` honeypot silently discards bot submissions.
- The note under the button changes with the active path, so you can tell which
  one is live without opening DevTools.

Verified with Playwright: empty submit marks and focuses the first bad field;
no endpoint produces the phone handoff with a correct `tel:` and an SMS body
carrying the suburb; a script-shaped name is escaped rather than injected; a 200
shows "Request sent." with the phone actions staying hidden and exactly one lead
event; HTTP 500 falls back to the handoff with no conversion counted; a filled
honeypot suppresses the submission entirely; all seven `tel:` links on the page
point at 0416 915 173, and there are zero `mailto:` links.
