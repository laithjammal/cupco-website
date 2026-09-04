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

Two constants at the top of the form script in `index.html` control this:

| Constant | Purpose |
|---|---|
| `FORM_ENDPOINT` | POST URL from a hosted form provider (Formspree, Basin, Getform). |
| `ADS_CONVERSION_ID` | `send_to` value from a Google Ads conversion action, e.g. `AW-123456789/AbC-D_efGh`. Requires gtag.js on the page. |

Behaviour:

- **Both empty** (current state) — the form opens a pre-filled email to `info@cupco.com.au` in the visitor's own mail client. Works, but produces no conversion data and silently fails for visitors with no mail client configured.
- **`FORM_ENDPOINT` set** — the form POSTs directly, shows a "Request sent." confirmation, and rewrites the form note accordingly.
- **`ADS_CONVERSION_ID` set** — a conversion fires on a confirmed server-side accept only. It deliberately does **not** fire on the email path: opening a mail client is not a lead.
- **Endpoint configured but failing** — falls back to the email path rather than dead-ending. A paid click should never hit a broken form.

All four paths are covered by the checks described under [Testing](#testing).

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
