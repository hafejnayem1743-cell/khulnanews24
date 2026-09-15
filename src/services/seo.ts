import { NewsItem, SiteSettings, Category } from '../types';

// Convert English numbers to Bengali numerals
export function toBanglaNumber(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/[0-9]/g, digit => banglaDigits[parseInt(digit, 10)]);
}

// Convert numbers with commas to Bengali numerals (e.g. 24,500 -> ২৪,৫০০)
export function toBanglaCommaNumber(num: number | string): string {
  if (num === undefined || num === null) return '০';
  const parsed = typeof num === 'number' ? num : parseInt(num.toString(), 10) || 0;
  return toBanglaNumber(parsed.toLocaleString('en-US'));
}

// Compact metric format for high views, likes and shares (e.g. 24.5K -> ২৪.৫K, 125000 -> ১.২৫ লাখ)
export function toBanglaMetric(num: number | string): string {
  if (num === undefined || num === null) return '০';
  const val = typeof num === 'number' ? num : parseInt(num.toString(), 10) || 0;
  if (val <= 0) return '০';
  if (val >= 100000) {
    const lac = (val / 100000).toFixed(1).replace(/\.0$/, '');
    return `${toBanglaNumber(lac)} লাখ`;
  }
  if (val >= 1000) {
    const k = (val / 1000).toFixed(1).replace(/\.0$/, '');
    return `${toBanglaNumber(k)}K`;
  }
  return toBanglaNumber(val);
}

// Format ISO date to Bengali Date String
export function formatBanglaDate(isoDate: string, includeTime = false): string {
  try {
    const d = new Date(isoDate);
    const months = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    
    const dayName = days[d.getDay()];
    const dateNum = toBanglaNumber(d.getDate());
    const monthName = months[d.getMonth()];
    const yearNum = toBanglaNumber(d.getFullYear());

    let formatted = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
    
    if (includeTime) {
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
      hours = hours % 12 || 12;
      const hoursBn = toBanglaNumber(hours);
      const minutesBn = toBanglaNumber(minutes < 10 ? '0' + minutes : minutes);
      formatted += `, ${ampm} ${hoursBn}:${minutesBn}`;
    }
    return formatted;
  } catch {
    return isoDate;
  }
}

// Get live today's Bangla & English date
export function getLiveBanglaHeaderDate(): { englishDate: string; banglaDate: string } {
  const now = new Date();
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  
  const banglaDate = `${daysBn[now.getDay()]}, ${toBanglaNumber(now.getDate())} ${monthsBn[now.getMonth()]} ${toBanglaNumber(now.getFullYear())}`;
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const englishDate = now.toLocaleDateString('en-US', options);

  return { englishDate, banglaDate };
}

// 10 Khulna Division District URL slugs
export const KHULNA_DISTRICT_SLUGS = [
  'khulna',
  'bagerhat',
  'satkhira',
  'jashore',
  'jhenaidah',
  'magura',
  'narail',
  'kushtia',
  'chuadanga',
  'meherpur'
] as const;

// Generate Schema.org NewsArticle JSON-LD
export function generateNewsArticleSchema(news: NewsItem, settings: SiteSettings, siteUrl = window.location.origin) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${cleanSiteUrl}/news/${news.slug}`
    },
    'headline': news.title,
    'description': news.summary || news.seo?.metaDescription || news.title,
    'image': [news.featuredImage],
    'datePublished': news.publishedAt,
    'dateModified': news.updatedAt || news.publishedAt,
    'author': {
      '@type': 'Person',
      'name': news.authorName || 'খুলনা নিউজ ডেস্ক',
      'url': `${cleanSiteUrl}/author/${news.authorId || 'desk'}`
    },
    'publisher': {
      '@type': 'NewsMediaOrganization',
      'name': settings.websiteName || 'খুলনা নিউজ ২৪',
      'url': cleanSiteUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': settings.logoUrl || `${cleanSiteUrl}/icon.png`
      }
    },
    'articleSection': news.categoryName || 'খুলনা বিভাগ',
    'inLanguage': 'bn-BD',
    'keywords': (news.tags || [news.district, news.categoryName, 'খুলনা সংবাদ']).filter(Boolean).join(', ')
  };
  return JSON.stringify(schema, null, 2);
}

// Generate Schema.org BreadcrumbList JSON-LD
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>, siteUrl = window.location.origin) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((it, idx) => {
      const fullUrl = it.url.startsWith('http') ? it.url : `${cleanSiteUrl}${it.url.startsWith('/') ? '' : '/'}${it.url}`;
      return {
        '@type': 'ListItem',
        'position': idx + 1,
        'name': it.name,
        'item': fullUrl
      };
    })
  };
  return JSON.stringify(schema, null, 2);
}

// Generate Organization & WebSite JSON-LD for Homepage
export function generateWebSiteSchema(settings: SiteSettings, siteUrl = window.location.origin) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      'name': settings.websiteName || 'খুলনা নিউজ ২৪',
      'alternateName': ['Khulna News 24', 'খুলনা নিউজ ২৪', 'Khulna News', settings.englishBrandName || 'Khulna News 24'],
      'url': cleanSiteUrl,
      'logo': settings.logoUrl || `${cleanSiteUrl}/icon.png`,
      'sameAs': [settings.facebookUrl, settings.twitterUrl, settings.youtubeUrl].filter(Boolean),
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': `+88${(settings.phone || '01306721743').replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`,
        'contactType': 'newsroom',
        'areaServed': 'BD',
        'availableLanguage': ['bn', 'en']
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': settings.websiteName || 'খুলনা নিউজ ২৪',
      'alternateName': settings.englishBrandName || 'Khulna News 24',
      'url': cleanSiteUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${cleanSiteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  ];
  return JSON.stringify(schema, null, 2);
}

// Generate District CollectionPage Schema JSON-LD
export function generateDistrictSchema(
  districtBangla: string, 
  districtEnglish: string, 
  districtSlug: string, 
  newsList: NewsItem[], 
  settings: SiteSettings, 
  siteUrl = window.location.origin
) {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${districtBangla} জেলার খবর | ${settings.websiteName || 'খুলনা নিউজ ২৪'}`,
    'description': `${districtBangla} (${districtEnglish}) জেলার সর্বশেষ তাজা খবর, ব্রেকিং নিউজ, স্থানীয় সংবাদ ও জনজীবনের খবর পড়ুন।`,
    'url': `${cleanSiteUrl}/${districtSlug}`,
    'about': {
      '@type': 'AdministrativeArea',
      'name': districtBangla,
      'alternateName': districtEnglish
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': newsList.slice(0, 10).map((n, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'url': `${cleanSiteUrl}/news/${n.slug}`,
        'name': n.title
      }))
    }
  };
  return JSON.stringify(schema, null, 2);
}

// Generate Dynamic Sitemap XML with all 10 Khulna Division Districts
export function generateSitemapXml(newsList: NewsItem[], categories: Category[], siteUrl = window.location.origin): string {
  const publishedNews = newsList.filter(n => n.status === 'published');
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Home
  xml += `  <url>\n    <loc>${cleanSiteUrl}/</loc>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // All 10 Districts of Khulna Division (Priority 0.95, hourly updates)
  KHULNA_DISTRICT_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${cleanSiteUrl}/${slug}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.95</priority>\n  </url>\n`;
  });

  // Categories
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${cleanSiteUrl}/category/${cat.slug}</loc>\n    <changefreq>hourly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  // Real Published Articles
  publishedNews.forEach(news => {
    const lastMod = (news.updatedAt || news.publishedAt || new Date().toISOString()).slice(0, 10);
    xml += `  <url>\n    <loc>${cleanSiteUrl}/news/${news.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Important static/utility pages
  const staticPages = ['latest', 'about', 'contact', 'privacy', 'terms', 'editorial-policy', 'archive'];
  staticPages.forEach(page => {
    xml += `  <url>\n    <loc>${cleanSiteUrl}/${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  return xml;
}

// Generate Dynamic RSS 2.0 Feed XML
export function generateRssFeedXml(newsList: NewsItem[], settings: SiteSettings, siteUrl = window.location.origin): string {
  const publishedNews = newsList.filter(n => n.status === 'published').slice(0, 30);
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  
  let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n`;
  rss += `  <channel>\n`;
  rss += `    <title>${settings.websiteName || 'খুলনা নিউজ ২৪'} | ${settings.tagline || 'খুলনা ও ১০ জেলার সর্বশেষ খবর'}</title>\n`;
  rss += `    <link>${cleanSiteUrl}</link>\n`;
  rss += `    <description>${settings.defaultMetaDescription || 'খুলনা ও ১০ জেলার সর্বশেষ খবর'}</description>\n`;
  rss += `    <language>bn</language>\n`;
  rss += `    <atom:link href="${cleanSiteUrl}/rss.xml" rel="self" type="application/rss+xml" />\n`;
  
  publishedNews.forEach(news => {
    rss += `    <item>\n`;
    rss += `      <title><![CDATA[${news.title}]]></title>\n`;
    rss += `      <link>${cleanSiteUrl}/news/${news.slug}</link>\n`;
    rss += `      <guid isPermaLink="true">${cleanSiteUrl}/news/${news.slug}</guid>\n`;
    rss += `      <description><![CDATA[${news.summary}]]></description>\n`;
    rss += `      <category>${news.categoryName}</category>\n`;
    rss += `      <author>${news.authorName}</author>\n`;
    rss += `      <pubDate>${new Date(news.publishedAt).toUTCString()}</pubDate>\n`;
    rss += `    </item>\n`;
  });

  rss += `  </channel>\n`;
  rss += `</rss>`;
  return rss;
}

// Generate Robots.txt
export function generateRobotsTxt(siteUrl = window.location.origin): string {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  return `# Robots.txt for Khulna News 24 (${cleanSiteUrl})
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /login

Sitemap: ${cleanSiteUrl}/sitemap.xml
`;
}
