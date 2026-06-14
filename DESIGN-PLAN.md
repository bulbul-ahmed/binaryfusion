# DESIGN PLAN — Binary Fusion (written before code)

## Hero wireframe — desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│            ╭──────────────────[ glass capsule nav ]──────────────────╮   │
│            │ Binary Fusion   Services▾ Work How-We-Work About Insights│  │
│            │                                          [Book a call]  │   │
│            ╰────────────────────────────────────────────────────────╯    │
│                                                                          │
│   (orb A: azure, top-right,            . . . drifting atmosphere . . .   │
│    behind screenshots)                       (orb B: deep, mid-right)    │
│                                                                          │
│  CUSTOM SOFTWARE DEVELOPMENT  ← eyebrow            ┌─────────────-──┐    │
│                                                    │ ○○○  rear frame │   │
│  We build the software                         ┌───┴──────────────┐ │    │
│  your business runs on.   ← H1 (55% col)       │ ○○○  front frame │ │    │
│                                                │  fra-dashboard   │─┘    │
│  Web platforms, mobile apps, and SaaS…         │  (tranz behind,  │      │
│                                                │   up-right, .94) │      │
│  [Book an intro call] [See the work]           └──────────────────┘      │
│                                                  ← gradient glow under   │
│  ╭─[ glass chip row — ONE glass surface ]─╮                              │
│  │ ★ 5.0 on Clutch │ Laravel │ AWS Cert.  │     (orb C: blue, low-left,  │
│  ╰─────────────────────────────────────────╯      faint, under copy)     │
└──────────────────────────────────────────────────────────────────────────┘
```

## Hero wireframe — mobile (375px)

```
┌──────────────────────────┐
│ ╭─[capsule: logo  ☰]──╮  │
│ ╰──────────────────────╯ │
│                          │
│   CUSTOM SOFTWARE DEV.   │   ← copy centered (hero only)
│   We build the software  │
│   your business runs on. │
│   Web platforms, mobile… │
│   [Book an intro call]   │
│   [See the work]         │
│  ╭─[ chip row, wraps ]─╮ │
│  ╰─────────────────────╯ │
│  ┌────────────────────┐  │
│  │ ○○○ single frame   │  │   ← fra-dashboard only, float OFF
│  │  fra-dashboard     │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

## Orb placement & motion

| Orb | Color        | Size  | Position (hero)            | Loop                          |
|-----|--------------|-------|----------------------------|-------------------------------|
| A   | azure #00B1FF| 640px | top: -12%, right: -6%      | 36s, translate ±8%, scale→1.12|
| B   | deep #0046A6 | 720px | top: 34%, right: 14%       | 52s, translate ±10%, scale→1.08|
| C   | blue #007ABF | 520px | bottom: -18%, left: -8%    | 44s, translate ±6%, scale→1.10|

Biased right, toward the screenshot side, so the capsule nav and chips have color to
refract. Opacities .22–.32, blur 80px, `aria-hidden`, pure CSS, parent `overflow:hidden`.
Closing CTA reprises orbs A+C over `--ink` at .12–.18 opacity.
Review aid: `?orbs=2x` query param halves all three durations.

## Load sequence (one-time, on first paint)

1. eyebrow        — fade-up 320ms ease-out, delay 0ms
2. H1             — delay 80ms
3. subline        — delay 160ms
4. button row     — delay 240ms
5. chip row       — delay 320ms
6. screenshot duo — rise 480ms, delay 420ms → then idle float (±6px, 6s, infinite alternate)

Orbs are already drifting underneath from frame one — the atmosphere never "starts".
`prefers-reduced-motion`: every item static and visible, float and drift off.

## Signature element — how it will actually be executed

The hero is built as three stacked layers inside one `position:relative` section: the
atmosphere (three blurred divs, GPU-only transforms, desynced 36/44/52s loops so the
pattern never visibly repeats), the content grid, and the floating glass capsule nav
pinned above it all. The capsule is the only fixed chrome on the page, so its blur is
always refracting whatever scrolls beneath it — orbs in the hero, paper in the body,
ink in the featured section — which is what makes the glass read as *material* rather
than decoration. The screenshot duo is the hero's anchor: real browser-chrome frames,
the rear one offset up-right and scaled to .94, a single soft brand-gradient glow
behind them (the only gradient use on the page besides the orbs), and the site's only
box-shadow. After load they breathe on a 6-second float that is slow enough to feel
like weight, not animation.

## Self-critique (required pass)

**What read as default-agency on first draft, and what changed:**

1. *Default:* my first instinct was orbs scattered symmetrically around the hero
   (one top-left, one top-right, one bottom-center) — the generic "aurora hero".
   *Revised:* all three biased toward the screenshot side per the brief, so the
   atmosphere has a direction and the glass chips actually cross color boundaries.
2. *Default:* chip row as three separate glass pills — pretty, but burns the
   3-blur-surface budget on one element. *Revised:* one glass capsule containing
   three stat items with hairline dividers — one blur surface, and it visually
   rhymes with the nav capsule above it.
3. *Default:* secondary hero button as `.glass`. *Revised:* translucent white +
   border with **no** backdrop-filter — visually consistent, keeps the viewport
   blur count at 2 (nav + chips) with headroom for the open services dropdown.
4. *Default:* centered hero. *Revised:* left editorial split (55/45) per brief —
   centered heroes are the #1 template tell; the offset screenshot pair gives the
   composition the asymmetry that reads as designed.
5. *Default:* section dividers/hairlines between every section. *Revised:* none —
   rhythm comes from identical 128px padding and the three planned ink sections.

Blur-surface audit per viewport: hero = nav + chips (+ dropdown when open) = 3 max.
Dark featured section = nav only. Closing CTA = nav + glass--dark secondary = 2. Pass.
