# AGENTS.md — kevin-porto

## Overview

Static portfolio website (Kevin Adisurya Nugraha). No build step, no package manager, no backend. Single-page HTML with external CSS/JS and CDN-loaded dependencies.

## Project structure

```
index.html          — entry point, single-page portfolio layout
style.css           — all styles (no preprocessor)
script.js           — vanilla JS: typewriter effect, scroll reveal, WhatsApp form, navbar scroll
assets/image/       — profile images, portfolio screenshots, certificate images
  portofolio_image/ — project screenshots (login.png, yayasan_cms.png, etc.)
  sertif_image/     — certificate images (mostly PDF thumbnails)
```

## Dependencies (all CDN, no npm)

Loaded via `<link>`/`<script>` in `index.html`:
- Bootstrap 5.3.2 (jsdelivr)
- FontAwesome 6.4.0 (cdnjs)
- Google Fonts: Poppins (300–700)
- Swiper 11 (cdnjs) — removed during QA cleanup; certificates use CSS masonry

## Development

- No dev server needed — open `index.html` in a browser directly
- No build, no bundle, no watch mode
- No tests, no linter, no typechecker

## Key behaviors

- **Contact form**: submits via WhatsApp link (`wa.me/6289616682955`) — no backend, opens new tab
- **CV download**: placeholder (`alert('Fitur download CV akan tersedia segera!')`)
- **Typewriter**: cycles through "Web Developer", "AI Antusias", "Mahasiswa", "UI/UX Design"
- **Scroll reveal**: elements with class `.reveal` animate in on scroll
- **Certificate modals**: clicking a certificate image opens a full-size image modal via Bootstrap data attributes
- **Navbar**: background darkens and shadow grows on scroll past 50px
- **Typing cursor**: blinking `|` appended via CSS animation

## Deployment

Static file deployment — copy all files (`index.html`, `style.css`, `script.js`, `assets/`) to any web server or static host (e.g., Cloudflare Pages, Netlify, GitHub Pages).

## No package.json, CI, or tests

There is no build tooling, test framework, or CI configuration. All changes are immediately visible by refreshing the browser.

## Image paths

- Profile photo: `assets/image/Kevin_Adisurya_Nugraha.jpg`
- About photo: `assets/image/DSC_1889.JPG`
- Project screenshots: `assets/image/portofolio_image/<project>.png|webp`
- Certificate images: `assets/image/sertif_image/<cert-name>.jpg`
