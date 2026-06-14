# Binary Fusion Website — Design System (inherited by every session)

Static multi-page marketing site. No frameworks, no build step, no libraries.
Source of truth for ALL copy: `docs/binary-fusion-website-copy.md` — verbatim, never
paraphrase or invent. Strategy/blueprints: `docs/binary-fusion-website-strategy.md`.
Full build brief lives in the original prompt; this file distills the design law.

## Stack & layout

- Semantic HTML5 · one stylesheet `assets/css/styles.css` · one JS file `assets/js/main.js` (total JS ≤14KB).
- Inter (Google Fonts) 400/500/600, `display=swap`. Clean folder URLs (`/work/t-ranz/index.html`).
- Root-relative paths (`/assets/...`). Preview with a local server, not `file://`.

## Tokens (do not invent values)

```
--ink #0B1220 · --paper #FAFAF7 · --surface #FFFFFF · --slate #5B6472
--brand-azure #00B1FF  (decoration ONLY, never text)
--brand-blue  #007ABF  (--accent: buttons & UI)
--brand-deep  #0046A6  (accents on dark)
--accent-text #006DA9  (inline links on paper)
--brand-gradient 135deg azure→blue 55%→deep — ONLY on: orbs, glow behind frames in
  dark sections, logo. NEVER buttons/text/cards.
--border rgba(11,18,32,.08) · radius: card 14px, btn 10px · container 1240px · prose 68ch
Spacing scale ONLY: 8 16 24 32 48 64 96 128 160
```

## Type

Body 18px/1.7 `--slate` on `--paper`; headings `--ink` w600.
H1 `clamp(2.6rem,5vw,4.75rem)`/1.04/−0.02em · H2 `clamp(1.6rem,3vw,2.4rem)`/1.15.
Eyebrow 13px uppercase ls .08em w500 slate. Paragraphs `max-width:68ch`, left-aligned
(center only hero headline + closing CTA). `text-wrap: balance` headings / `pretty` paras.

## Glass (chrome layer ONLY)

`.glass`: rgba(255,255,255,.55) + blur(20px) saturate(160%) + rgba-white border +
inset highlight. `.glass--dark`: white .08 bg / .16 border. `@supports not` fallback
to near-opaque. **Allowed:** capsule nav + drawer, mobile sticky CTA bar, hero
stat/badge chips, secondary buttons on ambient/dark, screenshot-frame toolbars.
**Banned:** anything holding body copy, forms, FAQ, case content. **Caps:** ≤3 blur
surfaces per viewport; blur 12px on mobile.

## Aesthetic direction (owner-approved, overrides parts of original brief)

Richer + bluer than the original "quiet" spec, but NOT a full dark theme.
- **Hero = light (current, owner-approved)**: soft #F4F9FE→paper tint bg + faint azure
  corner glow, ink H1 (`Inter 700`, ~clamp 2.4→4rem, 3-line break), slate eyebrow,
  light-glass chips, Clutch badge, sweep-fill CTAs (pure-round 46px arrow circle, white
  on primary / blue on secondary), and the **3D brand mark** large on the right, right
  edge aligned to the nav. NO subtitle. Headline copy: "Where global enterprises forge
  what's next." (Dark variant B still exists, toggled `?hero=light` reversed — kept for
  reference, not default.)
- **3D brand mark**: static PNG extracted from the 3D APNG source in `/3D/`
  (`binary-fusion-mark-3d-static.png` gloss-blue · `-crystal-static.png` frosted-white).
  Motion is code-driven, NOT the old inline SVG: CSS keyframe idle sway + JS mouse-tilt
  toward cursor + cursor-follow drop-shadow light + hover scale/glow. transform/opacity
  + filter only, frozen on reduced-motion. Source is 1024px → keep display ≲ that; a
  2048px re-export is the fix for crisp retina at large sizes.
- **Body = light but richer**: `.section--tint` (soft #F4F9FE→paper gradient + faint
  azure corner accent) on alternating light sections for rhythm; icon tiles
  (`.card-icon`, 48px rounded square, rgba brand-blue bg, 1.5px line SVG) on
  differentiators/feature blocks. Cards stay opaque.
- **Dark sections** stay exactly two in the body: FRA flagship + closing CTA.
- **Clutch badge**: third-party brand mark — Clutch red `#E62415` stars are the ONE
  sanctioned hue exception, badge only.
- Expanding service panels section retained on Home ("What we do").

## Motion — orchestrated moments, sitewide

1. **Living hero** (Home): 3 drifting orbs (blur 80px, opacity .22–.32, 36/44/52s,
   transform-only), staggered copy fade-up (80ms steps), frames rise then idle float
   ±6px/6s. Closing CTA reprises orbs at .12–.18 over ink.
2. **Auto-pan** featured FRA screenshot (dark Home section + case heroes): slow
   translateY loop ~26s with 2s end-holds, pauses on hover/focus.
3. **Process line draw**: SVG stroke-dashoffset mapped to scroll; numbers tick
   slate→brand-blue. No-JS/reduced-motion: fully drawn.

Everything else micro: reveals (fade + 16px rise, 220ms, once, ≤3 staggered children),
card hover (border darken + 2px lift + img scale 1.04/400ms), arrow nudge 4px, button
darken 8%/150ms. Animate ONLY transform/opacity. `prefers-reduced-motion`: everything
static, layout identical.

## Sections & components

- Section padding 128px desktop / 72px mobile — identical everywhere; flat selector
  specificity so components can't cancel it.
- Backgrounds: paper default; `--ink` ONLY: case-study heroes, Home featured-work,
  closing CTA. Never two dark sections adjacent.
- Cards: surface, 1px border, 14px radius, 32px padding, NO shadows. Grids ≤4→2→1.
- Buttons: primary accent/white; secondary 1px border ink (glass variant on
  ambient/dark). No third style.
- Screenshot frame: 36px toolbar #F1F1EE, three 10px dots #E3E3DF, 12px radius,
  1px border; the ONLY box-shadow on the site.
- Stats static (never counters). Quote 28–32px w400 ink, no giant glyphs.
- FAQ: native `<details>/<summary>`. Footer: paper, top border, 14px.
- Expanding service panels (`.xpanels`, Home "What we do"): horizontal accordion,
  opaque surface panels, vertical-label rails + plus circle, one open at a time.
  Owner-approved exception: flex-grow transition 280ms (layout anim, this component
  only). <1024px: stacked, always expanded, no accordion. Never add carousel arrows
  or autoplay.

## NEVER (any violation fails the build)

Glass on content · gradient/glowing text · 4th blur surface · animated counters ·
parallax · scroll-jack · carousels · cursor effects · emoji · icon libraries (ceiling:
rare inline SVG, 1.5px stroke, slate) · hues outside the 3 blues + ink/paper/slate ·
shadows off screenshot frames · radius >16px except capsule/chips · ALL-CAPS body ·
centered paragraphs · stock photos/blobs · lorem ipsum · a 4th motion moment ·
cream+serif+terracotta / near-black+acid / broadsheet-hairline drifts.

## Placeholders & images

`[FILL]/[CONFIRM]` markers: never render; omit sentence if claim can't stand without
the number; leave `<!-- TODO: … -->` in place AND log in `TODO.md` (path + section).
Screenshots: `/assets/img/work/{fra-dashboard,fra-aptitude,fra-cognify,
fra-personality,tranz-dashboard,tranz-vehicles,tranz-report,pqm-platform,
realbex-platform,dosheats-app}.png` — until real files exist, inline-SVG placeholder
(#EFEFEC, 1px border, 14px slate filename label, 16:9). Alt text from copy-doc captions.
Logo missing → text wordmark "Binary Fusion" w600 brand-blue, 26px-height slot.

## SEO

Per-page title/description verbatim from the SEO META table at the end of the copy
doc. Canonical `https://binary-fusion.com`. OG + twitter:card. JSON-LD: Organization
(Home, 3 offices), FAQPage where FAQs exist, BreadcrumbList on case studies. One h1.

## Status / build order

Home first → owner reviews in browser → FRA case study (template) → pause →
remaining pages → sitemap.xml/robots/404/favicon/TODO.md → acceptance checklist.
Check `TODO.md` for open fills before claiming any page done.
