# Blog

[![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Nuxt UI](https://img.shields.io/badge/Nuxt%20UI-4-00DC82?logo=nuxt&logoColor=white)](https://ui.nuxt.com/)
[![Nuxt Content](https://img.shields.io/badge/Nuxt%20Content-3-00DC82?logo=nuxt&logoColor=white)](https://content.nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![ESLint](https://img.shields.io/badge/code%20style-ESLint-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

Blog personal sobre desarrollo de software: diseño de APIs, Django, Nuxt y herramientas del día a
día. Los artículos son archivos Markdown versionados en este mismo repositorio.

Es una **SPA** (`ssr: false`) construida con Nuxt 4, generada como sitio **estático** con
`nuxt generate` y publicada en **GitHub Pages** por GitHub Actions en cada push a `master`. No hay
backend: todo el contenido se resuelve en el navegador contra una base SQLite WASM que `@nuxt/content`
arma durante el build.

## 📚 Documentación

| Documento                                        | Contenido                                                                               |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **[docs/architecture.md](docs/architecture.md)** | Flujo de datos, despliegue estático y las decisiones de diseño (incluida `ssr: false`). |
| **[docs/conventions.md](docs/conventions.md)**   | Cómo escribir y entregar código: lint, naming, estructura, SEO/a11y, contenido.         |
| **[docs/setup.md](docs/setup.md)**               | Levantar el entorno, escribir un post y troubleshooting.                                |
| **[AGENTS.md](AGENTS.md)**                       | Resumen operativo de referencia rápida (también `CLAUDE.md`).                           |

## 🚀 Inicio rápido

Requisitos: **Node ≥ 22** y **pnpm 11** (vía Corepack). Detalle completo en
[docs/setup.md](docs/setup.md).

```bash
# 1. Habilitar pnpm (incluido en Node 22)
corepack enable
corepack install

# 2. Instalar dependencias
pnpm install

# 3. Arrancar el servidor de desarrollo en http://localhost:3010
pnpm dev
```

No hay variables de entorno que configurar.

## 🧱 Stack

| Categoría     | Tecnología                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------- |
| Framework     | Nuxt 4 + Vue 3 + TypeScript (SPA, `ssr: false`, salida estática)                                  |
| UI            | Nuxt UI 4 sobre Tailwind CSS 4 · modo claro/oscuro · fuente Poppins                               |
| Contenido     | `@nuxt/content` v3 · frontmatter validado con Zod · Shiki para el código                          |
| Iconos        | `@nuxt/icon` (`mdi-*`), empaquetados en el build                                                  |
| Fechas        | `dayjs-nuxt` (locale `es`)                                                                        |
| SEO           | `useSeoMeta` + JSON-LD `BlogPosting` · `sitemap.xml`, `robots.txt` y `rss.xml` generados en build |
| Lint/Format   | ESLint 10 + `@nuxt/eslint` (reglas stylistic) — sin Prettier                                      |
| Gestor / Node | pnpm 11 (Corepack) · Node ≥ 22                                                                    |
| Despliegue    | GitHub Actions → GitHub Pages                                                                     |

> Las versiones exactas son la fuente de verdad en **`package.json`**; no se enumeran aquí para no
> quedar desactualizadas.

## 📂 Estructura

```
app/
├── components/
│   ├── blog/               # Tarjeta de post, cabecera, avatar, lista de tags
│   ├── content/            # Componentes MDC usables desde el Markdown
│   └── layout/             # AppHeader · AppFooter
├── composables/
│   ├── content/            # useBlog — ÚNICA puerta a queryCollection()
│   ├── seo/                # useSeo — metadatos, canonical, JSON-LD
│   └── utils/              # useDayjsUtils
├── interfaces/blog/        # Tipos propios (prefijo I)
├── pages/                  # index · blog/[slug] · categories/index · categories/[slug]
├── layouts/ · utils/ · assets/scss/
├── app.vue · error.vue
content/blog/               # Los posts (.md) — el nombre del archivo es la URL
server/routes/              # robots.txt · sitemap.xml · rss.xml (prerenderizados)
public/                     # .nojekyll · favicon · imágenes de perfil
docs/                       # architecture · conventions · setup
```

## ✍️ Publicar un post

```bash
# 1. Crear el archivo; el nombre define la URL (/blog/mi-nuevo-post)
content/blog/mi-nuevo-post.md

# 2. Frontmatter obligatorio: title, description, date, time, author (+ tags)
# 3. Commit y push a master: el CI genera y publica
```

Las categorías se derivan automáticamente de los `tags`, no hay nada que registrar aparte. Guía
completa en [docs/setup.md](docs/setup.md#4-escribir-un-post).

## 🧪 Calidad

```bash
pnpm lint       # ESLint, 0 warnings permitidos (gate)
pnpm generate   # lo que corre el CI: si falla, el sitio no se actualiza
```

El pre-commit de Husky pasa `lint-staged` sobre los archivos en staging.
