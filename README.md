# Cupco Landing Page

Standalone landing page for **Cupco**, a Sydney-based custom paper cup manufacturer. This is **not** the main website — it is a dedicated destination for Google Ads traffic, kept separate from `cupco.com.au` so campaign traffic lands on a single focused page.

## Live page

Currently published at:

https://laithjammal.github.io/cupco-website/

Intended home once DNS is in place:

**https://new.cupco.com.au** — see [Custom domain](#custom-domain-not-yet-active).

The page also exists as a Claude Artifact, which is where design edits happen:

https://claude.ai/code/artifact/5311e2fe-2b68-449e-857b-2321f3fe6ea6

## About this repo

`index.html` is a single self-contained HTML file (inline CSS and JS, no build step, images base64-embedded — hence ~2.5 MB). No build tools, no dependencies. Open it directly in a browser to preview.

## Mobile

The page ships a `<meta name="viewport" content="width=device-width, initial-scale=1">` tag. **Do not lose it.**

The CSS carries 37 responsive breakpoints, but without that tag a mobile browser assumes a 980px viewport and scales the whole page down — on a 375px phone that renders everything at roughly 38% size, and not one breakpoint fires. The design looks broken while the CSS is perfectly fine.

This matters here because `index.html` is exported from a Claude Artifact, and the artifact host supplies its own viewport tag in the page wrapper. A fresh export will not include one. **Re-add it after any re-export.**

Form controls are raised to 16px under 720px wide. iOS Safari zooms the viewport when a focused control's text is smaller than that and does not zoom back out, so every field tap would jog the layout. Desktop sizing is unchanged.

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

### Custom domain (not yet active)

Target: `new.cupco.com.au`. DNS for `cupco.com.au` is managed by **Wix** (`ns2.wixdns.net`, `ns3.wixdns.net`), so the record is added in the Wix dashboard, not at a registrar.

In this order:

1. In Wix: **Domains → cupco.com.au → DNS Records**, add a `CNAME` — host `new`, value `laithjammal.github.io`.
2. Wait for it to resolve (usually minutes; allow a few hours).
3. Add a `CNAME` file at the repository root containing exactly `new.cupco.com.au`.
4. In the repo's **Settings → Pages**, confirm the custom domain is detected and tick **Enforce HTTPS** once the certificate is issued.

Order matters. If the `CNAME` file lands before DNS resolves, GitHub redirects the `github.io` URL to the custom domain and the site is unreachable at both addresses until the record propagates.

The indexing setup above needs no changes at switchover — `robots.txt` becomes domain-root and stays correct.

## Testing

The form logic is verified with Playwright against three cases: the email fallback with no endpoint, a successful endpoint POST, and an endpoint returning HTTP 500. The last must still reach the visitor's mail client rather than losing the lead. Re-run these after any change to the submit handler.
