# Audit Digital — Main Website

The main marketing site for [auditdigital.co.uk](https://auditdigital.co.uk). Hosted on GitHub Pages.

## What this is

Audit Digital is a web design agency building websites for small, independent UK accountancy firms. This site is the agency's own homepage: portfolio, services, and contact.

## Structure

```
audit-digital-site/
├── index.html        # Single-page site
├── privacy.html      # Privacy policy
├── css/styles.css    # All styles
├── js/main.js        # Navigation, scroll behaviour, Calendly
├── assets/
│   ├── favicon/
│   └── images/
└── CNAME             # auditdigital.co.uk
```

## Tech

- Vanilla HTML, CSS, JS. No frameworks, no build tools.
- Fonts: Instrument Serif (headings) + Plus Jakarta Sans (body) via Google Fonts.
- Palette: deep navy `#0B1120` / warm gold `#B8935A` / warm off-white `#FAFAF7`.
- Calendly widget for discovery call booking.

## Deployment

Deployed automatically via GitHub Pages on push to `main`. Custom domain set in `CNAME`.

To preview locally:

```bash
npx live-server
```
