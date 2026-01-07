<script setup lang="ts">
import BlogProfile from '@/components/blog/BlogProfile.vue'

defineProps<{
  blog: any
}>()

const { formatDate } = useDayjsUtils()
</script>

<template>
  <header>
    <p class="text-3xl sm:text-4xl text-pretty font-bold text-primary">
      {{ blog?.title }}
    </p>
    <div class="flex items-center">
      <BlogProfile />
      <div class="ml-3">
        <p class="font-bold text-xl">
          {{ blog?.author }}
        </p>
        <div class="flex items-center gap-1">
          <UIcon name="mdi-calendar" class="size-5" />
          <p>{{ formatDate(blog.date) }}</p>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="mdi-clock-time-eight-outline" class="size-5" />
          <p>{{ blog.time }}</p>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="tag in blog.tags"
        :key="tag"
        size="md"
      >
        {{ tag }}
      </UBadge>
    </div>
  </header>
</template>

<style lang="scss" scoped>
h1 {
  color: rgb(var(--v-theme-primary));
  font-size: 3rem;
  line-height: 1;
  margin-top: 2.5rem;
  margin-bottom: 4rem;
}
.tags-container {
  gap: 5px;
}
</style>
