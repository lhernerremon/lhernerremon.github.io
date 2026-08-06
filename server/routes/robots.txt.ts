export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('/sitemap.xml', siteUrl).toString()}`,
    '',
  ].join('\n')
})
