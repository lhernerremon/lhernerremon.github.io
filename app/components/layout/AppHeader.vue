<script setup lang="ts">
import BlogProfile from '@/components/blog/BlogProfile.vue'

const items = [
  {
    label: 'Blog',
    to: '/',
  }, {
    label: 'Categorías',
    to: '/categories',
  },
]
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <BlogProfile width="50" />
        <p class="text-2xl font-bold">Blog</p>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
