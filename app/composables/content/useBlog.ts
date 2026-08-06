import type { BlogCollectionItem } from '@nuxt/content'
import type { ITagSummary } from '@/interfaces/blog/tag.interfaces'
import { slugify } from '@/utils/slug'

export default () => {
  const listPosts = () => {
    return useAsyncData('blog:list', () => {
      return queryCollection('blog').order('date', 'DESC').all()
    }, { default: () => [] as BlogCollectionItem[] })
  }

  const getPostByPath = (path: string) => {
    return useAsyncData(`blog:post:${path}`, () => {
      return queryCollection('blog').where('path', '=', path).first()
    })
  }

  const listTags = () => {
    return useAsyncData('blog:tags', async () => {
      const posts = await queryCollection('blog').all()
      const summaries = new Map<string, ITagSummary>()

      for (const post of posts) {
        for (const tag of post.tags || []) {
          const slug = slugify(tag)
          const current = summaries.get(slug)
          if (current) current.total++
          else summaries.set(slug, { label: tag, slug, total: 1 })
        }
      }

      return [...summaries.values()].sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))
    }, { default: () => [] as ITagSummary[] })
  }

  const listPostsByTag = (slug: string) => {
    return useAsyncData(`blog:tag:${slug}`, async () => {
      const posts = await queryCollection('blog').order('date', 'DESC').all()
      return posts.filter(post => (post.tags || []).some(tag => slugify(tag) === slug))
    }, { default: () => [] as BlogCollectionItem[] })
  }

  return {
    listPosts,
    getPostByPath,
    listTags,
    listPostsByTag,
  }
}
