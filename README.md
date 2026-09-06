# anmol.dev — portfolio

Personal site for Anmol Sethi. Next.js 16 (App Router) + Tailwind v4 + Motion,
statically exported. No database, no CMS, no API routes.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static output
```

## The one file you edit

`src/lib/content.ts` holds every word and number on the site — bio, projects,
experience, skills, metrics, marquee copy. Components read from it and contain no
hardcoded copy. Change a number there and it changes everywhere it appears.

## The live map

The circle punched into the "O" of PRODUCTS is not decoration. Every dot is one
real company from [ncrhiring.in](https://ncrhiring.in), plotted from its actual
coordinates:

- **Orange, solid** — address verified against Google Maps (268).
- **White, faint** — hiring in the city, address unconfirmed. Drawn differently on
  purpose; a guessed pin never gets shown as a verified one.

`src/lib/ncr-pins.json` is a build-time snapshot of that dataset. Regenerate it
from the map repo:

```bash
node -e "
const d=require('../delhi-ncr-startup-map/data/companies.json');
const pts=d.filter(c=>typeof c.lat==='number').map(c=>[+c.lat.toFixed(4),+c.lng.toFixed(4),c.approx?0:1,c.hiring?1:0]);
require('fs').writeFileSync('src/lib/ncr-pins.json',JSON.stringify({
  generated:new Date().toISOString().slice(0,10),
  total:d.length,
  verified:d.filter(c=>!c.approx).length,
  hiring:d.filter(c=>c.hiring).length,
  openJobs:d.reduce((s,c)=>s+(c.openJobs||0),0),
  startups:d.filter(c=>c.tier==='startup').length,
  pts}));
"
```

`PinOrb` draws it on canvas (1,760 DOM nodes is not a plan) with an
aspect-corrected equirectangular projection, so the cluster you see is NCR's real
shape — Gurugram bottom-left, Noida right, Delhi through the middle.

## Adding a photo

Drop a square headshot at `public/anmol.jpg`, then set `photo: "/anmol.jpg"` in
`src/lib/content.ts`. Until then the avatar renders an "AS" monogram.

## Design system

Tokens live at the top of `src/app/globals.css`.

| Token | Value | Rule |
|---|---|---|
| `--ink` | `#08080a` | page ground |
| `--accent` | `#ff5a1f` | the one loud colour |
| `--signal` | `#4ade80` | **live/verified data only** — if it's green, it's real |

Type: Bricolage Grotesque (display), Inter (body), Geist Mono (data and labels).
Numbers are always mono and tabular.

Everything respects `prefers-reduced-motion`: marquees stop, the orb skips its
reveal, smooth scrolling turns off.
