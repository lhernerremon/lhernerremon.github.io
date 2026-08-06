<script setup lang="ts">
withDefaults(defineProps<{
  url: string
  alt?: string
  caption?: string
  maxWidth?: number | string
}>(), {
  alt: '',
  caption: '',
  maxWidth: 480,
})
</script>

<template>
  <figure class="my-8 flex flex-col items-center gap-2">
    <img
      :src="url"
      :alt="alt"
      :style="{ maxWidth: `${maxWidth}px` }"
      class="w-full rounded border border-default"
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
    >

    <figcaption v-if="caption" class="meta-label text-center text-muted">
      {{ caption }}
    </figcaption>
  </figure>
</template>
