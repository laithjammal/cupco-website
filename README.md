# Kestrel Flight Academy site

Single-page marketing site for a pilot training school. Static files, no build step. Open `index.html` or serve the folder.

## Edit these first

- `assets/js/main.js`, `CONFIG` at the top: contact email and phone, the form endpoint (Formspree or similar; blank opens the visitor's email app), and `HOURLY_RATE` (when set, the planner shows a minimum flying cost).
- `index.html`: the name "Kestrel Flight Academy" is a placeholder. Search and replace it.
- Course copy and minimum hours live in the `data` array in `assets/js/main.js` and in the strip under the hero. Check them against current CASA requirements before launch.

## Video and imagery

The hero and the "lesson" section run on a live canvas sky. Drop real footage in and it fades in over the sky automatically:

- `assets/media/hero.mp4` (muted loop, about 1920x1080, under 6 MB)
- `assets/media/lesson.mp4` (shows a Play with sound button once loaded)

## Stack

Vanilla HTML, CSS and JS. GSAP and ScrollTrigger are vendored in `assets/vendor`. Outfit, Geist and Geist Mono are self-hosted in `assets/fonts`. Icons are Phosphor, inlined as an SVG sprite. Reduced-motion users get a static page.

## Deployment

GitHub Pages serves `main`, root folder. `CNAME` still points at the previous domain; change it before launch.
