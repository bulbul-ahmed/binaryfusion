# BUILD PROMPT — Binary Fusion Marketing Website (FINAL · single source of truth)

This file supersedes all earlier prompt or addendum files. If `docs/motion-and-glass-addendum.md` exists, ignore it — everything is merged here.

## Mission

Build the complete production marketing website for Binary Fusion, a custom software development company. Two documents in `docs/` are the source of truth — read BOTH fully before writing any code:

- `docs/binary-fusion-website-strategy.md` — positioning, sitemap, page blueprints (Phases 1–4)
- `docs/binary-fusion-website-copy.md` — final copy for every page (Phase 5)

**Copy rule:** use the copy document verbatim. Do not rewrite, paraphrase, expand, or invent marketing text. The italic *(parenthetical notes)* in the copy doc are layout directions, not text to render. Your job is engineering and visual design.

**Design intent in one line:** Liquid Glass the way Apple uses it in iOS — glass is the *floating control layer* over a softly moving brand-colored atmosphere, while all content sits on opaque, highly readable surfaces. Quiet, premium, enterprise. When in doubt, remove.

## Stack & structure

Static multi-page site: semantic HTML5, one shared stylesheet, one small vanilla JS file. No frameworks, no build step, no Tailwind, no icon fonts, no animation libraries (no GSAP/Lottie/AOS). Font: **Inter** via Google Fonts, weights 400/500/600, `display=swap`. Clean folder URLs — every page is `index.html` in its folder.

```
/index.html
/services/index.html
/services/{custom-software-development, mobile-app-development, ui-ux-design, ai-development, team-augmentation}/index.html
/work/index.html
/work/{fire-recruitment-australia, t-ranz, pqm-nstn, realbex, dosheats}/index.html
/solutions/training-and-assessment-platforms/index.html
/how-we-work/index.html   /about/index.html   /contact/index.html
/404.html                 /styleguide.html  (unlinked, shows every component)
/assets/css/styles.css    /assets/js/main.js
/assets/img/brand/        ← logo-cropped.svg + icon.png live here
/assets/img/work/         ← screenshot slots (see Images)
/sitemap.xml  /robots.txt  /favicon.svg   TODO.md
```

---

## DESIGN SYSTEM

### 1. Brand tokens (extracted from the real logo, contrast-verified)

```css
:root {
  --ink:     #0B1220;  --paper: #FAFAF7;  --surface: #FFFFFF;  --slate: #5B6472;
  --brand-azure: #00B1FF;  /* light logo stop — DECORATION ONLY, never text (2.3:1) */
  --brand-blue:  #007ABF;  /* wordmark blue — primary buttons & UI (4.63:1 on white, AA) */
  --brand-deep:  #0046A6;  /* dark logo stop — accents on dark sections (8.65:1) */
  --accent: var(--brand-blue);
  --accent-text: #006DA9;  /* inline text links on paper (5.58:1, AA) */
  --brand-gradient: linear-gradient(135deg, var(--brand-azure), var(--brand-blue) 55%, var(--brand-deep));
  --border: rgba(11,18,32,0.08);
  --radius-card: 14px;  --radius-btn: 10px;
  --container: 1240px;  --prose: 68ch;
  /* spacing scale (8px base): 8 16 24 32 48 64 96 128 160 — no other values */
}
```

`--brand-gradient` is permitted ONLY on: the ambient atmosphere shapes, the soft glow behind screenshot frames in dark sections, and the logo itself. Never on buttons, text, or card surfaces. The nav logo is `/assets/img/brand/logo-cropped.svg` at 26px height (fallback if missing: the text "Binary Fusion", weight 600, `--brand-blue`).

### 2. Typography & readability (the heart of the brief)

Body 18px / line-height 1.7 / `--slate` on `--paper`. Headings `--ink`, weight 600. H1 `clamp(2.6rem, 5vw, 4.75rem)`, line-height 1.04, letter-spacing −0.02em. H2 `clamp(1.6rem, 3vw, 2.4rem)`, line-height 1.15. Eyebrows 13px uppercase, letter-spacing 0.08em, weight 500, `--slate`. **Every paragraph capped at `max-width: var(--prose)`.** Body text always left-aligned — center only hero headlines and the closing CTA. `text-wrap: balance` on headings, `pretty` on paragraphs. Generous paragraph spacing (1.25em).

### 3. The glass material (the chrome layer)

```css
.glass {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 32px -12px rgba(11,18,32,0.12);
}
.glass--dark { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.16); }
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: rgba(255,255,255,0.92); }
  .glass--dark { background: rgba(255,255,255,0.10); }
}
```

**Glass ALLOWED on exactly:** the floating capsule nav + mobile drawer · the mobile sticky "Book an intro call" bar · hero stat chips and badge chips · secondary buttons on ambient/dark backgrounds · screenshot-frame toolbar strips.
**Glass BANNED on:** any card or surface holding body copy · forms and inputs · FAQ · case-study content. Content always sits opaque.
**Hard caps:** ≤3 backdrop-filter surfaces per viewport; blur drops to 12px on mobile.

### 4. The signature element — spend all boldness here

The one thing this site is remembered by: **the living hero** — a floating glass capsule nav over a slowly drifting atmosphere in the brand's own blues, with real product UI rising into view. Everything after the hero is quiet and disciplined; this is where craft concentrates.

**Atmosphere (hero + closing CTA only).** Three absolutely-positioned circles, 480–720px, `filter: blur(80px)`, opacity 0.22–0.32, colors azure/blue/deep, biased toward the screenshot side of the hero so the glass has color to refract. Each on its own transform keyframe loop (translate ±6–10%, scale 1↔1.12), durations **36s / 44s / 52s**, ease-in-out, infinite alternate — desynced so no loop is ever visible. Parent `overflow:hidden`; orbs `aria-hidden`, `will-change: transform`, pure CSS. The closing CTA block reprises this at 0.12–0.18 opacity over `--ink`.

**Capsule nav.** A floating glass capsule, not a full-width bar: max-width `var(--container)`, 16px top margin, `border-radius: 999px`, 12px vertical padding. Logo left, links center-right, primary button right. Mobile: capsule shrinks to logo + menu; drawer is a full-screen `.glass` panel, 24px links.

**Hero composition (desktop).** Left-aligned editorial split — copy column ~55% (eyebrow → H1 → subline → two buttons → glass chip row), screenshot composition ~45%: two browser-framed screenshots, the rear one offset up-right and slightly scaled down, the front one overlapping it — both with the only shadow on the site (`0 24px 48px -24px rgba(11,18,32,0.18)`) and a faint `--brand-gradient` glow behind. Load sequence: copy elements fade-up in 80ms stagger (320ms each, ease-out), then the frames rise (480ms) and settle into a gentle idle float (`translateY` ±6px, 6s, ease-in-out, infinite). Mobile: stacks, copy centered, single screenshot, float disabled.

### 5. Two supporting set pieces — and nothing more

**Featured case auto-pan (dark Home section + case-study heroes).** The FRA screenshot is taller than its frame and pans slowly upward on loop: translateY keyframes, 10–12s per pass, 2s hold at each end, pauses on hover/focus. Faint gradient glow behind the frame.

**Process line draw.** In the four-step process strip (a true sequence, so numbering is honest), a 2px SVG line draws from 01→04 via `stroke-dashoffset` mapped to scroll progress (~30 lines of JS on the existing IntersectionObserver); step numbers tick from `--slate` to `--brand-blue` as the line reaches them. No-JS/reduced-motion: renders fully drawn.

These three (hero, auto-pan, line draw) are the complete set of orchestrated motion. Everything else is micro: scroll-reveals (fade + 16px rise, 220ms, once, max 3 staggered children), card hover = border darkens + 2px lift + inner screenshot scales 1.0→1.04 over 400ms, arrows nudge 4px, buttons darken 8% in 150ms. Tech-stack strip stays static.

### 6. Section construction & components

- Section padding **128px desktop / 72px mobile**, identical everywhere — the rhythm is what reads as clean. One idea per section: optional eyebrow → heading → ≤1 supporting paragraph → content.
- Backgrounds: `--paper` default. `--ink` for exactly three: case-study heroes, the featured-work Home section, the closing CTA. Never two dark sections adjacent.
- Cards: `--surface`, 1px `--border`, 14px radius, 32px padding, no shadows. Grids ≤4 columns → 2 → 1, gap 24–32px, equal heights.
- Buttons: primary = `--accent` bg, white text, 10px radius, 14px/24px padding; secondary = 1px border, `--ink` text (`.glass` variant on ambient/dark). No third style.
- Screenshot frame: CSS browser chrome — 36px top bar `#F1F1EE`, three 10px dots `#E3E3DF`, 12px radius, 1px border.
- Stat blocks: 40–48px number weight 600 `--ink`, 14px `--slate` label, small source line. **Static numbers — never animated counters.**
- Quote block: 28–32px weight 400 `--ink`, attribution 15px `--slate`. No giant quote glyphs.
- FAQ: native `<details>/<summary>`, 1px bottom borders, plus/minus indicator, generous padding.
- Footer: `--paper`, 1px top border, columns per copy doc, badges row, 14px text.

### 7. NEVER list — violating any of these fails the build

Glass on content cards or anything with body copy · gradient or glowing text · a fourth glass surface in a viewport · animated number counters · parallax scrolling · scroll-jacking · auto-playing carousels · cursor effects · emoji · icon libraries (a rare inline SVG line-icon at 1.5px stroke `--slate` is the ceiling) · any hue outside the three brand blues + ink/paper/slate · box-shadows anywhere except screenshot frames · border-radius above 16px except the nav capsule and chips · ALL-CAPS body text (eyebrows only) · centered paragraphs · stock photos or illustration blobs · lorem ipsum · a fourth orchestrated motion moment.

Calibration: do not drift toward the generic AI looks — cream + serif + terracotta, near-black + acid accent, or broadsheet hairlines. This site's look is defined above; follow it exactly.

### 8. Performance & accessibility budget

Animate only `transform` and `opacity` — never blur radius, shadow, or layout properties. Total JS ≤ 14KB, no libraries. Orbs are plain styled divs painted with the hero; hero screenshots `loading="eager"`, everything below the fold lazy with explicit width/height. Every animation respects `prefers-reduced-motion: reduce`: orbs frozen, float off, auto-pan static, line pre-drawn, reveals become plain opacity. WCAG AA contrast, visible `:focus-visible`, skip-link, semantic landmarks, drawer and FAQ keyboard-operable, tap targets ≥44px. Watch CSS specificity — section padding rules must not be cancelled by component selectors.

---

## Images

`/assets/img/work/` expects these exact filenames (the owner will drop real screenshots in):

```
fra-dashboard.png  fra-aptitude.png  fra-cognify.png  fra-personality.png
tranz-dashboard.png  tranz-vehicles.png  tranz-report.png
pqm-platform.png  realbex-platform.png  dosheats-app.png
```

Until real files exist, generate a quiet inline-SVG placeholder per slot: `#EFEFEC`, 1px border, centered 14px `--slate` filename label, 16:9. Alt text comes from the captions in the copy doc. Favicon: derive from `/assets/img/brand/icon.png` if present, else minimal "BF" SVG in `--ink`.

## Placeholders in the copy

The copy contains `[FILL: …]` and `[CONFIRM: …]` markers. If a marker sits inside a stat or claim that can't stand without the number, omit that sentence entirely (the copy is written to survive this); otherwise render the surrounding copy without the bracketed text. For every marker: add `<!-- TODO: [marker text] -->` at the spot AND log it in `TODO.md` with file path and section. Nothing bracketed may ever be visible on a page. Contact form: `action="#"`, client-side validation only, `<!-- TODO: wire form endpoint -->`, logged in TODO.md.

## SEO & head

Per-page `<title>` + meta description from the **SEO META table** at the end of the copy doc — exact text. Canonical URLs (`https://binary-fusion.com`), Open Graph + twitter:card (case studies use their hero screenshot as og:image). JSON-LD: `Organization` with the three offices on Home; `FAQPage` wherever an FAQ section exists; `BreadcrumbList` on case studies. Generate `sitemap.xml` and `robots.txt`. One `<h1>` per page.

---

## Build order — follow exactly

1. Read both docs in `docs/` end to end.
2. **Write a short design plan before any code** — in `DESIGN-PLAN.md`: the hero as an ASCII wireframe (desktop + mobile), orb placement, the load-sequence order, and one paragraph on how the signature element will be executed. Then self-critique it: if any part reads like the default you'd produce for any agency site, revise it and note what changed. Only then build.
3. Write `CLAUDE.md` distilling this design system (tokens, glass rules, section rules, NEVER list) so future sessions inherit it.
4. Build `assets/css/styles.css` (tokens, base type, components) and `/styleguide.html` rendering every component — including the glass capsule, chips, screenshot frame, and a live atmosphere swatch. Verify spacing and contrast there first.
5. Build the **Home page** completely, signature hero included. **Then STOP and tell me to review it in the browser before building anything else.** Expect iteration on the hero — offer me the orbs at production speed and at 2× so I can choose.
6. After my approval: build the **Fire Recruitment Australia case study** as the case-study template (with the auto-pan hero). Pause briefly.
7. Build all remaining pages from the sitemap. Nav and footer byte-identical across pages; all internal links resolve.
8. Generate `sitemap.xml`, `robots.txt`, `404.html`, favicon, and the complete `TODO.md`.
9. Final pass: run the acceptance checklist against every page and fix failures before reporting done.

## Acceptance checklist (per page)

- [ ] Copy matches the copy doc verbatim; no invented text; no visible `[FILL]/[CONFIRM]`
- [ ] Section padding identical everywhere; spacing only from the scale; no specificity conflicts
- [ ] No paragraph exceeds 68ch; body left-aligned; headings balanced, no orphan words
- [ ] Glass only on chrome-layer elements; ≤3 blur surfaces per viewport; content always opaque; nothing from the NEVER list
- [ ] Nav, chips, and sticky CTA stay readable over every background they cross (screenshots, dark sections, orbs)
- [ ] `prefers-reduced-motion: reduce` emulated: nothing moves, layout identical, line drawn, everything readable
- [ ] Smooth scroll in a 6× CPU-throttled DevTools run; hero LCP unchanged with orbs `display:none`
- [ ] Title/meta/OG/JSON-LD correct; one h1; alt text + explicit dimensions on every image
- [ ] Keyboard: tab order sane, focus visible, drawer and FAQ operable; 375px width: no horizontal scroll, sticky CTA works
- [ ] Zero console errors; JS ≤14KB; no external requests except Google Fonts
