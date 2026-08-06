<script setup lang="ts">
import ItemBlog from '@/components/blog/ItemBlog.vue'
import { VIEW_CATEGORIES } from '@/utils/constants.views'
import { slugify } from '@/utils/slug'

const route = useRoute()
const slug = String(route.params.slug)

const { listPostsByTag } = useBlog()
const { setPageSeo } = useSeo()

const { data: blogs } = await listPostsByTag(slug)

if (!blogs.value.length) {
  throw createError({ statusCode: 404, statusMessage: 'Categoría no encontrada', fatal: true })
}

const label = computed(() => {
  const tags = blogs.value.flatMap(blog => blog.tags || [])
  return tags.find(tag => slugify(tag) === slug) || slug
})

setPageSeo({
  title: label.value,
  description: `Publicaciones sobre ${label.value} en el blog: ${blogs.value.length} ${blogs.value.length === 1 ? 'entrada' : 'entradas'}.`,
})
</script>

<template>
  <UContainer class="max-w-3xl py-10 sm:py-14">
    <UButton
      :to="VIEW_CATEGORIES"
      icon="mdi-arrow-left"
      color="neutral"
      variant="link"
      size="sm"
      class="-ml-2 mb-6"
    >
      Todas las categorías
    </UButton>

    <div class="flex flex-col gap-2 pb-8">
      <h1 class="text-3xl font-bold text-highlighted sm:text-4xl">
        {{ label }}
      </h1>

      <p class="text-muted">
        {{ blogs.length }} {{ blogs.length === 1 ? 'publicación' : 'publicaciones' }}
      </p>
    </div>

    <div class="flex flex-col gap-4">
      <ItemBlog
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
      />
    </div>
  </UContainer>
</template>
