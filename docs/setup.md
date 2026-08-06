# Setup — Blog

> Cómo levantar el entorno desde cero, qué hace cada script y qué mirar cuando algo falla.

## 1. Requisitos

| Requisito | Versión | Nota                                                                                        |
| --------- | ------- | ------------------------------------------------------------------------------------------- |
| Node.js   | ≥ 22    | Declarado en `engines`; con `engineStrict: true` pnpm se niega a instalar si no lo cumples. |
| pnpm      | 11.17.0 | Fijado en `packageManager`; lo entrega Corepack, no lo instales aparte.                     |

No hay variables de entorno: **no existe `.env`**, y no hace falta. La URL pública del sitio está en
`nuxt.config.ts` (`siteUrl`), porque forma parte del build y no del entorno.

## 2. Instalación

```bash
# 1. Habilitar pnpm (Corepack viene con Node 22)
corepack enable
corepack install

# 2. Instalar dependencias
pnpm install

# 3. Levantar el servidor de desarrollo
pnpm dev
```

El sitio queda en **http://localhost:3010**.

`pnpm install` dispara dos scripts propios: `postinstall` (`nuxt prepare`, que genera los tipos en
`.nuxt/`) y `prepare` (`husky`, que instala el hook de pre-commit).

## 3. Scripts

| Script          | Qué hace                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| `pnpm dev`      | Servidor de desarrollo con HMR en el puerto 3010.                           |
| `pnpm generate` | **Genera el sitio estático** en `.output/public`. Es lo que corre el CI.    |
| `pnpm build`    | Build con servidor Nitro. No se usa para desplegar; el destino es estático. |
| `pnpm preview`  | Sirve el resultado de `build`.                                              |
| `pnpm lint`     | ESLint con `--max-warnings=0`. Gate de calidad.                             |

Para revisar el sitio estático tal como lo verá GitHub Pages:

```bash
pnpm generate
pnpm dlx serve .output/public
```

Vale la pena hacerlo antes de un cambio grande: es el único momento en que se comprueba de verdad
que el enrutado por `404.html` funciona.

## 4. Escribir un post

1. Crea `content/blog/<kebab-case>.md`. **El nombre del archivo es la URL**, así que elígelo bien:
   renombrarlo después rompe el enlace.
2. Completa el frontmatter (lo valida Zod en `content.config.ts`; si falta algo, el build falla):

   ```yaml
   ---
   title: Título del post
   description: Descripción real de 150-160 caracteres. Es la meta description de Google.
   date: "2026-08-06" # entre comillas, o YAML lo convierte en Date y rompe el esquema
   time: 9 min
   tags:
     - Desarrollo
     - Herramientas
   author: RrQq
   ---
   ```

3. Escribe el cuerpo empezando por `##`. El `<h1>` lo pone el layout con el `title`.
4. `pnpm dev` recarga en caliente al guardar. Las categorías nuevas aparecen solas en `/categories`.

Las reglas completas de estilo del contenido están en [`conventions.md` §8](./conventions.md#8-contenido-del-blog).

## 5. Dependencias

La configuración de pnpm vive en **`pnpm-workspace.yaml`** (no hay `.npmrc`):

| Ajuste                | Efecto                                                                   |
| --------------------- | ------------------------------------------------------------------------ |
| `saveExact: true`     | Las versiones se fijan exactas, sin `^`.                                 |
| `minimumReleaseAge`   | 1440 minutos: no se instala nada publicado hace menos de 24 h.           |
| `nodeLinker: hoisted` | `node_modules` plano. Necesario para los módulos transitivos de Nuxt UI. |
| `engineStrict: true`  | Falla si tu Node no cumple `engines`.                                    |
| `allowBuilds`         | Lista blanca de paquetes autorizados a ejecutar scripts de instalación.  |
| `overrides`           | Versiones forzadas en el árbol de dependencias.                          |

### Agregar una dependencia

```bash
pnpm add <paquete>
```

Si el paquete necesita compilar algo, pnpm avisará que ignoró su script de instalación y escribirá
su nombre en `allowBuilds` con el texto `set this to true or false`. **Ese texto no es un valor
válido**: entra al archivo y decide `true` o `false` a conciencia, porque estás autorizando código
arbitrario en tu máquina y en el CI.

### Subir la versión de pnpm

Edita solo `package.json#packageManager`. Corepack se encarga del resto.

## 6. Calidad y hooks

- **Pre-commit (Husky):** corre `pnpm exec lint-staged`, que pasa `eslint --cache` sobre los
  `*.ts,*.js,*.vue` en staging. Si el lint falla, el commit se bloquea.
- **Saltarse el hook** (úsalo con criterio): `HUSKY=0 git commit …`.
- **CI:** cada push a `master` corre `pnpm generate` y publica. Si el build falla, **el sitio no se
  actualiza y no hay aviso más allá del check rojo**.

## 7. Troubleshooting

**`ERR_PNPM_NO_MATURE_MATCHING_VERSION`**
Fijaste una versión publicada hace menos de 24 h y choca con `minimumReleaseAge`. Espera, baja a la
versión anterior, o —si de verdad es urgente— añádela a `minimumReleaseAgeExclude`.

**`ERR_PNPM_IGNORED_BUILDS`**
Una dependencia quiere ejecutar su script de instalación. Revísala y decídelo en `allowBuilds`.

**`Cannot find module '@nuxt/icon'` (o `@nuxt/fonts`) al arrancar**
Se perdió `nodeLinker: hoisted`. Esos módulos llegan como dependencias transitivas de Nuxt UI y el
linker aislado de pnpm no los expone en la raíz.

**El build pasa pero el sitio sale en blanco en GitHub Pages**
Falta `public/.nojekyll`. Sin él, Jekyll descarta la carpeta `_nuxt/`.

**Un enlace directo a un post da 404 en producción, pero navegando funciona**
Falta `404.html` en lo publicado, o el workflow está publicando la carpeta equivocada. Debe
publicarse `.output/public`.

**El frontmatter falla en el build**
Casi siempre es `date` sin comillas: YAML lo convierte a `Date` y el esquema Zod espera `string`.

**Los tipos de un post no coinciden en el editor**
Corre `pnpm exec nuxt prepare` para regenerar `.nuxt/`.
