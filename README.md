# Yasmin Chatt (scorpy) — Freelance Portfolio

A dark, cyberpunk-inspired freelance portfolio (black + red) with a custom **scorpion "scorpy" emblem** and futuristic GSAP animations.
Built as static **HTML/CSS/JS** — no build step, hosts anywhere (GitHub Pages, Netlify, Vercel, any static host).

Personal details (name, bio, email, phone, Instagram, LinkedIn) are already filled in.
**The only thing left to personalize is the Work section** — swap the placeholder project cards + images for your real work.

## Run it

Just open `index.html` in a browser. (For the contact form and fonts to behave best, serve it locally:)

```bash
# Python (already installed)
python -m http.server 5173
# then visit http://localhost:5173
```

## Structure

```
portfolio/
├─ index.html          # all page content
├─ css/styles.css      # theme + layout + responsive + reduced-motion
├─ js/main.js          # preloader, glitch hero, scroll reveals, magnetic buttons, cursor glow, filters, form
└─ assets/work/        # drop your project images here (poster-1.jpg, album-1.jpg, …)
```

## Your hero photo

Your photo is composited into the **hero** with a red cyberpunk grade at `assets/hero-photo.png` (generated from your original rooftop photo — background keyed out, duotone red, left-faded to blend into the hero). To change it: replace that PNG (a pre-processed RGBA image), or send me a new original and I'll re-grade it. The grading script is reproducible on request.

## What's left: add your 4 real Work images

Drop the images into `assets/work/` with these exact names and they appear automatically:

| Filename | Project |
|---|---|
| `assets/work/cinema.jpg` | Atelier de Cinéma |
| `assets/work/defile.jpg` | Atelier de Défilé |
| `assets/work/debate.jpg` | Debate Club |
| `assets/work/book.jpg` | Book Recommendation — The Stranger |

Until those files exist, each real card shows a labelled placeholder.

## Concept samples (already in the site)

The Work section also includes 11 **concept pieces I generated** for you (crisp SVG artwork in `assets/work/`): 3 website mockups (`web-saas`, `web-restaurant`, `web-fashion`), 2 album covers (`album-bloom`, `album-echoes`), 2 brand boards (`logo-volt`, `logo-botanica`), 2 posters (`poster-music`, `poster-film`), 2 flyers (`flyer-party`, `flyer-sale`). They're marked "Concept design" in the card text — keep, edit (they're plain SVG), or delete any `.card` block you don't want. To add more projects, copy a `.card` block in `index.html` → `#workGrid` and set `data-cat` to `poster`, `social`, `album`, `brand`, or `web`.

## Socials

Instagram and LinkedIn are links; **Discord** (`scorpy_yy`) is a click-to-copy button (there's no public Discord profile URL) — clicking it copies the handle and shows "Copied ✓".

The stats in the About section (50+, 20+, 100%) are reasonable starters — edit the `data-count` values in `index.html` → `#about` to match your real numbers.

## Your logo

The scorpion "scorpy" logo is `assets/scorpion-logo.png` — brand-red on a transparent background (great for the site, socials, invoices, watermarks). It's used in the nav and preloader. To swap it, replace that file (keep the transparent background); the site sizes it by height and adds the red glow automatically.

## Adding project images

1. Put images in `assets/work/` (recommended: 1200×900px, `.jpg`/`.webp`).
2. Each card already points to a file via `style="--img:url('assets/work/poster-1.jpg')"` — just match the filenames or edit them.
3. The placeholder label (POSTER / ALBUM / etc.) sits under the image and fades once a real image loads.

## Wiring the contact form

The form currently runs a front-end demo. To receive real messages, edit `initForm()` in `js/main.js`:
- **Formspree**: set the `<form action="https://formspree.io/f/xxxx" method="POST">` and remove the demo `setTimeout`.
- Or POST to your own endpoint / email service.

## Branding

- Colors live as CSS variables at the top of `css/styles.css` (`--red`, `--bg`, etc.) — change them in one place.
- Fonts: Orbitron (display), Space Grotesk (body), JetBrains Mono (labels). Swap in `index.html` `<link>` + `--font-*` vars.

## Notes

- Fully responsive (375 / 768 / 1024 / 1440).
- Respects `prefers-reduced-motion` (disables heavy animation for accessibility).
- Keyboard accessible with visible focus states.
