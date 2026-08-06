const siteUrl = 'https://lhernerremon.github.io'
const siteName = 'Blog'
const siteDescription = 'Apuntes sobre desarrollo de software: diseño de APIs, Django, Nuxt y herramientas del día a día.'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/content',
    'dayjs-nuxt',
  ],
  imports: {
    dirs: [
      '@/composables/*/*.ts',
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: siteName,
      meta: [
        { charset: 'utf-8' },
        { name: 'description', content: siteDescription },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#0a0a0a', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'alternate', type: 'application/rss+xml', title: siteName, href: '/rss.xml' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: [
    '@/assets/scss/global.css',
  ],

  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          langs: ['py', 'bash', 'sh', 'console', 'yaml', 'json', 'ts', 'js', 'vue', 'diff', 'ini'],
          theme: {
            default: 'github-light',
            dark: 'one-dark-pro',
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
      siteName,
      siteDescription,
    },
  },

  nitro: {
    prerender: {
      routes: ['/robots.txt', '/sitemap.xml', '/rss.xml'],
    },
  },

  dayjs: {
    locales: ['es'],
    plugins: ['utc', 'timezone', 'relativeTime', 'customParseFormat'],
    defaultLocale: 'es',
    defaultTimezone: 'America/Lima',
  },

})
