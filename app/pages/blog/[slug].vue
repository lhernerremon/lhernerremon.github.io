<script setup lang="ts">
import BlogHeader from '@/components/blog/BlogHeader.vue'

const route = useRoute()

const { data: blog } = await useAsyncData(route.path, () => queryCollection('blog').where('path', '=', route.path).first())
</script>

<template>
  <UContainer v-if="blog">
    <UPageHeader>
      <BlogHeader :blog="blog" />
    </UPageHeader>

    <UPage v-if="blog" class="d-flex">
      <UPageBody>
        <ContentRenderer :value="blog" />
      </UPageBody>
      <template v-if="blog?.body?.toc?.links?.length" #right>
        <UContentToc :links="blog.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>
