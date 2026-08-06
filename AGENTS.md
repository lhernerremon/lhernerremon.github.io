# Blog

Blog personal estático sobre desarrollo de software, construido con Nuxt 4 + Nuxt UI + Nuxt Content
y publicado en GitHub Pages.

## Documentación

Este archivo es un **resumen operativo de referencia rápida**. El detalle vive en `docs/`;
consúltalo antes de trabajar y, ante cualquier discrepancia, **prevalece `docs/`**:

- **[docs/architecture.md](docs/architecture.md)** — Qué es el sistema y por qué: SPA (`ssr: false`)
  generada como estático, flujo de datos (Markdown → SQLite WASM → `queryCollection` en el
  navegador), categorías derivadas de los tags, el papel de `404.html` y `.nojekyll`, y el
  compromiso de SEO que impone `ssr: false`.
- **[docs/conventions.md](docs/conventions.md)** — Cómo escribir y entregar código: lint/formato
  (ESLint + stylistic, sin Prettier), naming, estructura de carpetas, auto-imports, TypeScript,
  orden interno del `<script setup>`, reglas obligatorias de SEO/accesibilidad y de contenido.
- **[docs/setup.md](docs/setup.md)** — Cómo levantar el entorno: Node 22 + pnpm/Corepack, scripts,
  cómo escribir un post, gestión de dependencias y troubleshooting.

## Stack

SPA **Nuxt 4 + Vue 3 + TypeScript** con **Nuxt UI 4** (Tailwind 4), contenido en Markdown vía
**`@nuxt/content` v3**. **No hay backend ni API**: el contenido se resuelve en el cliente. Gestor
**pnpm 11** sobre **Node ≥ 22**.

> Las versiones exactas son la fuente de verdad en **`package.json`**.

## Comandos esenciales

```bash
pnpm dev       # desarrollo (http://localhost:3010)
pnpm generate  # sitio estático en .output/public — es lo que corre el CI
pnpm lint      # ESLint (--max-warnings=0) — gate de calidad
```

## Arquitectura del proyecto

```
app/
├── components/<dominio>/   # blog/ · content/ (MDC) · layout/ · PascalCase
├── composables/<dominio>/  # content/ (única puerta a queryCollection) · seo/ · utils/
├── interfaces/<dominio>/   # Tipos propios (prefijo I)
├── pages/                  # index · blog/[slug] · categories/index · categories/[slug]
├── utils/                  # Helpers puros + constants.views.ts (rutas: VIEW_*)
├── layouts/ · assets/scss/
├── app.vue · error.vue
content/blog/               # Los posts .md — el nombre del archivo ES la URL pública
server/routes/              # robots.txt · sitemap.xml · rss.xml (prerenderizados en build)
public/                     # .nojekyll (imprescindible) · favicon · profiles/
docs/                       # architecture · conventions · setup
```

Auto-imports (`nuxt.config.ts → imports.dirs`): `composables/*/*.ts` — **no anides más de un nivel**
o no se recogerán.

## Reglas que se rompen con facilidad

- **Nunca llames a `queryCollection()` desde una página o componente.** Va en
  `composables/content/useBlog.ts`.
- **Nunca llames a `useAsyncData` dentro de `onMounted`.** Va en el nivel superior del `setup`.
- **Toda página llama a `useSeo().setPageSeo(...)`** con título y descripción propios.
- **Navega con las constantes `VIEW_*`**, no con strings de path. El enlace «Categorías» apuntó
  durante meses a una ruta inexistente justamente por esto.
- **Toda imagen lleva `alt`** y todo control interactivo, nombre accesible y acceso por teclado.
- **Enlaces en Markdown: escribe `[texto](url)` a secas.** `components/content/ProseA.vue` añade
  `target`/`rel` a los externos. **No uses la sintaxis inline `{target="_blank"}`**: el formateador
  de Markdown del editor la escapa a `{target="\_blank"}` y la deja inservible.
- **`date` del frontmatter entre comillas**, o YAML lo convierte en `Date` y rompe el esquema Zod.
- **No traduzcas nombres de herramientas** al escribir contenido: es _Black_, no «negro»; _Celery_,
  no «apio».

## Notas operativas

- **pnpm:** gestionado por Corepack. Para subir versión, editar solo `package.json#packageManager`.
  La configuración vive en `pnpm-workspace.yaml`; **`.npmrc` no se usa**. Los scripts de instalación
  permitidos se declaran en `allowBuilds`, y las dependencias pasan un cooldown de 24 h
  (`minimumReleaseAge`) antes de poder instalarse.
- **`nodeLinker: hoisted` no es opcional:** `@nuxt/icon` y `@nuxt/fonts` llegan como dependencias
  transitivas de `@nuxt/ui` y el linker aislado de pnpm no los expondría.
- **Despliegue:** push a `master` → `pnpm generate` → GitHub Pages sirve `.output/public`. Si el
  build falla, el sitio simplemente no se actualiza.
