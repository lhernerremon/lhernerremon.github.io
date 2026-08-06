import { queryCollection } from '@nuxt/content/server'
import { slugify } from '../utils/slug'

interface ISitemapEntry {
  loc: string
  lastmod?: string
}

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const posts = await queryCollection(event, 'blog').order('date', 'DESC').all()

  const tagSlugs = [...new Set(posts.flatMap(post => (post.tags || []).map(slugify)))]
  const entries: ISitemapEntry[] = [
    { loc: '/', lastmod: posts[0]?.date },
    { loc: '/categories' },
    ...posts.map(post => ({ loc: post.path, lastmod: post.date })),
    ...tagSlugs.map(slug => ({ loc: `/categories/${slug}` })),
  ]

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const urls = entries.map(({ loc, lastmod }) => {
    const url = new URL(loc, siteUrl).toString()
    return `  <url><loc>${url}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
})
