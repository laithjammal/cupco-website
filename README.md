# Cupco Website

Landing page for **Cupco**, a Sydney-based custom paper cup manufacturer. Built to generate quote requests from cafés, restaurants, corporate events, and weddings.

## Live page

Published via GitHub Pages:

https://laithjammal.github.io/cupco-website/

The custom domain `new.cupco.com.au` is planned but not active yet — see Deployment below.

The page also exists as a Claude Artifact, which is where day-to-day edits happen:

https://claude.ai/code/artifact/5311e2fe-2b68-449e-857b-2321f3fe6ea6

## About this repo

`index.html` is a single self-contained HTML file (inline CSS and JS, no build step). It's the working backup of the artifact above — the artifact is the source of truth day-to-day; this repo keeps a version-controlled copy over time and serves the published site.

## Structure

- Hero section with quote CTA
- "Which one are you?" interactive segment cards (cafés/restaurants, corporate events, weddings) with pain-point vs. solution comparisons
- Process ("From Idea To Incredible")
- Sizes & wall types (8oz/12oz/16oz, single vs. double wall)
- "Power of the cup" brand impact stats
- Customer testimonials
- Quote request form (opens a pre-filled email to `info@cupco.com.au` — the page has no backend of its own)
- Contact section and footer

## Deployment

GitHub Pages serves this repo from the `main` branch, root folder. `index.html` must stay at the repository root under that exact name for the site to resolve.

### Search indexing

`robots.txt` currently blocks all crawlers. The `github.io` address is a staging
URL, and letting it be indexed would put a near-duplicate of the Cupco marketing
page into search results, competing with `cupco.com.au`.

This is deliberate and temporary — see the switchover checklist below.

### Custom domain (not yet active)

The site is intended to live at `new.cupco.com.au`. To switch it over, in this order:

1. Add a DNS `CNAME` record for `new` pointing at `laithjammal.github.io`, at whoever manages `cupco.com.au` DNS.
2. Wait for it to resolve.
3. Add a `CNAME` file at the repository root containing exactly `new.cupco.com.au`.
4. **Remove or relax `robots.txt`**, or the live site will stay invisible to search engines.

Order matters for steps 1–3: if the `CNAME` file is present before DNS resolves, GitHub redirects the `github.io` URL to the custom domain and the site becomes unreachable at both addresses until the record propagates.

Step 4 is the easy one to forget. A launched site that nobody can find on Google is a silent failure — it looks fine to anyone who visits directly.

## Notes

- No build tools, no dependencies. Open `index.html` directly in a browser to preview.
- Scroll-based parallax background decoration and interactive elements are vanilla JS.
- Contact form submission works via `mailto:` since the page has no server-side email sending.
- Images are base64-embedded inline, which is why the file is ~2.5 MB.
