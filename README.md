# London Weekend Guide

An Astro-based static site for a manually curated London weekend guide. The homepage always renders the current edition, while `/weekends/[slug]` supports direct links and future archive growth without changing the template structure.

## Stack

- Astro static site output
- TypeScript content modules
- Zod validation for build-time content integrity
- Vitest for content and build verification

## Project Structure

- `src/data/weekends/`: one file per weekend issue
- `src/data/schema.ts`: central content schema and reference validation
- `src/pages/index.astro`: current weekend route
- `src/pages/weekends/[slug].astro`: archive-capable static route
- `tests/`: content validation and static build checks

## Local Commands

Use the bundled runtimes in this Codex environment or your local Node.js install.

```bash
pnpm install
pnpm test
pnpm build
```

## Weekly Update Workflow

1. Duplicate an existing file in `src/data/weekends/` and rename it to the new weekend slug.
2. Update the editorial copy, event list, and section references in that file only.
3. Register the new issue in `src/data/weekends/index.ts`.
4. Change `currentWeekendSlug` to publish the new weekend on `/`.
5. Run tests and build before deployment.

## Content Rules

- Keep exactly three `featuredPickIds`.
- Every `featuredPickIds` entry and `section.eventIds` entry must match a real `event.id`.
- Optional fields such as `url`, `price`, `tags`, `editorialHighlight`, `neighbourhoodNote`, and `weatherTip` may be omitted.
- Weather and travel guidance are editorial copy in v1, not computed data.

## Deployment

Build the site as static output and publish the generated `dist/` directory as a separate site deployment.
