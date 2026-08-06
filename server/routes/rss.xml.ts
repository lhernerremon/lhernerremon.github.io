import { queryCollection } from '@nuxt/content/server'

const escapeXml = (value = '') => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default defineEventHandler(async (event) => {
  const { siteUrl, siteName, siteDescription } = useRuntimeConfig(event).public
  const posts = await queryCollection(event, 'blog').order('date', 'DESC').all()

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  const items = posts.map((post) => {
    const url = new URL(post.path, siteUrl).toString()
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>es</language>
${items.join('\n')}
  </channel>
</rss>
`
})
