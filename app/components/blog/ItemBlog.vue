<script setup lang="ts">
import BlogProfile from '@/components/blog/BlogProfile.vue'

defineProps<{
  blog: any
}>()

const { formatDate } = useDayjsUtils()
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <NuxtLink :to="blog.path" class="text-xl text-primary">
        {{ blog.title }}
      </NuxtLink>
    </template>

    <section class="flex flex-col gap-2">
      <div class="flex items-center gap-1 -ml-2">
        <BlogProfile width="40" />
        <p class="text-lg">
          {{ blog.author }}
        </p>
      </div>
      <section class="text-muted text-sm flex flex-col gap-1">
        <div class="flex items-center gap-1">
          <UIcon name="mdi-calendar" class="size-5" />
          <p>{{ formatDate(blog.date) }}</p>
        </div>
        <div class="flex items-center gap-1">
          <UIcon name="mdi-clock-time-eight-outline" class="size-5" />
          <p>{{ blog.time }}</p>
        </div>
        <div>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="tag in blog.tags"
              :key="tag"
              size="md"
            >
              {{ tag }}
            </UBadge>
          </div>
        </div>
      </section>
    </section>
  </UCard>
</template>

<style scoped lang="scss">
a {
  white-space: wrap;
}
.tags-container {
  gap: 5px
}
</style>
