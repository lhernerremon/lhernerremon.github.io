<script lang="ts" setup>
import type { NuxtError } from '#app'
import { VIEW_HOME } from '@/utils/constants.views'

const props = defineProps<{
  error: NuxtError
}>()

const { siteName } = useSeo()

const isNotFound = computed(() => props.error?.statusCode === 404)
const message = computed(() => {
  if (isNotFound.value) return 'Esa página no existe o cambió de dirección.'
  return 'Algo se rompió de nuestro lado. Inténtalo de nuevo en un momento.'
})

useHead({
  title: `${props.error?.statusCode || 500} · ${siteName}`,
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p class="meta-label text-primary">
        Error {{ error?.statusCode || 500 }}
      </p>

      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        {{ isNotFound ? 'Página no encontrada' : 'Algo salió mal' }}
      </h1>

      <p class="max-w-md text-pretty text-muted">
        {{ message }}
      </p>

      <UButton color="neutral" variant="subtle" @click="clearError({ redirect: VIEW_HOME })">
        Volver al inicio
      </UButton>
    </div>
  </UApp>
</template>
