# ANZ NZ Personal Homepage — Migration Plan

## Goal
Migrate the AEM Edge Delivery Services target page **https://www.anz.co.nz/personal/** into this EDS project, faithfully reproducing ANZ's brand (colors, typography, spacing), and recreating the **header** and **footer** — including the mega-menu navigation and footer link structure — as closely as possible.

## Scope
- **Pages:** Homepage only (`/personal/`) as the migration target.
- **Header/Footer fidelity:** Match closely — recreate the ANZ header (logo, primary nav, mega-menu behavior, utility links, search/login) and the full footer (link columns, legal, social) with their interactions.
- **Out of scope (this pass):** Inner pages (accounts, cards, home loans, etc.), forms, and commerce/product flows.

## Approach & Assumptions
- This is an EDS **doc/da**-style project (content served via `content.da.live/rajankumar05/demo-anz/`). Content is generated only via the bundled import script + `run-bulk-import.js` — never hand-authored HTML.
- Existing blocks available to build on: `cards`, `columns`, `footer`, `fragment`, `header`, `hero`, `widget`.
- Header/footer are instrumented as their own blocks (nav fragment + footer fragment), separate from the homepage body.
- Preview verification uses the local preview; every PR needs a `{branch}--demo-anz--rajankumar05.aem.page/{path}` link.

## Checklist

### Phase 1 — Discovery & Analysis
- [ ] Scrape `https://www.anz.co.nz/personal/` (content, metadata, images, cleaned HTML) via the scrape skill
- [ ] Extract the ANZ **design system**: brand colors, typography/fonts, spacing scale, button styles → design tokens for `styles/styles.css`
- [ ] Analyze homepage structure: identify sections, content sequences, and candidate block variants
- [ ] Separately capture header structure (logo, primary nav items, mega-menu contents, utility/login/search) with screenshots + hover states
- [ ] Separately capture footer structure (link columns, legal text, social icons)

### Phase 2 — Design System Setup
- [ ] Apply extracted brand tokens (colors, fonts, spacing) to `styles/styles.css`
- [ ] Verify base typography and color palette render on-brand in preview

### Phase 3 — Header / Navigation
- [ ] Instrument the `header` block to match ANZ nav (primary links + mega-menu behavior, desktop & mobile)
- [ ] Style header to match ANZ branding; verify hover/click interactions in preview

### Phase 4 — Footer
- [ ] Build/instrument the `footer` block with ANZ's link columns, legal, and social content
- [ ] Style footer to match; verify appearance vs. original in preview

### Phase 5 — Homepage Body Migration
- [ ] Map identified homepage sections to blocks (hero, cards, columns, widgets, etc.); name any new variants
- [ ] Generate import infrastructure (parsers + transformers) for the homepage template
- [ ] Generate & run the bundled import script to produce homepage content
- [ ] Style migrated blocks to match the original per-section (block design pass)

### Phase 6 — Verification & Delivery
- [ ] Preview the full page locally; visually critique homepage, header, and footer against the original ANZ page and iterate
- [ ] Confirm responsive behavior (desktop + mobile)
- [ ] Publish content to Document Authoring and open a PR with the required preview link

---
*This plan is ready to execute. Approving it (Execute mode) will begin with Phase 1 discovery — scraping the ANZ page and extracting its design system. Note: some source pages are bot-protected; if the standard scrape is blocked, the fallback scraper will be used.*
