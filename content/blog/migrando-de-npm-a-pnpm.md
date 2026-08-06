---
title: Migrar de npm a pnpm, y las cuatro cosas que se rompen
description: Cambiar de gestor de paquetes no es solo borrar el package-lock. Los scripts de instalación bloqueados, el node_modules estricto, el cooldown de versiones y la dependencia fantasma que npm te tapaba.
date: "2026-08-06"
time: 9 min
tags:
  - Desarrollo
  - Herramientas
  - Node
author: RrQq
---

Migrar un proyecto de npm a pnpm suena a borrar `package-lock.json`, correr `pnpm install` y seguir con tu vida. En la práctica hay cuatro cosas que se rompen, y todas se rompen por buenas razones: pnpm es estricto justo donde npm te dejaba pasar.

Esto es lo que encontré migrando este blog, que es un Nuxt 4 con Nuxt UI y Nuxt Content. Nada exótico, y aun así aparecieron los cuatro.

## Primero: la configuración ya no va en .npmrc

Si buscas cómo configurar pnpm vas a encontrar mil ejemplos con `.npmrc`. En pnpm 10 y 11 la configuración del proyecto vive en **`pnpm-workspace.yaml`**, aunque no tengas un monorepo ni workspaces.

```yaml [pnpm-workspace.yaml]
minimumReleaseAge: 1440
resolutionMode: highest
updateNotifier: false
engineStrict: true
saveExact: true
nodeLinker: hoisted
```

Y la versión del gestor se fija en el `package.json`, para que todo el equipo y el CI usen exactamente la misma:

```json [package.json]
{
  "packageManager": "pnpm@11.17.0",
  "engines": { "node": ">=22" }
}
```

Con eso, `corepack enable` basta para que cualquiera tenga la versión correcta sin instalar nada a mano.

## Segundo: pnpm no ejecuta los scripts de instalación

Esta es la que sorprende. Al terminar el primer `pnpm install` te sale esto:

```console
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: better-sqlite3, esbuild, unrs-resolver
```

pnpm **no ejecuta los scripts `postinstall` de tus dependencias** salvo que los autorices uno por uno. Es una defensa directa contra ataques de cadena de suministro: la forma más común de que un paquete comprometido ejecute código en tu máquina es justamente un `postinstall`.

Los autorizas en `allowBuilds`:

```yaml [pnpm-workspace.yaml]
allowBuilds:
  better-sqlite3: true
  esbuild: true
  "@parcel/watcher": true
  unrs-resolver: true
  vue-demi: true
```

Un detalle simpático: si dejas alguno sin decidir, pnpm te escribe el nombre en el archivo con el valor `set this to true or false`. Es un recordatorio, no un valor válido. Tienes que entrar y decidir.

Vale la pena mirar esa lista con calma en vez de poner todo en `true`. Son exactamente los paquetes que van a correr código arbitrario en tu máquina y en tu CI. En este proyecto son cinco y todos tienen una razón evidente: compilar binarios nativos o resolver la variante correcta para tu plataforma.

## Tercero: el node_modules estricto encuentra tus dependencias fantasma

npm aplana `node_modules`. Todo lo que instalaste, más todo lo que instalaron tus dependencias, queda accesible desde la raíz. Eso significa que puedes importar un paquete que **nunca declaraste** y funciona igual.

pnpm no. Por defecto solo ves lo que declaraste, y lo demás vive enlazado fuera de tu alcance. Es más correcto, y es donde aparecen los muertos.

En este proyecto apareció uno bueno. El `package.json` tenía configurado `lint-staged`:

```json [package.json]
{
  "lint-staged": {
    "*.{ts,js,vue}": "eslint --cache"
  }
}
```

Pero `lint-staged` **no estaba en las dependencias**. Funcionaba porque el hook de pre-commit lo llamaba con `npx`, y `npx` descarga en silencio lo que no encuentra. O sea: cada commit se bajaba un paquete de internet, y nadie lo notó nunca.

La corrección es de una línea, declararlo, y de paso cambiar el hook:

```sh [.husky/pre-commit]
#!/bin/bash
pnpm exec lint-staged
```

`pnpm exec` corre lo que está instalado en el proyecto y falla si no está. Eso es lo que quieres de un hook: que se queje, no que improvise.

### Cuando el linker estricto es demasiado estricto

Hay un caso donde el aislamiento sí te estorba, y es cuando un framework carga módulos por nombre en tiempo de ejecución.

Aquí, `nuxt.config.ts` declara módulos que llegan como dependencias **transitivas** de Nuxt UI:

```ts [nuxt.config.ts]
modules: [
  '@nuxt/ui',
  '@nuxt/icon',   // llega a través de @nuxt/ui
  '@nuxt/fonts',  // llega a través de @nuxt/ui
]
```

Con el linker aislado, Nuxt busca `@nuxt/icon` en la raíz de `node_modules`, no lo encuentra y el build muere. Por eso:

```yaml [pnpm-workspace.yaml]
nodeLinker: hoisted
```

`hoisted` reproduce el `node_modules` plano de npm. Pierdes la detección de dependencias fantasma, y a cambio los módulos resueltos por nombre funcionan.

La alternativa purista es declarar explícitamente `@nuxt/icon` y `@nuxt/fonts` en el `package.json` y quedarte con el linker aislado. Es más correcto, pero te obliga a mantener sincronizadas a mano las versiones que Nuxt UI espera, y cuando se desincronizan el error no es obvio. Para un proyecto chico prefiero `hoisted` y dormir tranquilo.

## Cuarto: el cooldown de versiones te va a bloquear el primer install

`minimumReleaseAge: 1440` le dice a pnpm que ignore cualquier versión publicada en las últimas 24 horas. La idea es simple: casi todos los paquetes comprometidos se detectan y se bajan de npm en cuestión de horas. Si esperas un día, te ahorras la mayoría de los sustos por el precio de no estrenar versiones.

El problema es que choca de frente con el momento en que lo activas:

```console
[ERR_PNPM_NO_MATURE_MATCHING_VERSION] 7 versions do not meet the minimumReleaseAge constraint:
  @nuxt/eslint@1.17.0 was published at 2026-08-06T01:29:21.119Z, within the cutoff
  vite@8.2.1 was published at 2026-08-06T13:47:48.588Z, within the cutoff
```

Había fijado versiones publicadas ese mismo día, así que la primera instalación bajo la nueva política se negó a instalarlas. Tienes dos salidas:

**Exceptuar esas versiones puntuales:**

```yaml [pnpm-workspace.yaml]
minimumReleaseAgeExclude:
  - "@nuxt/eslint@1.17.0"
  - vite@8.2.1
```

**O bajar a la versión anterior**, que es lo que terminé haciendo. Si vas a poner un cooldown de 24 horas, exceptuar justo las versiones recién salidas es anular la política el mismo día que la escribes.

Un truco que sirve para los `overrides`: en lugar de fijar la versión exacta que todavía está en cuarentena, deja un rango con piso.

```yaml [pnpm-workspace.yaml]
overrides:
  vite: ">=8.2.0"
```

Resuelve a la 8.2.0 hoy y sube sola a la 8.2.1 mañana, cuando cumpla las 24 horas. Sin tocar nada.

## El CI también cambia

El workflow pasa de `npm ci` a la acción oficial de pnpm. El detalle que vale la pena copiar es `node-version-file`, que lee la versión de Node desde `engines` del `package.json` en vez de repetirla en el YAML:

```yaml [.github/workflows/build-deploy.yml]
- name: Setup pnpm
  uses: pnpm/action-setup@v4

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version-file: "package.json"
    cache: "pnpm"

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

Una fuente de verdad menos que mantener. Y con eso también se va el `.nvmrc`: la versión de Node ya está declarada en `engines`, y `engineStrict: true` hace que pnpm se niegue a instalar si no la cumples.

## La lista completa

Para que no se te escape nada:

- [ ] Borrar `package-lock.json`.
- [ ] Agregar `packageManager` y `engines` al `package.json`.
- [ ] Mover los `overrides` de npm a `pnpm-workspace.yaml` (npm los lee de `package.json`; pnpm no).
- [ ] Crear `pnpm-workspace.yaml` con la configuración y `allowBuilds`.
- [ ] Cambiar `npx` por `pnpm exec` en los hooks de Husky.
- [ ] Declarar las dependencias fantasma que salten.
- [ ] Actualizar el workflow de CI.
- [ ] Commitear `pnpm-lock.yaml`.

Lo que más me gustó de la migración no fue la velocidad ni el ahorro de disco, que son el argumento de venta habitual. Fue que las tres cosas que rompió eran tres cosas que estaban mal desde antes y que npm me estaba escondiendo: un paquete sin declarar, scripts de instalación corriendo sin que nadie los revisara, y dependencias que se estrenaban el mismo día en que se publicaban.

Si vas a migrar, tómate el rato de leer lo que se queja. Ahí está el valor.
