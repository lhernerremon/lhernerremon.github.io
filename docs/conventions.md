# Convenciones — Blog

> Guía operativa de **cómo escribir y entregar código** en este repositorio. Es el documento que se
> consulta **antes de escribir o modificar código**. Ante cualquier discrepancia con `AGENTS.md` o el
> `README.md`, **prevalece este documento**.

## 1. Tooling: formateo, lint y tipos

### ESLint es la única herramienta de formato y lint

- **No hay Prettier ni Biome.** El formateo lo aplica ESLint mediante las reglas **stylistic** de
  `@nuxt/eslint`, activadas en `.nuxtrc`:

  ```ini
  eslint.config.stylistic = true
  ```

- Configuración en `eslint.config.mjs` (flat config sobre `withNuxt`). Reglas propias:

  | Regla                                | Valor                             | Efecto                                                       |
  | ------------------------------------ | --------------------------------- | ------------------------------------------------------------ |
  | `vue/max-attributes-per-line`        | `{ singleline: 4, multiline: 1 }` | Máx. 4 atributos en una línea; 1 por línea si es multilínea. |
  | `vue/no-v-html`                      | `off`                             | `v-html` permitido.                                          |
  | `@typescript-eslint/no-explicit-any` | `off`                             | `any` permitido (preferir tipos cuando sea razonable).       |
  | `@typescript-eslint/ban-ts-comment`  | `off`                             | `// @ts-ignore` / `// @ts-expect-error` permitidos.          |
  | `no-undef`                           | `off`                             | Lo cubre TypeScript.                                         |

- **Estilo por defecto en este repo:** comillas simples, indentación de 2 espacios, sin punto y coma,
  comas finales en multilínea. No los fuerces a mano: deja que ESLint los aplique.
- **El cuerpo de una arrow no cuelga en la línea siguiente.** O cabe entero en la misma línea, o se
  abre con `{ return … }`. ESLint no lo comprueba: es criterio del proyecto.

### Comandos

```bash
pnpm lint          # eslint . --ext .js,.ts,.vue --max-warnings=0  (0 warnings permitidos)
pnpm lint --fix    # autofix (formato + reglas autofixables)
npx nuxi typecheck # verificación de tipos con vue-tsc (opcional, NO está en CI)
```

> **Type-checking:** no hay script `typecheck` ni corre en CI. El gate real de entrega es
> `pnpm lint` (ver §9).

## 2. Convenciones de nombres

| Tipo                | Convención                                                                               | Ejemplo                              |
| ------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ |
| **Componentes**     | PascalCase `.vue`, agrupados por dominio en `components/<dominio>/`.                     | `ItemBlog.vue`, `BlogHeader.vue`     |
| **Componentes MDC** | PascalCase en `components/content/`; se invocan en Markdown en kebab-case.               | `CustomImage.vue` → `::custom-image` |
| **Composables**     | `useXxx.ts`, **export default** de una factory, en `composables/<dominio>/`.             | `useBlog.ts`, `useSeo.ts`            |
| **Interfaces**      | Prefijo `I`, en `interfaces/<dominio>/`.                                                 | `ITagSummary`                        |
| **Constantes**      | `SCREAMING_SNAKE_CASE`, en `utils/constants.<dominio>.ts`.                               | `VIEW_CATEGORIES`, `SITE_NAME`       |
| **Rutas**           | `VIEW_*` en `utils/constants.views.ts`. **Nunca navegues con un string de path a mano.** | `VIEW_CATEGORIES = '/categories'`    |
| **Páginas**         | file-based; el archivo define el path.                                                   | `pages/categories/[slug].vue`        |
| **Posts**           | `content/blog/<kebab-case>.md`; el nombre del archivo **es** el slug de la URL.          | `migrating-npm-to-pnpm.md`           |

> La regla de `VIEW_*` no es burocracia: el enlace «Categorías» del header apuntaba a una ruta que no
> existía y nadie lo detectó. Una constante compartida entre el header y la página hace que ese
> desajuste sea imposible de introducir en silencio.

## 3. Estructura de carpetas

```
app/
├── app.vue / error.vue        # Raíz y página de error global
├── assets/scss/               # Estilos globales (registrados en nuxt.config.css)
├── components/
│   ├── blog/                  # UI del dominio blog (tarjetas, cabeceras, avatar)
│   ├── content/               # Componentes MDC usables desde Markdown
│   └── layout/                # Cabecera y cromo de la aplicación
├── composables/<dominio>/     # Lógica reactiva + acceso a datos (factory por defecto)
│   ├── content/               # ÚNICA puerta a queryCollection()
│   ├── seo/                   # Metadatos, URLs absolutas, JSON-LD
│   └── utils/                 # Helpers reactivos transversales (fechas, random)
├── interfaces/<dominio>/      # Tipos propios (prefijo I)
├── layouts/                   # default.vue
├── pages/                     # File-based routing
└── utils/                     # Helpers puros + constants.<dominio>.ts

content/blog/                  # Los posts (fuente de verdad del contenido)
server/routes/                 # Solo rutas prerenderizadas (robots.txt, sitemap.xml)
docs/                          # architecture · conventions · setup
public/                        # Estáticos servidos tal cual (.nojekyll, favicon, imágenes)
```

**Dónde va cada cosa:**

- **¿Leer contenido del blog?** → un composable en `composables/content/`, nunca `queryCollection()`
  suelto en una página o componente.
- **¿Metadatos de página (title, OG, JSON-LD)?** → `composables/seo/useSeo.ts`.
- **¿Valor/función pura sin estado?** → `utils/`.
- **¿Un tipo propio?** → `interfaces/<dominio>/`.
- **¿Componente usable desde Markdown?** → `components/content/`.

> **No hay Pinia ni estado global.** El sitio es de solo lectura y todo el estado que importa vive en
> la URL. Si crees necesitar un store, primero justifica por qué no basta con la ruta o un composable.

## 4. Auto-imports (importante)

Configurado en `nuxt.config.ts → imports.dirs`:

```ts
imports: {
  dirs: ['@/composables/*/*.ts'],
}
```

- Los composables **se auto-importan**: no añadas `import` para ellos.
- El patrón es de **un nivel de anidamiento**: `composables/<dominio>/<archivo>.ts`. **No anides más
  de un nivel** o el auto-import no los recogerá.
- Componentes y layouts siguen el auto-discovery estándar de Nuxt; los componentes de **Nuxt UI**
  (`UButton`, `UCard`, `UBadge`…) y las APIs de Vue/Nuxt (`ref`, `computed`, `useRoute`,
  `navigateTo`…) están disponibles sin import.
- `app/utils/` **también** lo auto-importa Nuxt, pero en este repo se importa explícitamente
  (`import { VIEW_CATEGORIES } from '@/utils/constants.views'`). Es una decisión de estilo: en un
  archivo corto, ver de dónde sale una ruta o un helper vale más que ahorrar la línea.

## 5. TypeScript

- Siempre `<script setup lang="ts">`.
- **Props** tipadas: `defineProps<{ ... }>()` o `withDefaults(defineProps<{ ... }>(), { ... })`.
- **Emits** tipados: `defineEmits<{ (e: 'evento', v: T): void }>()`.
- **Tipos del contenido: usa los que genera `@nuxt/content`.** La colección `blog` produce
  `BlogCollectionItem` (importable desde `@nuxt/content`). **No escribas a mano una interfaz espejo
  del frontmatter** — se desincroniza con `content.config.ts`. Los tipos que sí son propios (agregados,
  view-models como el resumen de un tag) van en `interfaces/<dominio>/` con prefijo `I`.
- `any` está permitido, pero resérvalo para casos genuinamente dinámicos. **`blog: any` en props es
  deuda, no estilo**: tipa con `BlogCollectionItem`.
- **Funciones utilitarias puras → `utils/`.** Los helpers reactivos (que usan Vue/Nuxt) van en
  `composables/<dominio>/`.

### Minimalismo: anota y comenta solo lo que no se deduce

**Anota lo que el lector no puede deducir leyendo la línea.**

1. **Parámetros: anótalos.** Excepción: cuando el valor por defecto ya revela el tipo.

   ```ts
   const formatDate = (value: string, pattern = 'D MMM YYYY') => … // ✅ el default dice el tipo
   ```

2. **Retornos: no los anotes cuando el cuerpo y el nombre alcanzan.** Anota solo la forma no obvia.

   ```ts
   const slugify = (value: string) => value.toLowerCase()          // no anotes `: string`
   const groupByTag = (posts: BlogCollectionItem[]): ITagSummary[] => {…} // sí: la forma no es obvia
   ```

3. **Variables: omite cuando el literal lo dice.** Mantén la anotación en colecciones vacías.

   ```ts
   const PAGE_TITLE = "Categorías"; // obvio
   const posts = ref<BlogCollectionItem[]>([]); // sin el genérico sería `never[]`
   ```

**Firmas: objeto de opciones antes que una fila de posicionales** cuando haya booleanos sueltos,
argumentos intercambiables del mismo tipo u opcionales.

**Comentarios.**

- **Primero el nombre.** Un nombre con verbo claro ya dice qué hace: **renombra antes de comentar**.
- **Los comentarios explican el _porqué_, no el _qué_.** Si el comentario repite la línea, sobra.
- **`// eslint-disable` y `@ts-ignore` solo con la regla concreta y el motivo al lado.**

### Idioma

- **El código en inglés**: nombres de funciones, variables, tipos y rutas.
- **Todo lo que lee el usuario, en español peruano con tuteo** (`tienes`, `puedes`, `inténtalo`),
  nunca voseo ni `vosotros`. Es un blog escrito desde Perú y la voz debe ser consistente entre la
  interfaz y los posts.
- El **contenido** (`content/blog/*.md`) sigue la guía de voz de [§8](#8-contenido-del-blog).

### Orden interno del `<script setup>`

```ts
// 1. import type primero, luego imports normales y de componentes
import type { BlogCollectionItem } from "@nuxt/content";
import { VIEW_CATEGORIES } from "@/utils/constants.views";
import ItemBlog from "@/components/blog/ItemBlog.vue";

// 2. emits + props juntos (emits primero si los hay)
const props = defineProps<{ blog: BlogCollectionItem }>();

// 3. composables juntos
const { formatDate } = useDayjsUtils();
const { setPageSeo } = useSeo();

// 4. lógica: refs, computed, funciones, watchers
```

> Respetar los saltos de línea entre bloques.

### Orden de los atributos en el template

Cuando una etiqueta se parte en varias líneas, los atributos van en este orden:

1. **Directivas**: `v-if` / `v-for` / `v-model` / `:key`, y `ref`
2. **Atributos enlazados** (`:prop="valor"`)
3. **Atributos de texto** (`to="/blog"`, `type="button"`)
4. **`class`** y `style`
5. **Flags booleanas sin valor**
6. **Eventos** (`@evento="..."`)

## 6. Acceso a datos

**No hay backend ni API externa.** La única fuente de datos es `@nuxt/content`, que en producción se
resuelve **en el navegador** contra una base SQLite WASM (ver [`architecture.md`](./architecture.md)).

Patrón canónico — todo el acceso vive en `composables/content/`:

```ts
export default () => {
  const listPosts = async () => {
    const { data } = await useAsyncData("blog:list", () => {
      return queryCollection("blog").order("date", "DESC").all();
    });
    return data;
  };

  return { listPosts };
};
```

- **Llama a `useAsyncData` en el nivel superior del `setup`**, nunca dentro de `onMounted`. Envolverlo
  en `onMounted` desactiva la deduplicación y el caché de payload de Nuxt y provoca un parpadeo de
  lista vacía. Es un error que ya estuvo en este repo; no lo reintroduzcas.
- **Clave de `useAsyncData` explícita y estable** (`'blog:list'`, `` `blog:${slug}` ``). Sin clave
  explícita, dos componentes distintos pueden colisionar.
- **Un post inexistente es un 404 real**: lanza `createError({ statusCode: 404 })`, no renderices
  una página vacía.

## 7. SEO y accesibilidad (obligatorio)

Es un blog público: SEO y accesibilidad no son un extra opcional, son parte de «funciona».

- **Toda página llama a `useSeo().setPageSeo(...)`** con `title` y `description` propios. Una página
  sin descripción propia se considera incompleta.
- **URLs canónicas y OG absolutas**: constrúyelas con `useSeo().absoluteUrl()`, nunca concatenando
  strings.
- **Los posts emiten JSON-LD `BlogPosting`**; los listados, `CollectionPage`.
- **Toda imagen lleva `alt`.** Si es decorativa, `alt=""` explícito.
- **Todo control interactivo tiene nombre accesible** y es alcanzable con teclado. Un icono clicable
  sin `aria-label` o que no sea `<a>`/`<button>` **no se acepta** — usa un enlace/botón real, no un
  `@click` sobre un `<div>` o un `<UIcon>`.
- **Jerarquía de encabezados sin saltos**: un solo `<h1>` por página, luego `h2`, `h3`… Esto aplica
  también dentro del Markdown de los posts.
- **Objetivos táctiles ≥ 24×24 px** (WCAG 2.2 §2.5.8) y foco visible: no elimines el `outline`.
- Los enlaces externos van con `target="_blank"` **y** `rel="noopener noreferrer"`.

## 8. Contenido del blog

- Un post = un archivo `content/blog/<kebab-case>.md`. El nombre del archivo es el slug público, así
  que **renombrarlo rompe la URL**: no lo hagas sin necesidad.
- **Frontmatter obligatorio** (validado por Zod en `content.config.ts`): `title`, `description`,
  `date`, `time`, `author`. `tags` es opcional pero se espera en la práctica.
  - `description` es la meta description real de la página: **redáctala** (150–160 caracteres). Un
    placeholder tipo `Hello` es un bug de SEO, no un detalle.
  - `date` en `YYYY-MM-DD` **entre comillas** (si no, YAML lo convierte a `Date` y rompe el esquema).
  - `tags` en **Capitalizado y singular** (`Django`, `API`, `Herramientas`). El slug de la categoría
    se deriva automáticamente; no lo escribas a mano.
- **Encabezados desde `##`.** El `<h1>` lo pone el layout con el `title` del frontmatter: no escribas
  otro `#` en el cuerpo, y no saltes de `##` a `####`.
- **Enlaces externos: escríbelos a secas**, `[texto](url)`. El componente
  `app/components/content/ProseA.vue` sobreescribe el `ProseA` de Nuxt UI y le pone
  `target="_blank" rel="noopener noreferrer"` a todo `href` que empiece por `http`.
  **No añadas atributos inline.** La sintaxis MDC `{target="_blank"}` es válida, pero cualquier
  formateador de Markdown con `formatOnSave` la reescribe a `{target="\_blank"}` y la rompe en
  silencio. Por eso `content/` está en `.prettierignore`.
- **Bloques de código** con lenguaje y, si aporta, nombre de archivo: ` ```py [models.py] `.
- **Voz:** español peruano, tuteo, cercano y directo. Se admiten y se agradecen los peruanismos
  cuando aclaran una idea (_«a la mala», «choborra», «al toque»_), pero el término técnico siempre va
  en su forma estándar. Nunca traduzcas nombres propios de herramientas: es **Black**, no «negro»;
  **Celery**, no «apio»; **pre-commit**, no «confirmación previa».

## 9. Git: commits, ramas y entrega

- **Commits: Conventional Commits** — `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`… en imperativo.
- **Ramas:** el trabajo va en `dev` y llega a `master` por Pull Request.
- **Pre-commit (Husky):** ejecuta `lint-staged`, que pasa `eslint --cache` sobre los `*.ts,*.js,*.vue`
  staged. Si el lint falla, el commit se bloquea (`HUSKY=0` lo salta).
- **CI (GitHub Actions):** cada push a `master` ejecuta `pnpm generate` y publica `.output/public` en
  GitHub Pages. **Si el build falla, el sitio no se actualiza**: mantén `master` en verde.
- **Dependencias:** se fijan a versión exacta (`saveExact`) y pasan un _cooldown_ de 24 h
  (`minimumReleaseAge`) antes de poder instalarse. Los scripts de instalación permitidos se declaran
  en `allowBuilds` de `pnpm-workspace.yaml`; **no se usa `.npmrc`**.

## 10. Checklist antes de entregar

- [ ] `pnpm lint` pasa sin warnings.
- [ ] `pnpm generate` termina sin errores (es lo que corre el CI).
- [ ] El acceso a contenido pasa por `composables/content/`; nada de `queryCollection()` en páginas.
- [ ] La página llama a `setPageSeo(...)` con título y descripción propios.
- [ ] Imágenes con `alt`; controles con nombre accesible y navegables por teclado.
- [ ] Rutas navegadas por constantes `VIEW_*`, no por strings sueltos.
- [ ] Si tocaste `content/`: frontmatter completo, `description` real y encabezados desde `##`.
- [ ] Commit en Conventional Commits.
