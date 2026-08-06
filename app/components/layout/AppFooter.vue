<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-20 border-t border-default">
    <div class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-6 sm:px-6">
      <p class="meta-label text-muted">
        © {{ year }}
      </p>

      <UButton
        to="https://github.com/lhernerremon"
        icon="mdi-github"
        color="neutral"
        variant="ghost"
        size="sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Perfil de GitHub (se abre en una pestaña nueva)"
      />
    </div>
  </footer>
</template>
