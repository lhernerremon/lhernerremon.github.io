import type { BlogCollectionItem } from '@nuxt/content'
import { avatarForKey } from '@/utils/avatar'

interface IPageSeo {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}

export default () => {
  const route = useRoute()
  const { siteUrl, siteName, siteDescription } = useRuntimeConfig().public

  const absoluteUrl = (path = route.path) => new URL(path, siteUrl).toString()

  const setPageSeo = ({ title, description, image, type = 'website' }: IPageSeo) => {
    const canonical = absoluteUrl()
    const ogImage = absoluteUrl(image || '/profiles/lemon0.png')
    // Sin titleTemplate global: el shell estático se genera sin pasar por las páginas y quedaría
    // con el nombre del sitio duplicado.
    const pageTitle = title === siteName ? title : `${title} · ${siteName}`

    useSeoMeta({
      title: pageTitle,
      description,
      ogTitle: title,
      ogDescription: description,
      ogType: type,
      ogUrl: canonical,
      ogImage,
      ogSiteName: siteName,
      ogLocale: 'es',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
    })

    useHead({ link: [{ rel: 'canonical', href: canonical }] })
  }

  const setPostSeo = (post: BlogCollectionItem) => {
    setPageSeo({
      title: post.title,
      description: post.description,
      image: avatarForKey(post.path),
      type: 'article',
    })

    useSeoMeta({
      articlePublishedTime: post.date,
      articleTag: post.tags,
    })

    useHead({
      script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          'headline': post.title,
          'description': post.description,
          'datePublished': post.date,
          'inLanguage': 'es',
          'keywords': post.tags,
          'mainEntityOfPage': absoluteUrl(post.path),
          'author': { '@type': 'Person', 'name': post.author },
          'publisher': { '@type': 'Person', 'name': post.author },
        }),
      }],
    })
  }

  return {
    siteUrl,
    siteName,
    siteDescription,
    absoluteUrl,
    setPageSeo,
    setPostSeo,
  }
}
