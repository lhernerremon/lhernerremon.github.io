<script setup lang="ts">
// Sobreescribe el ProseA de Nuxt UI: los enlaces externos del Markdown abren en pestaña nueva sin
// escribir atributos a mano. La sintaxis inline `{target="_blank"}` la rompe cualquier formateador
// de Markdown al escapar el guion bajo.
const props = defineProps<{
  href?: string
  target?: string
}>()

const isExternal = computed(() => /^https?:\/\//.test(props.href || ''))
</script>

<template>
  <ULink
    :href="href"
    :target="target || (isExternal ? '_blank' : undefined)"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    raw
    class="text-primary underline underline-offset-4 hover:opacity-80"
  >
    <slot />
  </ULink>
</template>
