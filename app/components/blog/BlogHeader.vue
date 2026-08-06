<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'
import BlogProfile from '@/components/blog/BlogProfile.vue'

defineProps<{
  blog: BlogCollectionItem
}>()

const { formatDate } = useDayjsUtils()
</script>

<template>
  <header class="flex flex-col gap-6 border-b border-default pb-8">
    <h1 class="text-3xl font-bold text-pretty text-highlighted sm:text-4xl">
      {{ blog.title }}
    </h1>

    <p class="max-w-prose text-lg text-pretty text-muted">
      {{ blog.description }}
    </p>

    <div class="flex flex-wrap items-center gap-3">
      <BlogProfile :size="44" alt="" />

      <div class="flex flex-col gap-0.5">
        <span class="text-sm font-medium text-highlighted">{{ blog.author }}</span>
        <span class="meta-label text-muted">
          <time :datetime="blog.date">{{ formatDate(blog.date) }}</time>
          · {{ blog.time }} de lectura
        </span>
      </div>
    </div>

    <BlogTagList :tags="blog.tags" />
  </header>
</template>
