<script setup lang="ts">
const watchSearch = ref(false)
const search = ref('')
</script>

<template>
  <div class="d-flex align-center">
    <VExpandXTransition>
      <div v-show="watchSearch" class="search-container">
        <VTextField
          v-model="search"
          color="primary"
          label="Buscar"
          variant="underlined"
          hide-details
          clearable
          density="compact"
          @click:clear="watchSearch = false"
        />
      </div>
    </VExpandXTransition>
    <VBtn
      class="mx-2"
      icon="mdi-magnify"
      size="small"
      color="primary"
      @click="watchSearch = !watchSearch" />
  </div>
</template>

<style scoped>
.search-container {
  width: 300px;
  margin-left: 12px;
}
</style>
