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
      '@/stores/*/*.ts',
    ],
  },

  app: {
    head: {
      title: 'Blog',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: [
    '@/assets/scss/main.scss',
    '@/assets/scss/global.css',
  ],

  content: {
    build: {
      markdown: {
        highlight: {
          preload: ['python'],
          theme: 'monokai',
        },
      },
    },
  },

  dayjs: {
    locales: ['es'],
    plugins: ['utc', 'timezone', 'relativeTime', 'customParseFormat'],
    defaultLocale: 'es',
    defaultTimezone: 'America/Lima',
  },
})
