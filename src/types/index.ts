export type NewsStatus = 'draft' | 'pending' | 'published' | 'scheduled' | 'archived' | 'trash';

export type UserRole = 'super_admin' | 'editor' | 'reporter';

export interface Author {
  id: string;
  name: string;
  banglaName: string;
  designation: string;
  bio: string;
  photo: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  englishName: string;
  description?: string;
  order: number;
  showInNav: boolean;
  showInHome: boolean;
  subcategories?: SubCategory[];
  color?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface SeoMetadata {
  seoTitle: string;
  metaDescription: string;
  focusKeywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  subTitle?: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  categoryId: string;
  subCategoryId?: string;
  categoryName: string;
  categorySlug?: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  status: NewsStatus;
  isFeatured: boolean;
  isTopNews: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  priority: number;
  viewCount: number;
  likeCount?: number;
  shareCount?: number;
  realViews?: number; // Actual authentic visit counts for accurate admin telemetry
  isRealEngagement?: boolean; // True if public metrics represent unboosted real engagement
  tags: string[];
  publishedAt: string; // ISO date string
  updatedAt: string;   // ISO date string
  scheduledAt?: string;
  seo: SeoMetadata;
  allowComments: boolean;
  district?: KhulnaDistrict | string;
  description?: string;
  isAutoCollected?: boolean;
  sourceName?: string;
  sourceUrl?: string;
  url?: string;
  source?: string;
  guid?: string;
}

export interface WorkerNewsItem {
  id?: string; title?: string; headline?: string; description?: string; summary?: string; content?: string;
  url?: string; link?: string; publishedAt?: string; published_at?: string; date?: string;
  image?: string; imageUrl?: string; featuredImage?: string; source?: string; sourceName?: string;
  district?: string; districtName?: string; districtBn?: string; collectedAt?: string; [key: string]: any;
}

export interface WorkerNewsResponse {
  ok: boolean; count: number; district?: string | null; news: WorkerNewsItem[];
  totalStored?: number; fetchedNow?: number; districtCounts?: Record<string, number>; [key: string]: any;
}

export type KhulnaDistrict = 
  | 'Khulna'
  | 'Bagerhat'
  | 'Satkhira'
  | 'Jashore'
  | 'Narail'
  | 'Jhenaidah'
  | 'Magura'
  | 'Kushtia'
  | 'Chuadanga'
  | 'Meherpur';

export interface AutoNewsCollectorSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'google_news' | 'json';
  isEnabled: boolean;
  districtFilter?: KhulnaDistrict;
}

export interface AutoNewsSettings {
  isEnabled: boolean;
  autoPublish: boolean; // if true publishes as 'published', if false as 'draft' for review
  intervalMinutes: number; // default 30
  targetDistricts: KhulnaDistrict[];
  sources: AutoNewsCollectorSource[];
  lastRunTime?: string;
  totalCollected: number;
  cloudflareWorkerUrl?: string;
  apiKey?: string;
}

export interface BreakingNewsItem {
  id: string;
  headline: string;
  linkUrl?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  expiresAt?: string;
}

export type AdPosition = 
  | 'HEADER_BANNER'
  | 'HOMEPAGE_TOP'
  | 'HOMEPAGE_MIDDLE'
  | 'HOMEPAGE_BOTTOM'
  | 'SIDEBAR_TOP'
  | 'SIDEBAR_MIDDLE'
  | 'SIDEBAR_BOTTOM'
  | 'ARTICLE_TOP'
  | 'ARTICLE_MIDDLE'
  | 'ARTICLE_BOTTOM'
  | 'MOBILE_TOP'
  | 'MOBILE_BOTTOM'
  | 'SOCIAL_BAR'
  | 'POPUNDER';

export interface AdSlot {
  id: string;
  name: string;
  position: AdPosition;
  isActive: boolean;
  adCode: string; // JavaScript or HTML embed
  mobileCode?: string;
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  startDate?: string;
  endDate?: string;
  priority: number;
  adsterraType?: 'banner' | 'social_bar' | 'popunder' | 'native' | 'custom';
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  caption?: string;
  fileSize?: string;
  dimensions?: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  newsId: string;
  userName: string;
  userEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  createdAt: string;
}

export interface SiteSettings {
  websiteName: string;
  englishBrandName: string;
  tagline: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  editorName: string;
  publisherName: string;
  facebookUrl: string;
  youtubeUrl: string;
  telegramUrl: string;
  twitterUrl: string;
  footerAbout: string;
  copyrightText: string;
  googleAnalyticsId: string;
  searchConsoleVerification: string;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
  defaultSocialImage: string;
  breakingNewsEnabled: boolean;
  commentsAutoApprove: boolean;
  adsterraGlobalCode?: string;
}

export interface HomepageSectionConfig {
  id: string;
  type: 'hero' | 'latest' | 'trending' | 'category' | 'ad_banner';
  title?: string;
  categoryId?: string;
  newsCount: number;
  layout: 'grid' | 'list' | 'featured_with_list' | 'bento';
  order: number;
  isVisible: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface VersionChangeLog {
  version: string;
  date: string;
  summary: string;
  changedFiles: string[];
}
