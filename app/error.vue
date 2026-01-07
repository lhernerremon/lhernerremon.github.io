<script lang="ts" setup>
const error = useError()
</script>

<template>
  <UApp>
    <UError
      redirect="/"
      :clear="{
        label: 'Volver al inicio',
        variant: 'subtle',
      }"
      :error="{
        statusCode: error?.statusCode || 404,
        statusMessage: 'Página no encontrada',
      }"
    />
  </UApp>
</template>
