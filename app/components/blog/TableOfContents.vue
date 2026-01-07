<script setup lang="ts">
defineEmits(['scrollTo'])
const props = defineProps({
  data: { type: Array, default: () => null }
})

const tocLinks = computed(() => props.data?.body?.toc?.links || [])
</script>
<template>
  <VNavigationDrawer location="right" floating>
    <VList lines="two">
      <VListItem v-for="toc in tocLinks" :key="toc.id" active-class="router-link-active" :to="`#${toc.id}`">
        {{ toc.text }}
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<style scoped>
li {
  border-left: 2px solid grey;
}
.router-link-active {
  border-left-color: red;
}
</style>
