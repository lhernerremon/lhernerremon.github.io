# Arquitectura — Blog

> Qué es este sistema, cómo fluyen los datos y por qué está construido así. Para las reglas de
> escritura de código, ver [`conventions.md`](./conventions.md); para levantar el entorno,
> [`setup.md`](./setup.md).

## 1. Qué es

Un **blog estático personal**. No hay backend, ni base de datos, ni sesiones, ni usuarios. Los
artículos son archivos Markdown versionados en el mismo repositorio.

| Aspecto       | Decisión                                                           |
| ------------- | ------------------------------------------------------------------ |
| Framework     | Nuxt 4 + Vue 3 + TypeScript                                        |
| Renderizado   | SPA (`ssr: false`), generado como estático con `nuxt generate`     |
| UI            | Nuxt UI 4 sobre Tailwind CSS 4                                     |
| Contenido     | `@nuxt/content` v3, colección `blog` validada con Zod              |
| Hosting       | GitHub Pages, publicado por GitHub Actions en cada push a `master` |
| Gestor / Node | pnpm 11 (Corepack) · Node ≥ 22                                     |

## 2. Flujo de datos

No hay red que valga: **todo el contenido se resuelve dentro del navegador**.

```
content/blog/*.md
      │  (build) @nuxt/content parsea el Markdown y arma una base SQLite
      ▼
.output/public/__nuxt_content/blog/sql_dump.txt
      │  (runtime) el navegador descarga el dump y lo carga en SQLite WASM
      ▼
queryCollection('blog')  ←  composables/content/useBlog.ts
      │
      ▼
páginas (index · blog/[slug] · categories/*)  →  componentes
```

Consecuencias de este diseño, que conviene tener presentes:

- **La primera visita descarga el contenido completo.** Con pocos posts no importa; si el blog
  creciera a cientos de artículos, habría que revisar esta estrategia.
- **`queryCollection` corre en el cliente.** No hay coste de servidor, pero tampoco hay HTML con el
  artículo dentro (ver §4).
- **Las páginas nunca llaman a `queryCollection` directamente.** Todo pasa por
  `composables/content/useBlog.ts`, que es la única puerta a los datos. Es la misma idea que en un
  proyecto con API: un único sitio donde mirar cuando algo de datos se rompe.

### Las categorías se derivan, no se declaran

No existe una colección de categorías. La lista de categorías **se calcula agregando los `tags` de
todos los posts** y el slug se deriva del texto del tag con `slugify()`.

```
tags: ["Buenas prácticas"]  →  slug "buenas-practicas"  →  /categories/buenas-practicas
```

Esto evita mantener un catálogo paralelo que se desincroniza. El precio es que **renombrar un tag
cambia la URL de su categoría**, así que un tag es tan público como el nombre de archivo de un post.

## 3. Renderizado y despliegue

`nuxt generate` con `ssr: false` produce un **SPA estático**:

```
.output/public/
├── index.html          # shell de la aplicación
├── 200.html            # mismo shell (convención de algunos hosts)
├── 404.html            # ⚠️ lo que hace funcionar el enrutado en GitHub Pages
├── _nuxt/              # JS y CSS con hash
├── __nuxt_content/     # el dump SQLite del contenido
├── robots.txt · sitemap.xml · rss.xml
└── .nojekyll           # sin esto, GitHub Pages ignora las carpetas que empiezan con "_"
```

Dos archivos hacen todo el trabajo y es fácil romperlos sin darse cuenta:

- **`404.html`**: GitHub Pages no sabe de rutas de cliente. Cuando alguien entra directo a
  `/blog/django-guide`, el servidor no encuentra ese archivo y sirve `404.html`, que es el shell
  completo de la app; Vue Router lee la URL y monta la página correcta. Sin ese archivo, todo enlace
  profundo devuelve un 404 real.
- **`.nojekyll`** (en `public/`): GitHub Pages pasa el sitio por Jekyll por defecto, y Jekyll ignora
  las carpetas que empiezan con guion bajo. Sin este archivo, `_nuxt/` no se publica y el sitio
  queda en blanco.

El workflow (`.github/workflows/build-deploy.yml`) corre `pnpm generate` y publica
**`.output/public`**. Nuxt crea además un enlace simbólico `dist → .output/public`; publicar la
carpeta real evita depender de que la acción de despliegue resuelva symlinks.

## 4. La decisión que más pesa: `ssr: false`

El sitio se sirve estático, pero **el HTML no lleva el contenido dentro**. El build lo dice
explícitamente:

```console
▲ HTML content not prerendered because ssr: false was set.
```

Todas las páginas comparten el mismo shell. El título, la descripción y el artículo aparecen recién
cuando el JavaScript se ejecuta.

**Qué se hizo dentro de esa restricción:**

- Los metadatos por defecto (`lang="es"`, `description`, `theme-color`, favicon, RSS) viven en
  `app.head` y **sí** están en el HTML estático.
- Cada página añade sus metadatos con `useSeoMeta` y su `canonical`; Googlebot ejecuta JavaScript y
  los lee.
- Los posts emiten **JSON-LD `BlogPosting`**.
- `sitemap.xml`, `robots.txt` y `rss.xml` se generan **en build** desde rutas Nitro prerenderizadas
  (`server/routes/`), leyendo la colección con `queryCollection(event, 'blog')`. Estos sí son
  archivos reales y completos, sin depender de JavaScript.

**Qué sigue sin funcionar, y hay que saberlo:**

Los rastreadores que **no** ejecutan JavaScript (los que generan las previsualizaciones de enlaces en
WhatsApp, Slack, Telegram, X, LinkedIn) leen el HTML crudo. Ahí encuentran el título y la descripción
genéricos del sitio, nunca los del artículo. Compartir un post da siempre la misma tarjeta.

**La alternativa, si algún día molesta:** cambiar a `ssr: true` en `.nuxtrc`. El sitio **sigue siendo
100 % estático** y se sigue desplegando igual en GitHub Pages, pero `nuxt generate` prerenderiza un
HTML real por artículo, con el contenido y los metadatos dentro. No se pierde nada del despliegue
actual; el coste es que el código deja de poder asumir que siempre está en un navegador (`window`,
`localStorage` y compañía necesitan guardas). Es una decisión abierta, no un pendiente.

## 5. Módulos de Nuxt y para qué está cada uno

| Módulo          | Rol                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `@nuxt/content` | Parsea `content/blog/*.md`, valida el frontmatter con Zod y expone `queryCollection`. Resalta el código con Shiki en build. |
| `@nuxt/ui`      | Componentes (`UButton`, `UCard`, `UContentToc`…) y los componentes `Prose*` que dan estilo al Markdown renderizado.         |
| `@nuxt/icon`    | Iconos `mdi-*`, empaquetados localmente en el build.                                                                        |
| `@nuxt/fonts`   | Descarga Poppins en build y la sirve desde el propio dominio (sin llamadas a Google en runtime).                            |
| `@nuxt/eslint`  | Config plana de ESLint con reglas stylistic.                                                                                |
| `dayjs-nuxt`    | Formateo de fechas en español, zona horaria `America/Lima`.                                                                 |

> `@nuxt/icon` y `@nuxt/fonts` llegan como dependencias **transitivas** de `@nuxt/ui`, no están en
> `package.json`. Por eso `pnpm-workspace.yaml` usa `nodeLinker: hoisted`: con el linker aislado de
> pnpm, Nuxt no los encontraría al resolverlos por nombre.

## 6. MDC: componentes dentro del Markdown

Los archivos de `app/components/content/` se pueden invocar desde el Markdown con la sintaxis de
bloque de MDC:

```text
::custom-image
---
url: "https://…"
alt: "Descripción de la imagen"
max-width: 400
---
::
```

### Los enlaces externos no llevan atributos

En el Markdown se escribe un enlace normal y ya:

```text
[Ruff](https://docs.astral.sh/ruff/)
```

`app/components/content/ProseA.vue` sobreescribe el `ProseA` de Nuxt UI y añade
`target="_blank" rel="noopener noreferrer"` a cualquier `href` que empiece por `http`.

Se llegó ahí después de dos intentos fallidos, y conviene no repetirlos:

```text
[texto](url){:target="_blank"}   ❌ sintaxis de Nuxt Content v2; en v3 los dos puntos
                                    significan "componente inline", así que no hace nada
[texto](url){target="_blank"}    ❌ correcto para MDC, pero cualquier formateador de Markdown
                                    con formatOnSave lo reescribe a {target="\_blank"}
```

El escape del guion bajo es silencioso y deja el atributo inservible. Por eso `content/` está en
`.prettierignore` y por eso los ejemplos de esta sección van en bloques ` ```text `: dentro de un
bloque ` ```markdown ` el formateador también reescribe el contenido.

## 7. Qué no hay (y es a propósito)

- **Sin Pinia ni estado global.** El sitio es de solo lectura; el estado vive en la URL.
- **Sin API propia.** `server/` solo aloja las rutas prerenderizadas de `robots.txt`, `sitemap.xml` y
  `rss.xml`. No agregues `server/api` sin una razón: en un sitio estático no hay servidor que las
  atienda en producción.
- **Sin buscador.** `@nuxt/ui` trae `UContentSearch` y `@nuxt/content` expone secciones de búsqueda,
  así que es viable el día que la cantidad de posts lo justifique.
- **Sin tests.** El gate de calidad es `pnpm lint` más que el build de CI falle.
