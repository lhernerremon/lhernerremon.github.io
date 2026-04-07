# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server on http://localhost:3010
npm run build      # Production build
npm run generate   # Static site generation
npm run preview    # Preview production build
npm run lint       # ESLint with zero warnings allowed
```

## Architecture

This is a **Nuxt 4** personal blog with static content, using the `app/` directory convention.

### Content layer

Blog posts live in `content/blog/*.md` and are typed via `content.config.ts`. Each post requires frontmatter: `title`, `description`, `date`, `time`, `author`, and optional `tags`. Content is queried with `queryCollection('blog')` — never with the old `queryContent()` API.

### Routing

- `/` — lists all blog posts ordered by date DESC
- `/blog/[slug]` — renders a single post using `ContentRenderer` with a right-side TOC via `UContentToc`

### UI stack

- **@nuxt/ui v4** for all layout primitives (`UApp`, `UContainer`, `UPage`, `UPageBody`, `UPageHeader`, etc.)
- **@nuxt/icon** with `@iconify-json/mdi` — use `mdi-*` icon names
- Colors configured in `app/app.config.ts`: primary `sky`, neutral `neutral`
- Global styles in `app/assets/scss/global.css`
- Page transitions defined in `app/app.vue` (blur + opacity, 0.2s)

### Key conventions

- Auto-imports are enabled for `composables/*/*.ts` and `stores/*/*.ts` (subdirectory pattern, not flat)
- dayjs is globally available with locale `es`, timezone `America/Lima`, and plugins: `utc`, `timezone`, `relativeTime`, `customParseFormat`
- Markdown code highlighting uses `one-dark-pro` theme; only `py` is explicitly registered — add other langs in `nuxt.config.ts` under `content.build.markdown.highlight.langs`
- `vite` is pinned via `overrides` to `>=7.3.2` (CVE path-traversal fix) — do not remove this
