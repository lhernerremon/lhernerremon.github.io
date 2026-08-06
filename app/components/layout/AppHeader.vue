<script setup lang="ts">
import BlogProfile from '@/components/blog/BlogProfile.vue'
import { VIEW_HOME, VIEW_CATEGORIES } from '@/utils/constants.views'

const route = useRoute()

const items = [
  { label: 'Blog', to: VIEW_HOME },
  { label: 'Categorías', to: VIEW_CATEGORIES },
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur">
    <div class="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
      <NuxtLink :to="VIEW_HOME" class="flex items-center gap-2 font-semibold hover:text-primary">
        <BlogProfile :size="34" alt="" />
        Blog
      </NuxtLink>

      <nav aria-label="Principal" class="flex items-center gap-1">
        <UButton
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          :color="route.path === item.to ? 'primary' : 'neutral'"
          variant="ghost"
          size="sm"
        >
          {{ item.label }}
        </UButton>

        <UColorModeButton class="ml-1" />
      </nav>
    </div>
  </header>
</template>
