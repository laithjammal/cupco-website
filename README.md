# Cupco Website

Landing page for **Cupco**, a Sydney-based custom paper cup manufacturer. Built to generate quote requests from cafés, restaurants, corporate events, and weddings.

## Live page

Published via GitHub Pages on a custom domain:

https://new.cupco.com.au

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

The `CNAME` file pins the custom domain `new.cupco.com.au`. That domain only resolves once a DNS `CNAME` record for `new` points at `laithjammal.github.io` at whoever hosts `cupco.com.au`. Deleting or renaming the `CNAME` file reverts the site to `laithjammal.github.io/cupco-website`.

## Notes

- No build tools, no dependencies. Open `index.html` directly in a browser to preview.
- Scroll-based parallax background decoration and interactive elements are vanilla JS.
- Contact form submission works via `mailto:` since the page has no server-side email sending.
- Images are base64-embedded inline, which is why the file is ~2.5 MB.
