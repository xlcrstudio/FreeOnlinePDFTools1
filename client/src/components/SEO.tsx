import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  schema?: any
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage = 'https://free-online-pdf-tools.replit.app/og-image.jpg',
  noIndex = false,
  schema
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (element) {
        element.setAttribute('content', content)
      } else {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        element.setAttribute('content', content)
        document.head.appendChild(element)
      }
    }
    
    // Update primary meta tags
    updateMetaTag('description', description)
    updateMetaTag('title', title)
    
    if (keywords) {
      updateMetaTag('keywords', keywords)
    }
    
    // Update robots meta tag
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', ogImage, true)
    updateMetaTag('og:url', window.location.href, true)
    
    // Update Twitter Card tags (using name attribute per Twitter spec)
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', ogImage)
    updateMetaTag('twitter:url', window.location.href)
    
    // Update canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]')
      if (linkElement) {
        linkElement.setAttribute('href', canonical)
      } else {
        linkElement = document.createElement('link')
        linkElement.setAttribute('rel', 'canonical')
        linkElement.setAttribute('href', canonical)
        document.head.appendChild(linkElement)
      }
    }
    
    // Add structured data for individual tools
    if (schema) {
      // Remove existing tool schema
      const existingToolSchema = document.querySelector('script[data-tool-schema]')
      if (existingToolSchema) {
        existingToolSchema.remove()
      }
      
      // Create enhanced schema
      const toolSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title,
        description: description,
        url: canonical || window.location.href,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1000'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Free Online PDF Tools',
          url: 'https://free-online-pdf-tools.replit.app/'
        },
        ...schema
      }
      
      const scriptElement = document.createElement('script')
      scriptElement.type = 'application/ld+json'
      scriptElement.setAttribute('data-tool-schema', 'true')
      scriptElement.textContent = JSON.stringify(toolSchema, null, 2)
      document.head.appendChild(scriptElement)
    }
  }, [title, description, keywords, canonical, ogImage, noIndex, schema])
  
  return null
}