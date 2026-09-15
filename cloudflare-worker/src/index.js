/**
 * Cloudflare Worker for Khulna News 24
 * 100% Free-Tier Compatible News & RSS Collector with Cron Trigger
 *
 * Supported Endpoints:
 * - GET /api/news                 : Query latest collected news (?district=, ?limit=, ?id=)
 * - GET /api/news/:id             : Query specific news item by ID
 * - GET /api/article-image?url=   : Extract legitimate article image from source page meta tags
 * - GET /api/collect              : Trigger collection across all 10 districts
 * - GET /api/proxy-rss?url=       : Proxy RSS feed bypassing CORS
 * - GET /health                   : Health and status
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
};

// 10 Districts of Khulna Division with English slugs & Bengali names
const KHULNA_DISTRICTS = [
  {
    id: 'khulna',
    name: 'খুলনা',
    slug: 'khulna',
    keywords: ['খুলনা', 'খুলনার', 'রূপসা', 'দৌলতপুর', 'খালিশপুর', 'ডুমুরিয়া', 'পাইকগাছা', 'কয়রা', 'বটিয়াঘাটা', 'তেরখাদা', 'দিঘলিয়া', 'ফুলতলা', 'খুবি', 'কুয়েট', 'শিবা নদী', 'পশুর নদী', 'শিপইয়ার্ড']
  },
  {
    id: 'bagerhat',
    name: 'বাগেরহাট',
    slug: 'bagerhat',
    keywords: ['বাগেরহাট', 'বাগেরহাটের', 'মোংলা', 'মংলা', 'রামপাল', 'মোড়েলগঞ্জ', 'শরণখোলা', 'ফকিরহাট', 'কচুয়া', 'মোল্লাহাট', 'চিতলমারী', 'সুন্দরবন', 'ষাটগম্বুজ']
  },
  {
    id: 'satkhira',
    name: 'সাতক্ষীরা',
    slug: 'satkhira',
    keywords: ['সাতক্ষীরা', 'সাতক্ষীরার', 'কলারোয়া', 'তালা', 'কালীগঞ্জ সাতক্ষীরা', 'শ্যামনগর', 'আশাশুনি', 'দেবহাটা', 'ভোমরা', 'ভোমরা স্থলবন্দর']
  },
  {
    id: 'jashore',
    name: 'যশোর',
    slug: 'jashore',
    keywords: ['যশোর', 'যশোরের', 'বেনাপোল', 'অভয়নগর', 'নওয়াপাড়া', 'ঝিকরগাছা', 'শার্শা', 'বাঘারপাড়া', 'মণিরামপুর', 'কেশবপুর', 'চৌগাছা', 'যশোর বিমানবন্দর']
  },
  {
    id: 'narail',
    name: 'নড়াইল',
    slug: 'narail',
    keywords: ['নড়াইল', 'নড়াইলের', 'লোহাগড়া', 'কালিয়া', 'চিত্রা নদী', 'এস এম সুলতান']
  },
  {
    id: 'jhenaidah',
    name: 'ঝিনাইদহ',
    slug: 'jhenaidah',
    keywords: ['ঝিনাইদহ', 'ঝিনাইদহের', 'কালীগঞ্জ ঝিনাইদহ', 'কোটচাঁদপুর', 'মহেশপুর', 'শৈলকুপা', 'হরিণাকুণ্ডু', 'ইবি']
  },
  {
    id: 'magura',
    name: 'মাগুরা',
    slug: 'magura',
    keywords: ['মাগুরা', 'মাগুরার', 'শ্রীপুর মাগুরা', 'মহম্মদপুর', 'শালিখা']
  },
  {
    id: 'kushtia',
    name: 'কুষ্টিয়া',
    slug: 'kushtia',
    keywords: ['কুষ্টিয়া', 'কুষ্টিয়ার', 'কুমারখালী', 'ভেড়ামারা', 'মিরপুর কুষ্টিয়া', 'খোকসা', 'দৌলতপুর কুষ্টিয়া', 'লালন শাহ', 'রবীন্দ্রনাথ ঠাকুর শিলাইদহ', 'হার্ডিঞ্জ ব্রিজ', 'লালন সাঁই']
  },
  {
    id: 'chuadanga',
    name: 'চুয়াডাঙ্গা',
    slug: 'chuadanga',
    keywords: ['চুয়াডাঙ্গা', 'চুয়াডাঙ্গার', 'দর্শনা', 'জীবননগর', 'আলমডাঙ্গা', 'দামুড়হুদা', 'দর্শনা স্থলবন্দর']
  },
  {
    id: 'meherpur',
    name: 'মেহেরপুর',
    slug: 'meherpur',
    keywords: ['মেহেরপুর', 'মেহেরপুরের', 'মুজিবনগর', 'গাংনী']
  }
];

// Open RSS feeds covering Khulna and national regional desks
const RSS_FEEDS = [
  {
    name: 'প্রথম আলো (খুলনা)',
    url: 'https://www.prothomalo.com/api/v1/collections/khulna-news'
  },
  {
    name: 'দৈনিক ইত্তেফাক',
    url: 'https://www.ittefaq.com.bd/feed'
  },
  {
    name: 'কালের কণ্ঠ',
    url: 'https://www.kalerkantho.com/rss.xml'
  },
  {
    name: 'যুগান্তর',
    url: 'https://www.jugantor.com/feed/rss.xml'
  },
  {
    name: 'বিডিনিউজ২৪',
    url: 'https://bangla.bdnews24.com/?widgetName=rssfeed&widgetId=1150&getXmlFeed=true'
  },
  {
    name: 'জাগোনিউজ২৪ (খুলনা)',
    url: 'https://www.jagonews24.com/rss/rss.xml'
  }
];

// Runtime cache. Persistent storage is Cloudflare KV when NEWS_KV is configured.
// Memory is kept only as a fast fallback for the current isolate.
let globalNewsStore = [];
let lastCollectedAt = null;
const NEWS_KV_KEY = 'khulna-news-v9';
const META_KV_KEY = 'khulna-news-v9-meta';
const MAX_STORED_NEWS = 5000;

async function loadPersistentStore(env) {
  if (globalNewsStore.length > 0) return globalNewsStore;
  if (!env || !env.NEWS_KV) return globalNewsStore;
  try {
    const saved = await env.NEWS_KV.get(NEWS_KV_KEY, 'json');
    const meta = await env.NEWS_KV.get(META_KV_KEY, 'json');
    if (Array.isArray(saved)) globalNewsStore = saved;
    if (meta && meta.lastCollectedAt) lastCollectedAt = meta.lastCollectedAt;
  } catch (err) {
    console.error('KV load failed:', err);
  }
  return globalNewsStore;
}

async function savePersistentStore(env, items, collectedAt) {
  globalNewsStore = dedupeAndSortNews(items).slice(0, MAX_STORED_NEWS);
  lastCollectedAt = collectedAt || new Date().toISOString();
  if (!env || !env.NEWS_KV) return;
  try {
    await env.NEWS_KV.put(NEWS_KV_KEY, JSON.stringify(globalNewsStore));
    await env.NEWS_KV.put(META_KV_KEY, JSON.stringify({ lastCollectedAt }));
  } catch (err) {
    console.error('KV save failed:', err);
  }
}

function dedupeAndSortNews(items) {
  const seen = new Set();
  const unique = [];
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || !item.title || !item.url) continue;
    const key = (item.url || item.id || item.title).trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  unique.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
  return unique;
}

function stableId(prefix, value) {
  let hash = 2166136261;
  const text = String(value || '');
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `${prefix}-${(hash >>> 0).toString(36)}`;
}

export default {
  /**
   * Main HTTP Request Router
   */
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Health check & status
    if (pathname === '/' || pathname === '/health' || pathname === '/api/health') {
      await loadPersistentStore(env);
      return jsonResponse({
        ok: true,
        service: 'Khulna News 24 Collector Worker',
        districtsCovered: KHULNA_DISTRICTS.map(d => d.name),
        totalStored: globalNewsStore.length,
        lastCollectedAt,
        timestamp: new Date().toISOString()
      });
    }

    // 2. Query news: /api/news
    if (pathname === '/api/news') {
      const districtParam = url.searchParams.get('district');
      const limitParam = parseInt(url.searchParams.get('limit') || '35', 10);
      const idParam = url.searchParams.get('id');

      // Load persistent store first. Only collect on first-ever empty deployment.
      await loadPersistentStore(env);
      if (globalNewsStore.length === 0) {
        const collected = await collectAllNews();
        await savePersistentStore(env, collected, new Date().toISOString());
      }

      let results = [...globalNewsStore];

      // Filter by ID if specified
      if (idParam) {
        let item = results.find(n => n.id === idParam || n.url === idParam || n.url.includes(idParam));
        if (item) {
          item = await enrichItemMetadata(item);
          return jsonResponse({ ok: true, count: 1, district: item.district, news: [item] });
        }
        return jsonResponse({ ok: false, error: 'News item not found' }, 404);
      }

      // Filter by district if specified (matches Bengali name or English slug)
      if (districtParam && districtParam.trim()) {
        const cleanDist = districtParam.trim().toLowerCase();
        const distObj = KHULNA_DISTRICTS.find(d => 
          d.name === districtParam.trim() || 
          d.slug === cleanDist ||
          d.id === cleanDist
        );
        const targetBengali = distObj ? distObj.name : districtParam.trim();

        results = results.filter(n => 
          n.district === targetBengali || 
          (n.district && n.district.includes(targetBengali))
        );
      }

      // Sort by publication time descending
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Limit results
      const safeLimit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_STORED_NEWS) : 35;
      const limitedResults = results.slice(0, safeLimit);

      return jsonResponse({
        ok: true,
        count: limitedResults.length,
        district: districtParam || null,
        news: limitedResults
      });
    }

    // 3. Query single news by path: /api/news/:id
    if (pathname.startsWith('/api/news/')) {
      const newsId = decodeURIComponent(pathname.replace('/api/news/', '')).trim();
      await loadPersistentStore(env);
      if (globalNewsStore.length === 0) {
        const collected = await collectAllNews();
        await savePersistentStore(env, collected, new Date().toISOString());
      }

      let item = globalNewsStore.find(n => n.id === newsId || n.url.includes(newsId));
      if (item) {
        item = await enrichItemMetadata(item);
        return jsonResponse({ ok: true, count: 1, district: item.district, news: [item] });
      }
      return jsonResponse({ ok: false, error: 'News item not found' }, 404);
    }

    // 4. Extract legitimate article image from source URL meta tags
    if (pathname === '/api/article-image') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return jsonResponse({ ok: false, error: 'Missing ?url= parameter' }, 400);
      }

      try {
        const imageInfo = await extractArticleImage(targetUrl);
        return jsonResponse({ ok: true, url: targetUrl, image: imageInfo });
      } catch (err) {
        return jsonResponse({ ok: false, error: err.message, image: '' }, 500);
      }
    }

    // 4b. Extract complete public metadata (image, full description, title) from source URL
    if (pathname === '/api/article-meta') {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) {
        return jsonResponse({ ok: false, error: 'Missing ?url= parameter' }, 400);
      }

      try {
        const meta = await extractArticleMetadata(targetUrl);
        return jsonResponse({ ok: true, url: targetUrl, meta });
      } catch (err) {
        return jsonResponse({ ok: false, error: err.message }, 500);
      }
    }

    // 5. Trigger on-demand collection
    if (pathname === '/api/collect') {
      try {
        await loadPersistentStore(env);
        const collected = await collectAllNews();
        const merged = dedupeAndSortNews([...globalNewsStore, ...collected]);
        await savePersistentStore(env, merged, new Date().toISOString());

        return jsonResponse({
          ok: true,
          count: globalNewsStore.length,
          newCount: collected.length,
          timestamp: lastCollectedAt,
          news: globalNewsStore.slice(0, 20)
        });
      } catch (err) {
        return jsonResponse({ ok: false, error: 'Collection failed: ' + err.message }, 500);
      }
    }

    // 6. Proxy single RSS feed for CORS bypass
    if (pathname === '/api/proxy-rss') {
      const feedUrl = url.searchParams.get('url');
      if (!feedUrl) {
        return jsonResponse({ error: 'Missing ?url= parameter' }, 400);
      }

      try {
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/xml, text/xml, */*'
          }
        });

        const contentType = response.headers.get('content-type') || 'application/xml';
        const body = await response.text();

        return new Response(body, {
          status: response.status,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=300'
          }
        });
      } catch (err) {
        return jsonResponse({ error: 'Failed to fetch RSS: ' + err.message }, 500);
      }
    }

    return jsonResponse({ ok: false, error: 'Not found' }, 404);
  },

  /**
   * Cron Trigger (every 15 minutes)
   */
  async scheduled(event, env, ctx) {
    console.log(`Cron triggered at: ${new Date().toISOString()}`);
    ctx.waitUntil(
      loadPersistentStore(env)
        .then(() => collectAllNews())
        .then(async news => {
          const merged = dedupeAndSortNews([...globalNewsStore, ...news]);
          await savePersistentStore(env, merged, new Date().toISOString());
          console.log(`Cron completed: Stored ${globalNewsStore.length} Khulna news items.`);
        })
        .catch(err => {
          console.error('Cron error:', err);
        })
    );
  }
};

/**
 * Collects news from Ajker Patrika 10-district pages and RSS feeds
 */
async function collectAllNews() {
  const allItems = [];
  const seenUrls = new Set();

  // 1. Scrape Ajker Patrika for each of the 10 Khulna Division districts
  for (const dist of KHULNA_DISTRICTS) {
    try {
      const distItems = await fetchAjkerPatrikaDistrict(dist);
      for (const item of distItems) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          allItems.push(item);
        }
      }
    } catch (e) {
      console.warn(`Error fetching Ajker Patrika for ${dist.name}:`, e.message);
    }
  }

  // 2. Poll RSS Feeds
  for (const feed of RSS_FEEDS) {
    try {
      const feedItems = await fetchRssFeed(feed);
      for (const item of feedItems) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          allItems.push(item);
        }
      }
    } catch (e) {
      console.warn(`Error reading feed ${feed.name}:`, e.message);
    }
  }

  // Sort newest first
  allItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allItems;
}

/**
 * Scrapes Ajker Patrika district section with clean title/description separation
 * and reliable article image extraction.
 */
async function fetchAjkerPatrikaDistrict(district) {
  const url = `https://www.ajkerpatrika.com/bangladesh/${district.slug}`;
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  if (!resp.ok) return [];

  const html = await resp.text();
  const items = [];

  // Match article cards with link, image, title, and description
  // Ajker Patrika card pattern: <a href="(/bangladesh/...)">...<img src="(...)">...<h2><span>(Title)</span></h2>...<p>(Description)</p>...</a>
  const cardRegex = /<a[^>]+href=["'](\/bangladesh\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let cardMatch;

  while ((cardMatch = cardRegex.exec(html)) !== null) {
    const rawPath = cardMatch[1];
    const inner = cardMatch[2];

    const fullUrl = rawPath.startsWith('http') ? rawPath : `https://www.ajkerpatrika.com${rawPath}`;

    // Extract Headline from <h2>, <h3>, or <h4>
    const titleMatch = /<h[2-4][^>]*>(?:<span[^>]*>)?([\s\S]*?)(?:<\/span>)?<\/h[2-4]>/i.exec(inner);
    let title = '';
    if (titleMatch) {
      title = cleanText(titleMatch[1]);
    }

    // Extract full factual Description from <p> without artificial truncation
    const descMatch = /<p[^>]*>([\s\S]*?)<\/p>/i.exec(inner);
    let description = '';
    if (descMatch) {
      description = cleanText(descMatch[1]);
    }

    // Extract legitimate image: try src, data-src, or srcset
    let image = '';
    const imgMatch = /<img[^>]+(?:src|data-src)=["']([^"']+)["']/i.exec(inner);
    if (imgMatch && !imgMatch[1].includes('data:image') && !imgMatch[1].includes('placeholder')) {
      image = imgMatch[1];
    } else {
      const srcsetMatch = /<img[^>]+srcset=["']([^"']+)["']/i.exec(inner);
      if (srcsetMatch) {
        const firstSrc = srcsetMatch[1].split(',')[0].trim().split(' ')[0];
        if (firstSrc && !firstSrc.includes('data:image')) {
          image = firstSrc;
        }
      }
    }

    // If title is valid and not empty
    if (title && title.length > 5) {
      // Generate clean stable ID from URL slug
      const urlParts = fullUrl.split('/');
      const slugId = urlParts[urlParts.length - 1] || Math.random().toString(36).slice(2, 8);
      const articleId = `ap-${district.slug}-${slugId}`;

      items.push({
        id: articleId,
        title,
        description: description || '',
        url: fullUrl,
        publishedAt: new Date().toISOString(),
        image: image || '', // Empty string if no legitimate image found (NO random image!)
        source: 'আজকের পত্রিকা',
        district: district.name,
        collectedAt: new Date().toISOString()
      });
    }
  }

  return items;
}

/**
 * Parse RSS feeds with full enclosure, media:content, and <img> detection
 */
async function fetchRssFeed(feed) {
  const resp = await fetch(feed.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; KhulnaNews24Bot/2.0; +https://khulnanews24.com)',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
  });

  if (!resp.ok) return [];

  const xmlText = await resp.text();
  const items = [];
  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemBlock = match[1];

    const titleMatch = /<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i.exec(itemBlock);
    const title = cleanText(titleMatch ? (titleMatch[1] || titleMatch[2]) : '');

    const linkMatch = /<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i.exec(itemBlock);
    const link = (linkMatch ? (linkMatch[1] || linkMatch[2]) : '').trim();

    const descMatch = /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i.exec(itemBlock);
    const rawDesc = descMatch ? (descMatch[1] || descMatch[2]) : '';
    
    // Check if full content:encoded is available
    const contentMatch = /<content:encoded>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/content:encoded>/i.exec(itemBlock);
    const rawContent = contentMatch ? (contentMatch[1] || contentMatch[2]) : '';
    
    const cleanDesc = cleanText(rawDesc);
    const cleanContent = cleanText(rawContent);
    const description = (cleanContent && cleanContent.length > cleanDesc.length) ? cleanContent : cleanDesc;

    const dateMatch = /<pubDate>(.*?)<\/pubDate>/i.exec(itemBlock);
    const pubDate = dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString();

    // Legitimate image detection
    let imageUrl = '';
    const enclosureMatch = /<enclosure[^>]+url=["']([^"']+)["']/i.exec(itemBlock);
    const mediaContentMatch = /<media:content[^>]+url=["']([^"']+)["']/i.exec(itemBlock);
    const imgTagMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(rawDesc);
    const mediaThumbMatch = /<media:thumbnail[^>]+url=["']([^"']+)["']/i.exec(itemBlock);

    if (enclosureMatch && enclosureMatch[1]) {
      imageUrl = enclosureMatch[1];
    } else if (mediaContentMatch && mediaContentMatch[1]) {
      imageUrl = mediaContentMatch[1];
    } else if (imgTagMatch && imgTagMatch[1]) {
      imageUrl = imgTagMatch[1];
    } else if (mediaThumbMatch && mediaThumbMatch[1]) {
      imageUrl = mediaThumbMatch[1];
    }

    if (title && link) {
      // Check if item belongs to Khulna Division
      const detectedDistrict = detectDistrict(title + ' ' + description);
      if (detectedDistrict) {
        items.push({
          id: stableId('rss', link),
          title,
          description,
          url: link,
          publishedAt: pubDate,
          image: imageUrl || '', // Empty if not available; UI handles neutral placeholder
          source: feed.name,
          district: detectedDistrict.name,
          collectedAt: new Date().toISOString()
        });
      }
    }
  }

  return items;
}

/**
 * Extracts OpenGraph or Twitter Card image from any article page
 */
async function extractArticleImage(pageUrl) {
  const meta = await extractArticleMetadata(pageUrl);
  return meta ? meta.image : '';
}

/**
 * Extracts OpenGraph metadata (image, full description, title) from public article page
 */
async function extractArticleMetadata(pageUrl) {
  try {
    const resp = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!resp.ok) return null;

    const html = await resp.text();

    // 1. Extract image
    let image = '';
    const ogImg = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
                  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i.exec(html);
    if (ogImg && ogImg[1]) {
      image = ogImg[1];
    } else {
      const twImg = /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
                    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i.exec(html);
      if (twImg && twImg[1]) image = twImg[1];
    }

    // 2. Extract description (from meta description, og:description, twitter:description, or lead story paragraph)
    let description = '';
    const ogDesc = /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
                   /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i.exec(html);
    if (ogDesc && ogDesc[1]) {
      description = cleanText(ogDesc[1]);
    }

    if (!description) {
      const metaDesc = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i.exec(html) ||
                       /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i.exec(html);
      if (metaDesc && metaDesc[1]) {
        description = cleanText(metaDesc[1]);
      }
    }

    // If still empty, check for lead paragraph in article body (e.g. .story-details <p> or <article> <p>)
    if (!description) {
      const leadP = /<div[^>]+class=["'][^"']*story-details[^"']*["'][\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i.exec(html) ||
                    /<article[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i.exec(html);
      if (leadP && leadP[1]) {
        description = cleanText(leadP[1]);
      }
    }

    return { image: image || '', description: description || '' };
  } catch (err) {
    return null;
  }
}

/**
 * Enriches a news item if its description is short or image is missing
 */
async function enrichItemMetadata(item) {
  if (!item || !item.url) return item;
  if (item.description && item.description.length > 60 && item.image) return item;

  try {
    const meta = await extractArticleMetadata(item.url);
    if (meta) {
      if ((!item.description || item.description.length < 60) && meta.description && meta.description.length > (item.description || '').length) {
        item.description = meta.description;
      }
      if (!item.image && meta.image) {
        item.image = meta.image;
      }
    }
  } catch (err) {
    // Ignore enrichment errors
  }

  return item;
}

/**
 * Detect Khulna District from Bengali text
 */
function detectDistrict(text) {
  if (!text) return null;
  const lowerText = text.toLowerCase();

  for (const dist of KHULNA_DISTRICTS) {
    for (const kw of dist.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        return dist;
      }
    }
  }

  if (lowerText.includes('খুলনা')) {
    return KHULNA_DISTRICTS[0];
  }

  return null;
}

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
