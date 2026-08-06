<script setup lang="ts">
import { viewCategory } from '@/utils/constants.views'

const { listTags } = useBlog()
const { setPageSeo } = useSeo()

const { data: tags } = await listTags()

setPageSeo({
  title: 'Categorías',
  description: 'Todos los temas del blog: diseño de APIs, Django, Nuxt y herramientas de desarrollo, agrupados por categoría.',
})
</script>

<template>
  <UContainer class="max-w-3xl py-10 sm:py-14">
    <div class="flex flex-col gap-2 pb-8">
      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        Categorías
      </h1>

      <p class="text-muted">
        Los temas del blog, ordenados por cantidad de publicaciones.
      </p>
    </div>

    <ul v-if="tags.length" class="grid gap-3 sm:grid-cols-2">
      <li v-for="tag in tags" :key="tag.slug">
        <NuxtLink
          :to="viewCategory(tag.slug)"
          class="group flex items-center justify-between gap-4 rounded-lg px-4 py-3.5 ring ring-default transition-colors hover:bg-elevated/50 hover:ring-primary/40"
        >
          <span class="font-medium text-highlighted group-hover:text-primary">{{ tag.label }}</span>
          <UBadge :label="String(tag.total)" color="neutral" variant="subtle" size="sm" />
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-muted">
      Todavía no hay categorías.
    </p>
  </UContainer>
</template>
