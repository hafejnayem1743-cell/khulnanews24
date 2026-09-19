import React, { useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { NewsItem } from '../../types';
import { 
  generateNewsArticleSchema, 
  generateBreadcrumbSchema, 
  generateWebSiteSchema 
} from '../../services/seo';

export interface SeoBreadcrumbItem {
  name: string;
  url: string;
}

interface SeoHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  news?: NewsItem;
  breadcrumbs?: SeoBreadcrumbItem[];
  jsonLdSchema?: string | object;
  noIndex?: boolean;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  news,
  breadcrumbs,
  jsonLdSchema,
  noIndex = false
}) => {
  const { siteSettings } = useNews();
  const brandName = siteSettings.websiteName || 'খুলনা নিউজ ২৪';

  // Compute final title cleanly without duplicate brand suffix
  let finalTitle = siteSettings.defaultSeoTitle || 'খুলনা নিউজ ২৪ | খুলনা ও ১০ জেলার সর্বশেষ খবর';
  if (title) {
    if (title.includes('খুলনা নিউজ ২৪') || title.includes('Khulna News 24')) {
      finalTitle = title;
    } else {
      finalTitle = `${title} | ${brandName}`;
    }
  }

  // Clean description of any HTML markup and trim
  const rawDesc = description || (news?.summary) || siteSettings.defaultMetaDescription || '';
  const cleanDescription = rawDesc.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim().slice(0, 160);

  const finalImage = image || (news?.featuredImage) || siteSettings.defaultSocialImage || 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=1200&q=80';
  
  // Clean canonical URL without hashes or trailing slashes (except root)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://khulnanews24.pages.dev';
  let finalCanonicalUrl = url;
  if (!finalCanonicalUrl && typeof window !== 'undefined') {
    finalCanonicalUrl = `${origin}${window.location.pathname}`;
  }

  useEffect(() => {
    // 1. Title
    document.title = finalTitle;

    // Helper to create or update meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      if (!value) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const parts = selector.replace(/[\[\]]/g, '').split('=');
        if (parts.length === 2) {
          const [key, val] = parts;
          element.setAttribute(key, val.replace(/['"]/g, ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // 2. Standard Search Engine Meta
    setMetaTag('meta[name="description"]', 'content', cleanDescription);
    setMetaTag(
      'meta[name="robots"]', 
      'content', 
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 3. Open Graph (Facebook, WhatsApp, LinkedIn)
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', cleanDescription);
    setMetaTag('meta[property="og:image"]', 'content', finalImage);
    if (finalCanonicalUrl) {
      setMetaTag('meta[property="og:url"]', 'content', finalCanonicalUrl);
    }
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:site_name"]', 'content', brandName);
    setMetaTag('meta[property="og:locale"]', 'content', 'bn_BD');
    setMetaTag('meta[property="og:image:alt"]', 'content', finalTitle);
    setMetaTag('meta[property="og:image:type"]', 'content', 'image/jpeg');

    // 4. Twitter / X Cards
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', cleanDescription);
    setMetaTag('meta[name="twitter:image"]', 'content', finalImage);
    setMetaTag('meta[name="twitter:url"]', 'content', finalCanonicalUrl || '');

    // 5. Article-specific meta tags
    if (type === 'article' && news) {
      setMetaTag('meta[property="article:published_time"]', 'content', news.publishedAt);
      if (news.updatedAt) {
        setMetaTag('meta[property="article:modified_time"]', 'content', news.updatedAt);
      }
      if (news.categoryName) {
        setMetaTag('meta[property="article:section"]', 'content', news.categoryName);
      }
      if (news.authorName) {
        setMetaTag('meta[property="article:author"]', 'content', news.authorName);
      }
    }

    // 6. Canonical link
    if (finalCanonicalUrl) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute('href', finalCanonicalUrl);
    }

    // 7. Primary Structured Data JSON-LD
    let mainScriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    let schemaContent: string | null = null;

    if (news) {
      schemaContent = generateNewsArticleSchema(news, siteSettings, origin);
    } else if (jsonLdSchema) {
      schemaContent = typeof jsonLdSchema === 'string' ? jsonLdSchema : JSON.stringify(jsonLdSchema, null, 2);
    } else if (window.location.pathname === '/') {
      schemaContent = generateWebSiteSchema(siteSettings, origin);
    }

    if (schemaContent) {
      if (!mainScriptTag) {
        mainScriptTag = document.createElement('script');
        mainScriptTag.id = 'json-ld-schema';
        mainScriptTag.type = 'application/ld+json';
        document.head.appendChild(mainScriptTag);
      }
      mainScriptTag.text = schemaContent;
    } else if (mainScriptTag) {
      mainScriptTag.remove();
    }

    // 8. BreadcrumbList JSON-LD
    let breadcrumbScriptTag = document.getElementById('json-ld-breadcrumbs') as HTMLScriptElement | null;
    if (breadcrumbs && breadcrumbs.length > 0) {
      if (!breadcrumbScriptTag) {
        breadcrumbScriptTag = document.createElement('script');
        breadcrumbScriptTag.id = 'json-ld-breadcrumbs';
        breadcrumbScriptTag.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScriptTag);
      }
      breadcrumbScriptTag.text = generateBreadcrumbSchema(breadcrumbs, origin);
    } else if (breadcrumbScriptTag) {
      breadcrumbScriptTag.remove();
    }

  }, [
    finalTitle, 
    cleanDescription, 
    finalImage, 
    finalCanonicalUrl, 
    type, 
    news, 
    breadcrumbs, 
    jsonLdSchema, 
    noIndex, 
    siteSettings, 
    brandName, 
    origin
  ]);

  return null;
};
