<script setup lang="ts">
import { slugify } from '@/utils/slug'
import { viewCategory } from '@/utils/constants.views'

withDefaults(defineProps<{
  tags?: string[]
}>(), {
  tags: () => [],
})
</script>

<template>
  <ul v-if="tags.length" class="flex flex-wrap items-center gap-1.5">
    <li v-for="tag in tags" :key="tag">
      <UButton
        :to="viewCategory(slugify(tag))"
        color="neutral"
        variant="subtle"
        size="xs"
      >
        {{ tag }}
      </UButton>
    </li>
  </ul>
</template>
