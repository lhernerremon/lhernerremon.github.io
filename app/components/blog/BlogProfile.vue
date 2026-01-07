<script setup lang="ts">
withDefaults(defineProps<{
  width?: number | string
}>(), {
  width: 110,
})

const { getRandomInt } = useUtils()

const imageUrl = ref('/profiles/lemon.png')
onMounted(() => {
  const randomNumber = getRandomInt({ max: 7 })
  imageUrl.value = `/profiles/lemon${randomNumber}.png`
})
</script>

<template>
  <img :src="imageUrl" :width="width" :max-width="width">
</template>

<style scoped lang="scss">
img {
  filter: drop-shadow(1px 1px 1px var(--ui-primary));
}
</style>
