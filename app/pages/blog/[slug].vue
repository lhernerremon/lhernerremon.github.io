<script setup lang="ts">
import BlogHeader from '@/components/blog/BlogHeader.vue'
import { VIEW_HOME } from '@/utils/constants.views'

const route = useRoute()

const { getPostByPath } = useBlog()
const { setPostSeo } = useSeo()

const { data: blog } = await getPostByPath(route.path)

if (!blog.value) {
  throw createError({ statusCode: 404, statusMessage: 'Publicación no encontrada', fatal: true })
}

setPostSeo(blog.value)
</script>

<template>
  <UContainer v-if="blog" class="max-w-5xl py-12 sm:py-16">
    <UButton
      :to="VIEW_HOME"
      icon="mdi-arrow-left"
      color="neutral"
      variant="link"
      size="sm"
      class="-ml-2 mb-6"
    >
      Todas las publicaciones
    </UButton>

    <div class="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
      <article class="min-w-0">
        <BlogHeader :blog="blog" />

        <div class="mt-10">
          <ContentRenderer :value="blog" />
        </div>
      </article>

      <aside v-if="blog.body?.toc?.links?.length" class="hidden lg:block">
        <UContentToc :links="blog.body.toc.links" title="En esta página" highlight />
      </aside>
    </div>
  </UContainer>
</template>
