# Nuxt Blog

Blog personal construido con [Nuxt](https://nuxt.com/docs/getting-started/introduction) y [@nuxt/content](https://content.nuxt.com).

## Requisitos

- Node.js >= 22
- pnpm (gestionado con el campo `packageManager` del `package.json`; puedes activarlo con `corepack enable`)

## Setup

Instalar dependencias:

```bash
pnpm install
```

## Development Server

Levantar el servidor de desarrollo en `http://localhost:3010`:

```bash
pnpm dev
```

## Production

Generar el sitio estático (lo que se despliega en GitHub Pages, carpeta `dist`):

```bash
pnpm generate
```

Build para servidor:

```bash
pnpm build
```

Previsualizar el build en local:

```bash
pnpm preview
```

## Lint

```bash
pnpm lint
```

Consulta la [documentación de despliegue](https://nuxt.com/docs/getting-started/deployment) para más información.
