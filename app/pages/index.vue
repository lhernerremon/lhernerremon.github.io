<script setup lang="ts">
import ItemBlog from '@/components/blog/ItemBlog.vue'

const { listPosts } = useBlog()
const { setPageSeo, siteName, siteDescription } = useSeo()

const { data: blogs } = await listPosts()

setPageSeo({
  title: siteName,
  description: siteDescription,
})
</script>

<template>
  <UContainer class="max-w-3xl py-10 sm:py-14">
    <h1 class="sr-only">
      Publicaciones
    </h1>

    <div class="flex flex-col gap-4">
      <ItemBlog
        v-for="blog in blogs"
        :key="blog.id"
        :blog="blog"
      />
    </div>

    <p v-if="!blogs?.length" class="text-muted">
      Todavía no hay publicaciones.
    </p>
  </UContainer>
</template>
