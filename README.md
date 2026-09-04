# Cupco Landing Page

Standalone landing page for **Cupco**, a Sydney-based custom paper cup manufacturer. This is **not** the main website — it is a dedicated destination for Google Ads traffic, kept separate from `cupco.com.au` so campaign traffic lands on a single focused page.

## Live page

Published via GitHub Pages on a custom domain:

**https://new.cupco.com.au**

`laithjammal.github.io/cupco-website` redirects here.

The page also exists as a Claude Artifact, which is where design edits happen:

https://claude.ai/code/artifact/5311e2fe-2b68-449e-857b-2321f3fe6ea6

## About this repo

`index.html` is a single self-contained HTML file (inline CSS and JS, no build step, images base64-embedded — hence ~2.8 MB). No build tools, no dependencies. Open it directly in a browser to preview.

## Mobile

The page ships a `<meta name="viewport" content="width=device-width, initial-scale=1">` tag. **Do not lose it.**

The CSS carries 37 responsive breakpoints, but without that tag a mobile browser assumes a 980px viewport and scales the whole page down — on a 375px phone that renders everything at roughly 38% size, and not one breakpoint fires. The design looks broken while the CSS is perfectly fine.

This matters here because `index.html` is exported from a Claude Artifact, and the artifact host supplies its own viewport tag in the page wrapper. A fresh export will not include one. **Re-add it after any re-export.**

Form controls are raised to 16px under 720px wide. iOS Safari zooms the viewport when a focused control's text is smaller than that and does not zoom back out, so every field tap would jog the layout. Desktop sizing is unchanged.

Below 720px the layout diverges from desktop in a few deliberate ways, all confined to a single media query at the end of the stylesheet:

- **Hero cups.** `.hero-cups` carries a crop of the hero photo centred on the three cups. On phones it sits absolutely behind `.hero-copy`, blurred and semi-transparent, with the full-bleed `.hero-photo-bg` hidden — that photo is a narrow crop of the same shot and layering the two muddied both.

  It uses `object-fit: contain`, not `cover`, so the whole photo stays in frame; `cover` crops to fill the box, which is why only part of it ever showed. No transform either, since scaling pushes the edges back out of view.

  Blur and opacity are a contrast trade-off, measured against the sub-copy background with the text hidden: 18px/0.55 gives a median contrast of 4.58:1, against 3.85:1 at 14px/0.70 and 3.17:1 at 24px/0.85. Raising the image's presence costs legibility, so change both together and re-measure.
- **Wall comparison.** The source is one wide image with both cups side by side, so its labels are unreadable at this width. `.wall-compare-stack` carries the two halves split either side of the "VS" badge and stacks them, roughly doubling their rendered size. Desktop still uses the single original.
- **Feature strip.** "Sydney Made" is fifth of five in a two-column grid, so it spans the full row instead of orphaning.
- **Process steps and stats** are centred two-by-two. Their icons are `display:block`, so centring needs auto margins, not `text-align`.
- **The black cup illustration** (`.power-illustration`) is hidden.
- **Mobile menu.** `.mobile-menu` sits on `.wrap`, but its own `padding` shorthand carried `0` on the horizontal sides, cancelling `.wrap`'s `0 24px` because it comes later in the stylesheet. That ran the menu edge to edge — link text touching the screen border, the Get A Quote button's rounded ends clipped. The shorthand now names 24px explicitly. Its links are centred; the component is mobile-only, so this lives on the base rule rather than in the media query.

The closing headline is capped at 1.4rem on phones — the largest size that still breaks over two even lines at 360px, the narrowest common width. At 1.45rem it drops to three ragged lines.

Four sections had their padding moved off inline `style` attributes into the stylesheet. Inline styles outrank every selector, so per-breakpoint adjustment was otherwise impossible without `!important`. Desktop values are unchanged.

## Structure

- Hero section with quote CTA
- "Which one are you?" interactive segment cards (cafés/restaurants, corporate events, weddings) with pain-point vs. solution comparisons
- Process ("From Idea To Incredible")
- Sizes & wall types (8oz/12oz/16oz, single vs. double wall)
- "Power of the cup" brand impact stats
- Customer testimonials
- Quote request form
- Contact section and footer

## Quote form delivery

Submissions go to **Formspree** (`https://formspree.io/f/xwlkqlrv`) by `fetch()` POST, with an `Accept: application/json` header so Formspree returns JSON instead of redirecting to its own thank-you page. The page keeps the visitor on its own success panel.

Two constants at the top of the form script in `index.html` control delivery:

| Constant | Value | Purpose |
|---|---|---|
| `FORM_ENDPOINT` | set | Provider POST URL. Set to `''` to revert to the `mailto:` flow. |
| `ADS_CONVERSION_ID` | empty | `send_to` from a Google Ads conversion action, e.g. `AW-123456789/AbC-D_efGh`. **Also requires the gtag.js snippet, which is not yet on the page.** |

Fields sent beyond the visible inputs:

- `orderTypeSummary` — the checkbox group flattened to one readable line
- `_subject` — names the enquirer and their business, so the inbox is scannable
- `_replyto` — set to the enquirer's address, so **Reply** goes to them, not to Formspree

Behaviour:

- **Success** — shows "Request sent.", rewrites the form note, and fires the Google Ads conversion if `ADS_CONVERSION_ID` is set.
- **Any non-2xx, or a network failure** — silently falls back to the `mailto:` flow. A paid click never dead-ends on a broken form.
- **Conversions never fire on the email path.** Opening a mail client is not a lead, and counting it as one would corrupt bidding data.

### Limits and failure modes

- Formspree's free tier is **50 submissions/month**. Beyond that submissions are rejected, and the page quietly falls back to email — leads still arrive, but conversion tracking stops. Worth watching if campaigns scale.
- Formspree requires the destination address to be **confirmed** before it delivers anything.
- Spam: Formspree supports a `_gotcha` honeypot field, not currently implemented.

### Diagnosing a form that falls back to email

The fallback is silent by design — a visitor should never see an error — so the
console carries the diagnosis instead. On load the page logs which delivery path
is active, and a failed submission logs why it fell back.

The most common cause is a **stale cached page**: GitHub Pages serves with
`cache-control: max-age=600`, so a tab opened before a deploy keeps the old
behaviour for up to ten minutes. A quick visual check without opening DevTools:
the note under the submit button reads *"Submitting opens a pre-filled email..."*
on the `mailto:` version and *"We usually reply within one business day..."* once
an endpoint is active.

Note that Formspree answers `200 {"ok":true}` even when the destination address
has not been confirmed. The page reports success and nothing is delivered, so a
successful-looking submission is not proof that mail is arriving — confirm the
address, then verify a real submission lands in the inbox.

## Deployment

GitHub Pages serves this repo from the `main` branch, root folder. `index.html` must stay at the repository root under that exact name.

### Search indexing

This page is **intentionally excluded from organic search** so it does not compete with `cupco.com.au` for the same terms, while remaining fully available to Google Ads.

- `<meta name="robots" content="noindex, nofollow">` near the top of `index.html` keeps it out of the index.
- `robots.txt` **allows** crawling, and names `AdsBot-Google` explicitly.

Those two are not in conflict — they are the only combination that works. Google can only honour a `noindex` tag on a page it is allowed to fetch. Blocking crawlers in `robots.txt` would hide the tag and let the bare URL be indexed anyway, with no description.

Google Ads is unaffected regardless: `AdsBot-Google` ignores `User-agent: *` rules by design, so landing-page quality checks always get through.

### Custom domain

The site serves from `new.cupco.com.au`, pinned by the `CNAME` file at the repository root. DNS for `cupco.com.au` is managed by **Wix** (`ns2.wixdns.net`, `ns3.wixdns.net`); the record is a `CNAME` on host `new` pointing at `laithjammal.github.io`.

Deleting or renaming the `CNAME` file reverts the site to `laithjammal.github.io/cupco-website`.

Because the site now sits at a domain root, `robots.txt` is the effective crawl control rather than inert — which is exactly why it allows crawling. See Search indexing above.

## Testing

The form logic is verified with Playwright against three cases: the email fallback with no endpoint, a successful endpoint POST, and an endpoint returning HTTP 500. The last must still reach the visitor's mail client rather than losing the lead. Re-run these after any change to the submit handler.
