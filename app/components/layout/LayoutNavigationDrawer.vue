<script setup lang="ts">

</script>

<template>
  <VNavigationDrawer v-bind="$attrs" temporary>
    <VList>
      <VListItem prepend-icon="mdi-home" title="Home" to="/" />
      <VListItem prepend-icon="mdi-format-list-bulleted-square" title="Categories" to="/categories" />
    </VList>
  </VNavigationDrawer>
</template>

<style scoped>
</style>
