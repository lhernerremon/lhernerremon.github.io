<script setup lang="ts">
import { randomAvatar } from '@/utils/avatar'

withDefaults(defineProps<{
  size?: number
  alt?: string
}>(), {
  size: 56,
  alt: '',
})

// Se resuelve una vez por instancia: así cada tarjeta muestra un limón distinto y estable.
const src = randomAvatar()
</script>

<template>
  <img
    :src="src"
    :width="size"
    :height="size"
    :alt="alt"
    class="shrink-0 select-none"
    loading="lazy"
    decoding="async"
  >
</template>

<style scoped>
img {
  filter: drop-shadow(0 3px 6px color-mix(in oklch, var(--ui-primary) 22%, transparent));
  transition: filter 0.25s ease, transform 0.25s ease;
}
</style>
