# TODO — open fills, confirms, and wiring

Every `[FILL]`/`[CONFIRM]` marker omitted from rendered pages is logged here with its
location. Nothing bracketed is visible on any page. Resolve before publishing.

## Global (header / footer — affects every page)

- [ ] **Insights destination** — nav + footer + insights teaser currently link to
      `https://blog.binary-fusion.com`. Confirm: blog subdomain or move under `/insights`.
      (`index.html` — header nav, drawer, footer Company column, Section 10)
- [ ] **Clutch profile URL** — badge links to `https://clutch.co/profile/binary-fusion`
      (guessed). Confirm real profile URL. (`index.html` — footer badges)
- [ ] **[FILL: UK office, if listing]** — omitted from footer offices row.
      (`index.html` — footer offices)
- [x] **Brand assets** — `logo-cropped.svg` installed (nav, 26px); `favicon.svg`
      derived from the logo's circular icon mark. Note: provided logo SVG contains a
      stray zero-area red polygon (`fill:#B70000`) — invisible, left as-is in the
      logo, dropped from the favicon. Square `icon.png` still welcome for app-icon
      uses but not required.

## Home `/index.html`

- [ ] **[FILL: retention stat if available]** — omitted from "We stay after launch."
      block. (Section 6 — Differentiators)
- [ ] **[CONFIRM: remove anything you don't want public]** — technology strip renders
      the full stack list from the copy doc. (Section 9 — The stack we ship with)
- [ ] **Insights teaser** — copy doc asks for "three latest posts, titles + dates only";
      no posts available, section renders heading + All insights link only. Wire feed
      or hardcode three real titles. (Section 10)
- [ ] **og:image** — points at `/assets/img/work/fra-dashboard.png` which is still a
      placeholder slot. (head)

## Screenshots — `/assets/img/work/` (all pages)

All ten slots render inline-SVG placeholders until real files are dropped in, then
swap each placeholder `<svg>` for the commented `<img>` (explicit width/height, lazy
below the fold):

- [ ] `fra-dashboard.png` — home hero (front frame), featured auto-pan, what-we-build card, og:image
- [ ] `tranz-dashboard.png` — home hero (rear frame)
- [ ] `tranz-vehicles.png` — what-we-build card
- [ ] `pqm-platform.png` — what-we-build card
- [ ] `dosheats-app.png` — what-we-build card
- [ ] `fra-aptitude.png` · `fra-cognify.png` · `fra-personality.png` ·
      `tranz-report.png` · `realbex-platform.png` — used on case-study pages (not built yet)

## Deferred to later build phases (per build order)

- [ ] Contact form endpoint (`action="#"`, client-side validation only) — when
      `/contact/` is built
- [ ] `sitemap.xml`, `robots.txt`, `404.html` — build order step 8
- [ ] Remaining copy-doc markers on unbuilt pages (case studies, services, How We
      Work, About, Contact) — logged when each page is built
