# Cupco Website

Landing page for **Cupco**, a Sydney-based custom paper cup manufacturer. Built to generate quote requests from cafés, restaurants, corporate events, and weddings.

## Live page

The page is published as a Claude Artifact:

https://claude.ai/code/artifact/5311e2fe-2b68-449e-857b-2321f3fe6ea6

## About this repo

`cupco.html` is a single self-contained HTML file (inline CSS and JS, no build step). It's the working backup of the live artifact above — the artifact is the source of truth day-to-day; this repo exists to keep a version-controlled copy over time.

## Structure

- Hero section with quote CTA
- "Which one are you?" interactive segment cards (cafés/restaurants, corporate events, weddings) with pain-point vs. solution comparisons
- Process ("From Idea To Incredible")
- Sizes & wall types (8oz/12oz/16oz, single vs. double wall)
- "Power of the cup" brand impact stats
- Customer testimonials
- Quote request form (opens a pre-filled email to `info@cupco.com.au` — the page has no backend of its own)
- Contact section and footer

## Notes

- No build tools, no dependencies. Open `cupco.html` directly in a browser to preview.
- Scroll-based parallax background decoration and interactive elements are vanilla JS.
- Contact form submission works via `mailto:` since the page runs in a sandboxed environment with no server-side email sending.
