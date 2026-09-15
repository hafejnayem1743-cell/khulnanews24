import { NewsItem, WorkerNewsItem, WorkerNewsResponse } from '../types/index';

export const NEWS_API_BASE =
  'https://khulna-news-collector.hafejnayem1743.workers.dev';

const newsRegistry = new Map<string, NewsItem>();

export function registerNewsItems(items: NewsItem[]): void {
  if (!Array.isArray(items)) return;

  for (const item of items) {
    if (!item) continue;

    if (item.id) newsRegistry.set(item.id.trim().toLowerCase(), item);
    if (item.slug) newsRegistry.set(item.slug.trim().toLowerCase(), item);
    if (item.url) newsRegistry.set(item.url.trim().toLowerCase(), item);
    if (item.sourceUrl) {
      newsRegistry.set(item.sourceUrl.trim().toLowerCase(), item);
    }
  }
}

export function isNewsMatch(
  item: NewsItem,
  identifier: string
): boolean {
  if (!identifier || !item) return false;

  const target = decodeURIComponent(identifier).trim().toLowerCase();

  const itemId = (item.id || '').trim().toLowerCase();
  const itemSlug = (item.slug || '').trim().toLowerCase();

  if (itemId && itemId === target) return true;
  if (itemSlug && itemSlug === target) return true;

  if (
    itemId &&
    (target.endsWith(`-${itemId}`) || target.endsWith(itemId))
  ) {
    return true;
  }

  if (
    itemSlug &&
    (itemSlug.endsWith(`-${target}`) || itemSlug.endsWith(target))
  ) {
    return true;
  }

  if (item.url) {
    const cleanUrl = item.url.trim().toLowerCase();

    if (
      cleanUrl === target ||
      cleanUrl.endsWith(target) ||
      target.endsWith(cleanUrl)
    ) {
      return true;
    }

    const lastPart = cleanUrl.split('/').filter(Boolean).pop();

    if (
      lastPart &&
      (lastPart === target || target.includes(lastPart))
    ) {
      return true;
    }
  }

  if (item.sourceUrl) {
    const cleanSourceUrl = item.sourceUrl.trim().toLowerCase();

    if (
      cleanSourceUrl === target ||
      cleanSourceUrl.endsWith(target)
    ) {
      return true;
    }

    const lastPart = cleanSourceUrl.split('/').filter(Boolean).pop();

    if (
      lastPart &&
      (lastPart === target || target.includes(lastPart))
    ) {
      return true;
    }
  }

  return false;
}

export function findInNewsRegistry(
  identifier: string
): NewsItem | null {
  if (!identifier) return null;

  const target = decodeURIComponent(identifier)
    .trim()
    .toLowerCase();

  const direct = newsRegistry.get(target);

  if (direct) return direct;

  for (const item of newsRegistry.values()) {
    if (isNewsMatch(item, target)) {
      return item;
    }
  }

  return null;
}

export function splitMashedTitle(
  rawTitle: string,
  rawDesc?: string
): {
  title: string;
  description: string;
} {
  const normTitle = (rawTitle || '').trim().normalize('NFC');
  const cleanDesc = (rawDesc || '').trim();

  let extractedHeadline = normTitle;
  let extractedTeaser = '';

  if (normTitle.length >= 35) {
    const locations = [
      'চুয়াডাঙ্গা',
      'চুয়াডাঙ্গা',
      'কুষ্টিয়া',
      'কুষ্টিয়া',
      'মেহেরপুর',
      'যশোর',
      'খুলনা',
      'বাগেরহাট',
      'সাতক্ষীরা',
      'ঝিনাইদহ',
      'মাগুরা',
      'নড়াইল',
      'নড়াইল',
      'জীবননগর',
      'দৌলতপুর',
      'ভেড়ামারা',
      'ভেড়ামারা',
      'আলমডাঙ্গা',
      'দামুড়হুদা',
      'দামুড়হুদা',
      'গাংনী',
      'বেনাপোল',
      'মোংলা',
      'রূপসা',
      'ফুলতলা',
      'ডুমুরিয়া',
      'ডুমুরিয়া',
      'পাইকগাছা',
      'বটিয়াঘাটা',
      'মোরেলগঞ্জ',
      'শরণখোলা',
      'অভয়নগর',
      'অভয়নগর',
      'কেশবপুর',
      'বাঘারপাড়া',
      'বাঘারপাড়া',
      'মনিরামপুর',
      'ঝিকরগাছা',
      'শার্শা',
      'লোহাগড়া',
      'লোহাগড়া',
      'কালিয়া',
      'কালিয়া',
      'মহম্মদপুর',
      'শালিখা',
      'শ্রীপুর',
      'শৈলকূপা',
      'হরিণাকুণ্ডু',
      'কোটচাঁদপুর',
      'কালীগঞ্জ',
      'কালিগঞ্জ',
      'কলারোয়া',
      'কলারোয়া',
      'তালা',
      'শ্যামনগর',
      'আশাশুনি',
      'দেবহাটা',
      'ইসলামী বিশ্ব',
      'ইবি'
    ];

    for (const loc of locations) {
      const idx = normTitle.indexOf(` ${loc}`, 15);

      if (idx >= 15 && idx <= 130) {
        extractedHeadline = normTitle.substring(0, idx).trim();
        extractedTeaser = normTitle
          .substring(idx + 1)
          .trim();
        break;
      }
    }

    if (!extractedTeaser) {
      const phrases = [
        ' তাঁদের',
        ' তাদের',
        ' স্বজনদের',
        ' প্রত্যক্ষদর্শীদের',
        ' প্রত্যক্ষদর্শীরা',
        ' স্থানীয়রা',
        ' স্থানীয়রা',
        ' স্থানীয় সূত্রে',
        ' স্থানীয় সূত্রে',
        ' পুলিশ জানায়',
        ' পুলিশ জানিয়েছে',
        ' পুলিশ সূত্রে',
        ' পুলিশ বলে',
        ' খবর পেয়ে',
        ' গোপন সংবাদের',
        ' মামলায়',
        ' মামলার',
        ' আজ সোমবার',
        ' আজ মঙ্গলবার',
        ' আজ বুধবার',
        ' আজ বৃহস্পতিবার',
        ' আজ শুক্রবার',
        ' আজ শনিবার',
        ' আজ রোববার',
        ' আজ রবিবার',
        ' গতকাল',
        ' থানার ভারপ্রাপ্ত',
        ' উপজেলা নির্বাহী',
        ' প্রাথমিক অনুসন্ধানে',
        ' ঘটনার পর',
        ' এ সময়',
        ' এ ঘটনায়',
        ' এই ঘটনায়'
      ];

      for (const phrase of phrases) {
        const idx = normTitle.indexOf(phrase);

        if (idx >= 15 && idx <= 130) {
          extractedHeadline = normTitle
            .substring(0, idx)
            .trim();

          extractedTeaser = normTitle
            .substring(idx + 1)
            .trim();

          break;
        }
      }
    }

    if (!extractedTeaser) {
      const puncRegex = /[।?!]\s+/g;
      let match: RegExpExecArray | null;

      while ((match = puncRegex.exec(normTitle)) !== null) {
        const idx = match.index;

        if (idx >= 20 && idx <= 120) {
          extractedHeadline = normTitle
            .substring(0, idx)
            .trim();

          extractedTeaser = normTitle
            .substring(idx + match[0].length)
            .trim();

          break;
        }
      }
    }

    if (!extractedTeaser) {
      const colonIdx = normTitle.indexOf(':');

      if (colonIdx >= 15 && colonIdx <= 90) {
        const after = normTitle
          .substring(colonIdx + 1)
          .trim();

        if (after.length > 30) {
          extractedHeadline = normTitle
            .substring(0, colonIdx)
            .trim();

          extractedTeaser = after;
        }
      }
    }

    if (!extractedTeaser && normTitle.length > 120) {
      const sub = normTitle.substring(45, 95);
      const spaceIdx = sub.lastIndexOf(' ');

      if (spaceIdx > 0) {
        const splitPoint = 45 + spaceIdx;

        extractedHeadline = normTitle
          .substring(0, splitPoint)
          .trim();

        extractedTeaser = normTitle
          .substring(splitPoint + 1)
          .trim();
      }
    }
  }

  let finalDescription = cleanDesc;

  if (!finalDescription || finalDescription.length < 10) {
    finalDescription = extractedTeaser;
  } else if (
    extractedTeaser &&
    extractedTeaser.length > finalDescription.length
  ) {
    finalDescription = extractedTeaser;
  }

  return {
    title: extractedHeadline || normTitle,
    description: finalDescription || cleanDesc || ''
  };
}

function getDeterministicUniqueId(
  item: WorkerNewsItem
): string {
  if (item.id && item.id.trim()) {
    return item.id.trim();
  }

  const source = (
    item.url ||
    item.title ||
    ''
  ).trim();

  let hash = 0;

  for (let i = 0; i < source.length; i++) {
    hash =
      ((hash << 5) - hash) +
      source.charCodeAt(i);

    hash |= 0;
  }

  return `news-${Math.abs(hash).toString(36)}`;
}

function generateSlug(
  title: string,
  id: string
): string {
  const clean = (title || '')
    .replace(
      /[^\u0980-\u09FFa-zA-Z0-9\s-]/g,
      ''
    )
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

  const cleanId = (id || '').slice(0, 15);

  return clean
    ? `${clean}-${cleanId}`
    : cleanId || 'news';
}

export function mapWorkerItemToNewsItem(
  item: WorkerNewsItem
): NewsItem {
  const rawPublished = (item as any).publishedAt || (item as any).published_at || (item as any).date || (item as any).collectedAt;
  const parsedPublished = rawPublished ? new Date(rawPublished) : new Date();
  const pubDate = Number.isNaN(parsedPublished.getTime())
    ? new Date().toISOString()
    : parsedPublished.toISOString();

  const rawDistrict = String(
    (item as any).district || (item as any).districtName || (item as any).districtBn || ''
  ).trim();
  const districtMap: Record<string, string> = {
    'খুলনা':'Khulna','Khulna':'Khulna', 'বাগেরহাট':'Bagerhat','Bagerhat':'Bagerhat',
    'সাতক্ষীরা':'Satkhira','Satkhira':'Satkhira', 'যশোর':'Jashore','Jashore':'Jashore','Jessore':'Jashore',
    'নড়াইল':'Narail','নড়াইল':'Narail','Narail':'Narail', 'ঝিনাইদহ':'Jhenaidah','Jhenaidah':'Jhenaidah',
    'মাগুরা':'Magura','Magura':'Magura', 'কুষ্টিয়া':'Kushtia','কুষ্টিয়া':'Kushtia','Kushtia':'Kushtia',
    'চুয়াডাঙ্গা':'Chuadanga','চুয়াডাঙ্গা':'Chuadanga','Chuadanga':'Chuadanga', 'মেহেরপুর':'Meherpur','Meherpur':'Meherpur'
  };
  const districtName = districtMap[rawDistrict] || rawDistrict || 'Khulna';
  const sourceName = String((item as any).source || (item as any).sourceName || 'অনলাইন ডেস্ক').trim();
  const rawImage = String((item as any).image || (item as any).imageUrl || (item as any).featuredImage || '').trim();

  const articleId =
    getDeterministicUniqueId(item);

  const rawTitle = String((item as any).title || (item as any).headline || '').trim();

  const rawDesc = String((item as any).description || (item as any).summary || (item as any).content || '').trim();

  const split = splitMashedTitle(
    rawTitle,
    rawDesc
  );

  const finalTitle =
    split.title || rawTitle || 'শিরোনামহীন সংবাদ';

  const finalDescription =
    split.description || rawDesc || finalTitle;

  return {
    id: articleId,
    title: finalTitle,

    subTitle:
      `${districtName} জেলা সংবাদ`,

    slug:
      generateSlug(finalTitle, articleId),

    content: finalDescription,
    summary: finalDescription,
    description: finalDescription,

    featuredImage: rawImage,

    imageCaption: undefined,
    imageCredit: undefined,

    categoryId: 'cat-khulna',

    categoryName:
      `${districtName} জেলা`,

    authorId: 'auth-auto-desk',
    authorName:
      'খুলনা নিউজ ২৪ ডেস্ক',

    status: 'published',

    isFeatured: false,
    isTopNews: false,
    isBreaking: false,
    isTrending: false,

    priority: 3,

    viewCount: 0,

    tags: [
      districtName,
      'খুলনা বিভাগ'
    ].filter(Boolean),

    publishedAt: pubDate,

    updatedAt:
      item.collectedAt || pubDate,

    seo: {
      seoTitle:
        `${finalTitle} | খুলনা নিউজ ২৪`,

      metaDescription:
        finalDescription.slice(0, 160),

      focusKeywords: [
        districtName,
        'খুলনা বিভাগ সংবাদ',
        'খুলনা নিউজ ২৪'
      ]
    },

    allowComments: false,

    district: districtName,

    isAutoCollected: true,

    sourceName: sourceName,
    sourceUrl: String((item as any).url || (item as any).link || '').trim(),
    url: String((item as any).url || (item as any).link || '').trim(),
    source: sourceName
  };
}

export async function fetchWorkerNews(
  params?: {
    district?: string;
    limit?: number;
    timeoutMs?: number;
  }
): Promise<WorkerNewsResponse> {
  const url = new URL(
    `${NEWS_API_BASE}/api/news`
  );

  if (
    params?.district &&
    params.district.trim()
  ) {
    url.searchParams.set(
      'district',
      params.district.trim()
    );
  }

  if (
    params?.limit &&
    params.limit > 0
  ) {
    url.searchParams.set(
      'limit',
      params.limit.toString()
    );
  }

  const controller =
    new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    params?.timeoutMs || 10000
  );

  try {
    const response = await fetch(
      url.toString(),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function fetchHomepageNews(
  limit: number = 5000
): Promise<{
  ok: boolean;
  news: NewsItem[];
  count: number;
  error?: string;
}> {
  try {
    const response =
      await fetchWorkerNews({ limit: Math.min(Math.max(limit, 1), 5000) });

    if (
      response.ok &&
      Array.isArray(response.news)
    ) {
      const mapped = response.news
        .filter(
          item =>
            Boolean(
              item &&
              (item.title || item.headline) &&
              (item.url || item.link)
            )
        )
        .map(mapWorkerItemToNewsItem)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );

      registerNewsItems(mapped);

      return {
        ok: true,
        news: mapped,
        count:
          response.count ||
          mapped.length
      };
    }

    return {
      ok: false,
      news: [],
      count: 0,
      error:
        'Invalid response format from Worker API'
    };
  } catch (err: any) {
    console.error(
      'Failed to fetch homepage news from Worker:',
      err
    );

    return {
      ok: false,
      news: [],
      count: 0,
      error:
        err.message ||
        'Network error'
    };
  }
}

export async function fetchDistrictNews(
  bengaliDistrict: string,
  limit: number = 35
): Promise<{
  ok: boolean;
  news: NewsItem[];
  count: number;
  error?: string;
}> {
  try {
    const response =
      await fetchWorkerNews({
        district: bengaliDistrict,
        limit
      });

    if (
      response.ok &&
      Array.isArray(response.news)
    ) {
      const mapped = response.news
        .filter(
          item =>
            Boolean(
              item &&
              (item.title || item.headline) &&
              (item.url || item.link)
            )
        )
        .map(mapWorkerItemToNewsItem)
        .sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );

      registerNewsItems(mapped);

      return {
        ok: true,
        news: mapped,
        count:
          response.count ||
          mapped.length
      };
    }

    return {
      ok: false,
      news: [],
      count: 0,
      error:
        'Invalid response from Worker API'
    };
  } catch (err: any) {
    console.error(
      `Failed to fetch district news for ${bengaliDistrict}:`,
      err
    );

    return {
      ok: false,
      news: [],
      count: 0,
      error:
        err.message ||
        'Network error'
    };
  }
}

export async function fetchNewsByIdOrSlug(
  idOrSlug: string,
  existingNews?: NewsItem[]
): Promise<NewsItem | null> {
  const cleanTarget =
    (idOrSlug || '').trim();

  if (!cleanTarget) return null;

  if (
    existingNews &&
    existingNews.length > 0
  ) {
    const found = existingNews.find(
      n => isNewsMatch(n, cleanTarget)
    );

    if (found) return found;
  }

  const cached =
    findInNewsRegistry(cleanTarget);

  if (cached) return cached;

  try {
    const res =
      await fetchWorkerNews({
        limit: 5000
      });

    if (
      res.ok &&
      Array.isArray(res.news)
    ) {
      const mapped = res.news
        .filter(
          item =>
            Boolean(
              item &&
              (item.title || item.headline) &&
              (item.url || item.link)
            )
        )
        .map(mapWorkerItemToNewsItem);

      registerNewsItems(mapped);

      const found = mapped.find(
        n => isNewsMatch(n, cleanTarget)
      );

      if (found) return found;
    }
  } catch (err) {
    console.error(
      `Failed to find news for ${idOrSlug}:`,
      err
    );
  }

  return null;
}

export async function fetchArticleMeta(
  sourceUrl: string
): Promise<{
  image?: string;
  description?: string;
} | null> {
  if (!sourceUrl) return null;

  try {
    const res = await fetch(
      `${NEWS_API_BASE}/api/article-meta?url=${encodeURIComponent(
        sourceUrl
      )}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.ok && data.meta) {
        return data.meta;
      }
    }
  } catch {
    return null;
  }

  return null;
}