<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded focus:bg-default focus:px-4 focus:py-2 focus:ring-2 focus:ring-primary">
      Saltar al contenido
    </a>

    <AppHeader />

    <main id="main" class="flex-1 w-full">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
