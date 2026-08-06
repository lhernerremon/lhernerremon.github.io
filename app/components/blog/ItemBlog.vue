<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'
import BlogProfile from '@/components/blog/BlogProfile.vue'

defineProps<{
  blog: BlogCollectionItem
}>()

const { formatDate } = useDayjsUtils()
</script>

<template>
  <article class="group relative rounded-xl bg-default p-5 ring ring-default transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/5 sm:p-6">
    <div class="flex items-start gap-5">
      <BlogProfile :size="72" alt="" class="hidden sm:block group-hover:scale-[1.04]" />

      <div class="flex min-w-0 flex-col gap-2">
        <h2 class="text-lg font-semibold leading-snug text-highlighted sm:text-xl">
          <NuxtLink :to="blog.path" class="transition-colors after:absolute after:inset-0 group-hover:text-primary">
            {{ blog.title }}
          </NuxtLink>
        </h2>

        <p class="line-clamp-2 text-sm text-pretty text-muted">
          {{ blog.description }}
        </p>

        <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-dimmed">
          <BlogProfile :size="24" alt="" class="sm:hidden" />
          <span class="font-medium">{{ blog.author }}</span>
          <span aria-hidden="true">·</span>
          <time :datetime="blog.date">{{ formatDate(blog.date) }}</time>
          <span aria-hidden="true">·</span>
          <span>{{ blog.time }}</span>
        </div>

        <BlogTagList :tags="blog.tags" class="relative z-10 mt-2" />
      </div>
    </div>
  </article>
</template>
