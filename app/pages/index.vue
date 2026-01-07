<script setup lang="ts">
import ItemBlog from '@/components/blog/ItemBlog.vue'

const { start, finish } = useLoadingIndicator()

const blogs = ref<any[]>([])
const getBlogs = async () => {
  blogs.value = []

  start()
  const { data } = await useAsyncData('blogs', () => queryCollection('blog').order('date', 'DESC').all())
  blogs.value = data.value || []
  finish()
}

onMounted(async () => {
  await getBlogs()
})

const socials = [
  { icon: 'mdi-github', link: 'https://github.com/lhernerremon' },
]

const openTarget = (v: string) => {
  if (!v) return
  window.open(v, '_blank')
}
</script>

<template>
  <UContainer as="section">
    <UPageBody class="flex flex-col gap-10">
      <div class="flex justify-center items-center">
        <UIcon
          v-for="social in socials"
          :key="social.icon"
          size="35"
          :name="social.icon"
          @click="() => { openTarget(social.link) }"
        />
      </div>

      <div class="flex flex-col items-center gap-3">
        <ItemBlog
          v-for="blog in blogs"
          :key="blog.id"
          :blog="blog"
          class="max-w-3xl w-full"
        />
      </div>
    </UPageBody>
  </UContainer>
</template>
