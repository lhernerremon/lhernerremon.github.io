# lhernerremon.github.io

Personal blog built with Nuxt 4 and static content.

## Stack

- **Nuxt 4** with `app/` directory convention
- **@nuxt/ui v4** — UI components (primary: sky)
- **@nuxt/content v3** — Markdown blog posts with typed frontmatter
- **@nuxt/icon** + `@iconify-json/mdi` — MDI icons
- **dayjs** — locale `es`, timezone `America/Lima`
- **ESLint 10** with `@nuxt/eslint`

## Setup

```bash
npm install
```

## Development

```bash
npm run dev      # http://localhost:3010
npm run lint     # ESLint (zero warnings)
```

## Build

```bash
npm run build     # Production build
npm run generate  # Static site generation
npm run preview   # Preview production build
```

## Blog posts

Posts are Markdown files in `content/blog/`. Required frontmatter:

```yaml
---
title: string
description: string
date: YYYY-MM-DD
time: string        # e.g. "5 min"
author: string
tags:               # optional
  - tag1
---
```
