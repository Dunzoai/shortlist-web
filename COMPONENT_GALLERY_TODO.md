# Shortlist — Component Gallery + Template System TODO

> Started: May 18, 2026
> Status: Deferred — finish River Oaks demo first, then revisit.

## Why this exists

Right now every "cool thing" we build (Gia's spinning flower, Nito's arcade game, the
HOA typewriter hero, parallax patterns, etc.) lives buried inside its client folder.
When we sit down to build a new client, we forget what we already have and either
rebuild from scratch or pick whatever's top-of-mind.

The fix: an internal component gallery + a shared `/components/showcase/` folder where
the generalized, prop-driven versions live. Clients import from the gallery, pass their
own data.

This unlocks the spec-build play — reach out to 50 businesses, ship 10 demos fast,
because each demo is mostly prop-swapping into existing components.

---

## Decisions already made

- **Folder for shared components:** `/components/showcase/`
- **Gallery page:** `/app/lab/page.tsx` (internal, unlisted, no nav link)
- **Pattern:** Each showcase component takes props for content + branding,
  client pages pass in their data.
- **Open question — still need to decide:**
  - Option A: One component with a `mode` prop ("image" vs "svg-petals")
  - Option B: Shared base (`SpinningWrapper`) + two thin wrappers
    (`SpinningImage`, `SpinningPetals`)
  - Leaning toward Option B.

---

## Phase 1 — Spinning components (after River Oaks ships)

- [ ] Extract the River Oaks pizza hero spin logic into
      `/components/showcase/SpinningImage.tsx` — props: image src, rotation duration,
      center content (slot), background color
- [ ] Refactor `/clients/riveroaks/components/Hero.tsx` to use `SpinningImage`
- [ ] Look at `/clients/growwithgia/pages/HomePage.tsx` flower section and extract into
      `/components/showcase/SpinningPetals.tsx` — props: petal colors[], petal count,
      rotation duration, center content (slot)
- [ ] Refactor Gia's homepage to use `SpinningPetals`
- [ ] Verify both client sites still render identically after refactor

## Phase 2 — Gallery scaffold

- [ ] Create `/app/lab/page.tsx` — internal showcase page
- [ ] Each component entry shows:
  - Live render with sensible default props
  - Component name + one-line description
  - "Used on: [client list]" tags
  - Code snippet showing how to import + use
- [ ] List the two spinning components as the first entries
- [ ] Decide if `/lab` needs a password gate or is fine as obscure-url-only

## Phase 3 — Generalize other patterns

Each of these is a separate task. Do as needed, not all at once.

- [ ] Typewriter hero — pull from `/smartassistant/hoa` page → `TypewriterHero.tsx`
- [ ] Parallax scroll sections — pull from wherever it's first used → `ParallaxSection.tsx`
- [ ] Sticky scroll-reveal feature list — used on multiple client pages → `FeatureReveal.tsx`
- [ ] Modal/dialog patterns — Gia uses one for the Orton-Gillingham explainer → `ContentModal.tsx`
- [ ] Footer with contact + social — repeated across clients → `BrandedFooter.tsx`
- [ ] Sticky nav with brand colors — every client has one → `BrandedNav.tsx`

For each: add to `/components/showcase/`, refactor existing clients to use it,
add entry to `/lab`.

## Phase 4 — Template starter folders

Once we have enough showcase components, create starter templates per business type:

- [ ] `/templates/pizzeria/` — example HomePage.tsx + content/business.ts skeleton
      using SpinningImage hero, locations section, menu section, etc.
- [ ] `/templates/coffee-shop/` — for Tie-Dyed and future cafes
- [ ] `/templates/trades/` — HVAC/plumbing/electrical (different visual treatment, more
      "trustworthy" than "vibe-y")
- [ ] `/templates/salon/` — for personal services
- [ ] `/templates/restaurant/` — generic non-pizza restaurants

Each template is just: `pages/HomePage.tsx` + `content/business.ts` + `CLAUDE.md`
that documents the props and which showcase components it uses.

New client onboarding becomes: copy `/templates/[type]/` to `/clients/[slug]/`,
swap in their content, ship.

## Phase 5 — CLI for new clients

- [ ] Script that prompts: business name, slug, type, brand colors, content
- [ ] Copies appropriate template, generates `content/business.ts`, creates Supabase
      `web_clients` row, sets up preview route
- [ ] Target: 10-minute new client setup, end to end

---

## Notes / things to remember

- Don't refactor too aggressively. Some "cool things" only made sense in their
  original context and shouldn't be generalized just for the sake of it.
- Gallery should be useful for *us*, not pretty for clients. It's an internal tool.
- Each refactor must be verified — visit the client site before and after, confirm
  no visual regression.
- "Used on:" tags in the gallery are important. They let us see at a glance which
  components are battle-tested vs experimental.
