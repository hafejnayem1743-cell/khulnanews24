import { 
  NewsItem, Category, BreakingNewsItem, AdSlot, SiteSettings, 
  Author, Comment, MediaItem, HomepageSectionConfig, AdminUser,
  AutoNewsSettings 
} from '../types';
import { 
  DEFAULT_NEWS, DEFAULT_CATEGORIES, DEFAULT_BREAKING_NEWS, 
  DEFAULT_AD_SLOTS, DEFAULT_SITE_SETTINGS, DEFAULT_AUTHORS, 
  DEFAULT_HOMEPAGE_SECTIONS, DEFAULT_ADMIN_USERS, DEFAULT_MEDIA 
} from '../config/constants';
import { DEFAULT_AUTO_NEWS_SETTINGS, normalizeTitle } from './newsCollector';

const STORAGE_KEYS = {
  NEWS: 'khulna_news_items_v3',
  CATEGORIES: 'khulna_categories_v2',
  BREAKING_NEWS: 'khulna_breaking_news_v3',
  AD_SLOTS: 'khulna_ad_slots_v1',
  SITE_SETTINGS: 'khulna_site_settings_v1',
  AUTHORS: 'khulna_authors_v1',
  COMMENTS: 'khulna_comments_v1',
  MEDIA: 'khulna_media_items_v1',
  HOMEPAGE_LAYOUT: 'khulna_homepage_layout_v1',
  ADMIN_USERS: 'khulna_admin_users_v1',
  VIEW_LOGS: 'khulna_view_logs_v1',
  AUTH_SESSION: 'khulna_auth_session_v1',
  THEME: 'khulna_theme_mode_v1',
  AUTO_NEWS_SETTINGS: 'khulna_auto_news_settings_v1'
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const StorageService = {
  // --- NEWS ---
  getNews(): NewsItem[] {
    let items = getStored<NewsItem[]>(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
    // Auto publish scheduled news if time reached & ensure boosted metrics
    const now = new Date();
    let modified = false;
    items = items.map(n => {
      let updatedItem = { ...n };
      // Track realViews if not initialized
      if (typeof updatedItem.realViews !== 'number') {
        updatedItem.realViews = 0;
        modified = true;
      }
      // If marked as having real unboosted engagement, preserve it
      if (updatedItem.isRealEngagement) {
        return updatedItem;
      }
      // Boost viewCount if low (Public simulated metrics)
      if (!updatedItem.viewCount || updatedItem.viewCount < 20000) {
        updatedItem.viewCount = 38500 + Math.floor((n.priority || 1) * 7200 + (n.title.length * 180) % 25000);
        modified = true;
      }
      // Boost likeCount if missing or low
      if (!updatedItem.likeCount || updatedItem.likeCount < 1000) {
        updatedItem.likeCount = Math.floor((updatedItem.viewCount * 0.08) + 1200);
        modified = true;
      }
      // Boost shareCount if missing or low
      if (!updatedItem.shareCount || updatedItem.shareCount < 500) {
        updatedItem.shareCount = Math.floor((updatedItem.viewCount * 0.04) + 650);
        modified = true;
      }
      if (updatedItem.status === 'scheduled' && updatedItem.scheduledAt && new Date(updatedItem.scheduledAt) <= now) {
        modified = true;
        updatedItem = { ...updatedItem, status: 'published', publishedAt: updatedItem.scheduledAt };
      }
      return updatedItem;
    });
    if (modified) {
      setStored(STORAGE_KEYS.NEWS, items);
    }
    return items;
  },

  saveNews(news: NewsItem[]): void {
    setStored(STORAGE_KEYS.NEWS, news);
  },

  addNews(item: NewsItem): NewsItem[] {
    const current = this.getNews();
    const isReal = !!item.isRealEngagement;
    const finalItem: NewsItem = {
      ...item,
      realViews: typeof item.realViews === 'number' ? item.realViews : 0,
      isRealEngagement: isReal,
      viewCount: isReal
        ? (item.viewCount || 0)
        : (item.viewCount && item.viewCount >= 20000 
            ? item.viewCount 
            : 35000 + Math.floor(Math.random() * 42000)),
      likeCount: isReal
        ? (item.likeCount || 0)
        : (item.likeCount && item.likeCount >= 1000 
            ? item.likeCount 
            : 2800 + Math.floor(Math.random() * 3500)),
      shareCount: isReal
        ? (item.shareCount || 0)
        : (item.shareCount && item.shareCount >= 500 
            ? item.shareCount 
            : 1200 + Math.floor(Math.random() * 1800))
    };
    const updated = [finalItem, ...current];
    this.saveNews(updated);
    return updated;
  },

  updateNews(id: string, updates: Partial<NewsItem>): NewsItem[] {
    const current = this.getNews();
    const updated = current.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
    this.saveNews(updated);
    return updated;
  },

  deleteNews(id: string): NewsItem[] {
    const current = this.getNews();
    const updated = current.filter(n => n.id !== id);
    this.saveNews(updated);
    return updated;
  },

  // Batch add news with duplicate prevention (used by Auto News Collector)
  addBatchNews(newItems: NewsItem[]): { added: number; skipped: number; news: NewsItem[] } {
    const current = this.getNews();
    const existingUrls = new Set<string>();
    const existingGuids = new Set<string>();
    const existingTitles = new Set<string>();

    current.forEach(item => {
      if (item.sourceUrl) existingUrls.add(item.sourceUrl.trim());
      if (item.guid) existingGuids.add(item.guid.trim());
      existingTitles.add(normalizeTitle(item.title));
    });

    const toAdd: NewsItem[] = [];
    let skipped = 0;

    for (const item of newItems) {
      const normTitle = normalizeTitle(item.title);
      const isDuplicate = 
        (item.sourceUrl && existingUrls.has(item.sourceUrl.trim())) ||
        (item.guid && existingGuids.has(item.guid.trim())) ||
        existingTitles.has(normTitle);

      if (isDuplicate) {
        skipped++;
        continue;
      }

      existingTitles.add(normTitle);
      if (item.sourceUrl) existingUrls.add(item.sourceUrl.trim());
      if (item.guid) existingGuids.add(item.guid.trim());
      toAdd.push(item);
    }

    if (toAdd.length > 0) {
      const updated = [...toAdd, ...current];
      this.saveNews(updated);
      return { added: toAdd.length, skipped, news: updated };
    }

    return { added: 0, skipped, news: current };
  },

  incrementView(newsId: string): number {
    // Session debounce to avoid artificial view flooding
    const viewedKey = `viewed_${newsId}`;
    const lastView = sessionStorage.getItem(viewedKey);
    const now = Date.now();
    if (lastView && now - parseInt(lastView, 10) < 60000) {
      // viewed less than 1 min ago in this session
      const news = this.getNews().find(n => n.id === newsId);
      return news ? news.viewCount : 0;
    }
    sessionStorage.setItem(viewedKey, now.toString());

    // Record view log for analytics
    const viewLogs = getStored<{ date: string; newsId: string }[]>(STORAGE_KEYS.VIEW_LOGS, []);
    viewLogs.push({ date: new Date().toISOString().slice(0, 10), newsId });
    setStored(STORAGE_KEYS.VIEW_LOGS, viewLogs.slice(-1000)); // keep last 1000 entries

    let newCount = 0;
    const allNews = this.getNews().map(n => {
      if (n.id === newsId) {
        const currentReal = typeof n.realViews === 'number' ? n.realViews : 0;
        const nextReal = currentReal + 1;
        
        if (n.isRealEngagement) {
          newCount = (n.viewCount || 0) + 1;
        } else {
          const currentCount = n.viewCount >= 20000 ? n.viewCount : 35000;
          newCount = currentCount + 1;
        }
        return { 
          ...n, 
          viewCount: newCount,
          realViews: nextReal
        };
      }
      return n;
    });
    this.saveNews(allNews);
    return newCount;
  },

  incrementLike(newsId: string): number {
    let newLikes = 0;
    const allNews = this.getNews().map(n => {
      if (n.id === newsId) {
        const currentLikes = n.likeCount && n.likeCount >= 1000 ? n.likeCount : 2500;
        newLikes = currentLikes + 1;
        return { ...n, likeCount: newLikes };
      }
      return n;
    });
    this.saveNews(allNews);
    return newLikes;
  },

  incrementShare(newsId: string): number {
    let newShares = 0;
    const allNews = this.getNews().map(n => {
      if (n.id === newsId) {
        const currentShares = n.shareCount && n.shareCount >= 500 ? n.shareCount : 1200;
        newShares = currentShares + 1;
        return { ...n, shareCount: newShares };
      }
      return n;
    });
    this.saveNews(allNews);
    return newShares;
  },

  // --- CATEGORIES ---
  getCategories(): Category[] {
    return getStored<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },

  saveCategories(cats: Category[]): void {
    setStored(STORAGE_KEYS.CATEGORIES, cats);
  },

  // --- BREAKING NEWS ---
  getBreakingNews(): BreakingNewsItem[] {
    return getStored<BreakingNewsItem[]>(STORAGE_KEYS.BREAKING_NEWS, DEFAULT_BREAKING_NEWS);
  },

  saveBreakingNews(items: BreakingNewsItem[]): void {
    setStored(STORAGE_KEYS.BREAKING_NEWS, items);
  },

  // --- ADVERTISEMENTS ---
  getAdSlots(): AdSlot[] {
    const stored = getStored<AdSlot[] | null>(STORAGE_KEYS.AD_SLOTS, null);
    if (!stored) return DEFAULT_AD_SLOTS;

    const defaultByPosition = new Map(DEFAULT_AD_SLOTS.map(slot => [slot.position, slot]));
    let modified = false;

    const sanitized = stored.map(slot => {
      const defaultSlot = defaultByPosition.get(slot.position);
      if (!defaultSlot) return slot;

      const isLegacyDemo =
        !slot.adCode ||
        slot.adCode.includes('ads@khulnanews.com') ||
        slot.adCode.includes('Adsterra Banner (728x90)') ||
        slot.adCode.includes('Adsterra Mobile 320x50 Banner Slot') ||
        slot.adCode.includes('Admin Panel থেকে Adsterra Code') ||
        slot.adCode.includes('Adsterra Native / Banner') ||
        slot.adCode.includes('Adsterra 300x250') ||
        slot.adCode.includes('Article Top)') ||
        slot.adCode.includes('Article Bottom)') ||
        slot.adCode.includes('Social Bar Code Here') ||
        slot.adCode.includes('Popunder Script Here');

      if (!isLegacyDemo) return slot;

      modified = true;
      return {
        ...slot,
        adCode: defaultSlot.adCode,
        mobileCode: defaultSlot.mobileCode,
        adsterraType: defaultSlot.adsterraType
      };
    });

    if (modified) this.saveAdSlots(sanitized);
    return sanitized;
  },

  saveAdSlots(slots: AdSlot[]): void {
    setStored(STORAGE_KEYS.AD_SLOTS, slots);
  },

  // --- SITE SETTINGS ---
  getSiteSettings(): SiteSettings {
    const settings = getStored<SiteSettings>(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
    let modified = false;

    // Migrate old fake phone number
    if (!settings.phone || settings.phone.includes('৪১-৭২২৫০০') || settings.phone.includes('১৭০০-০০০০০০')) {
      settings.phone = '01306721743';
      modified = true;
    }

    // Ensure WhatsApp is set
    if (!settings.whatsapp || settings.whatsapp.includes('০০০০')) {
      settings.whatsapp = '01907655994';
      modified = true;
    }

    // Migrate old fake email
    if (!settings.email || settings.email.includes('khulnanews.com')) {
      settings.email = 'worldbusiness677@gmail.com';
      modified = true;
    }

    // Remove old fake address
    if (settings.address && settings.address.includes('প্রেসক্লাব ভবন')) {
      settings.address = '';
      modified = true;
    }

    // Clean up old fake social profile URLs
    if (settings.facebookUrl && settings.facebookUrl.includes('facebook.com/khulnanewsofficial')) {
      settings.facebookUrl = '';
      modified = true;
    }
    if (settings.youtubeUrl && settings.youtubeUrl.includes('youtube.com/@khulnanews')) {
      settings.youtubeUrl = '';
      modified = true;
    }
    if (settings.telegramUrl && settings.telegramUrl.includes('t.me/khulnanews')) {
      settings.telegramUrl = '';
      modified = true;
    }
    if (settings.twitterUrl && settings.twitterUrl.includes('x.com/khulnanews')) {
      settings.twitterUrl = '';
      modified = true;
    }

    // Ensure brand consistency with Khulna News 24
    if (!settings.websiteName || settings.websiteName === 'খুলনা নিউজ') {
      settings.websiteName = 'খুলনা নিউজ ২৪';
      modified = true;
    }
    if (!settings.englishBrandName || settings.englishBrandName === 'KHULNA NEWS') {
      settings.englishBrandName = 'Khulna News 24';
      modified = true;
    }
    if (!settings.tagline || settings.tagline === 'খুলনার খবর, সবার আগে') {
      settings.tagline = 'খুলনা ও ১০ জেলার সর্বশেষ খবর';
      modified = true;
    }
    if (!settings.defaultSeoTitle || settings.defaultSeoTitle.includes('খুলনা নিউজ - KHULNA NEWS')) {
      settings.defaultSeoTitle = 'খুলনা নিউজ ২৪ | খুলনা ও ১০ জেলার সর্বশেষ খবর';
      modified = true;
    }
    if (!settings.defaultMetaDescription || settings.defaultMetaDescription.includes('খুলনা ও বাংলাদেশের সর্বশেষ তাজা খবর')) {
      settings.defaultMetaDescription = 'খুলনা নিউজ ২৪ | খুলনা ও খুলনা বিভাগের ১০ জেলার সর্বশেষ তাজা খবর, ব্রেকিং নিউজ, স্থানীয় সংবাদ, রাজনীতি ও জনজীবনের বস্তুনিষ্ঠ বিশ্লেষণ।';
      modified = true;
    }

    if (modified) {
      this.saveSiteSettings(settings);
    }
    return settings;
  },

  saveSiteSettings(settings: SiteSettings): void {
    setStored(STORAGE_KEYS.SITE_SETTINGS, settings);
  },

  // --- AUTO NEWS SETTINGS ---
  getAutoNewsSettings(): AutoNewsSettings {
    const settings = getStored<AutoNewsSettings>(STORAGE_KEYS.AUTO_NEWS_SETTINGS, DEFAULT_AUTO_NEWS_SETTINGS);
    let modified = false;
    if (!settings.cloudflareWorkerUrl) {
      settings.cloudflareWorkerUrl = 'https://khulna-news-collector.hafejnayem1743.workers.dev/api/news';
      modified = true;
    }

    // v9.2: Cloudflare Cron is authoritative and runs every 30 minutes.
    // Migrate the old browser-only 10-minute setting once so the UI matches production.
    if (settings.intervalMinutes === 10) {
      settings.intervalMinutes = 30;
      modified = true;
    }

    if (modified) {
      this.saveAutoNewsSettings(settings);
    }
    return settings;
  },

  saveAutoNewsSettings(settings: AutoNewsSettings): void {
    setStored(STORAGE_KEYS.AUTO_NEWS_SETTINGS, settings);
  },

  // --- AUTHORS ---
  getAuthors(): Author[] {
    return getStored<Author[]>(STORAGE_KEYS.AUTHORS, DEFAULT_AUTHORS);
  },

  saveAuthors(authors: Author[]): void {
    setStored(STORAGE_KEYS.AUTHORS, authors);
  },

  // --- MEDIA ---
  getMedia(): MediaItem[] {
    return getStored<MediaItem[]>(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  },

  saveMedia(media: MediaItem[]): void {
    setStored(STORAGE_KEYS.MEDIA, media);
  },

  // --- HOMEPAGE LAYOUT ---
  getHomepageLayout(): HomepageSectionConfig[] {
    return getStored<HomepageSectionConfig[]>(STORAGE_KEYS.HOMEPAGE_LAYOUT, DEFAULT_HOMEPAGE_SECTIONS);
  },

  saveHomepageLayout(layout: HomepageSectionConfig[]): void {
    setStored(STORAGE_KEYS.HOMEPAGE_LAYOUT, layout);
  },

  // --- COMMENTS ---
  getComments(): Comment[] {
    return getStored<Comment[]>(STORAGE_KEYS.COMMENTS, [
      {
        id: 'comm-1',
        newsId: 'news-1',
        userName: 'আব্দুল করিম',
        userEmail: 'karim@gmail.com',
        content: 'খুলনা-মোংলা রেল সংযোগ দক্ষিণাঞ্চলের ব্যবসায়ীদের দীর্ঘদিনের স্বপ্ন ছিল। অত্যন্ত তথ্যবহুল প্রতিবেদন। ধন্যবাদ খুলনা নিউজকে!',
        status: 'approved',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'comm-2',
        newsId: 'news-2',
        userName: 'মাহবুব আলম',
        userEmail: 'mahbub@gmail.com',
        content: 'সুন্দরবনে এআই প্রযুক্তির ব্যবহার সত্যিই প্রশংসনীয় উদ্যোগ। এর সঠিক রক্ষণাবেক্ষণ প্রয়োজন।',
        status: 'approved',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]);
  },

  saveComments(comments: Comment[]): void {
    setStored(STORAGE_KEYS.COMMENTS, comments);
  },

  addComment(comment: Comment): Comment[] {
    const current = this.getComments();
    const updated = [comment, ...current];
    this.saveComments(updated);
    return updated;
  },

  // --- ADMIN USERS ---
  getAdminUsers(): AdminUser[] {
    return getStored<AdminUser[]>(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
  },

  saveAdminUsers(users: AdminUser[]): void {
    setStored(STORAGE_KEYS.ADMIN_USERS, users);
  },

  // --- AUTH SESSION ---
  getCurrentUser(): AdminUser | null {
    return getStored<AdminUser | null>(STORAGE_KEYS.AUTH_SESSION, null);
  },

  setCurrentUser(user: AdminUser | null): void {
    setStored(STORAGE_KEYS.AUTH_SESSION, user);
  },

  // --- THEME ---
  getTheme(): 'light' | 'dark' {
    return getStored<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
  },

  setTheme(theme: 'light' | 'dark'): void {
    setStored(STORAGE_KEYS.THEME, theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  },

  // --- ANALYTICS SUMMARY ---
  getAnalyticsSummary() {
    const news = this.getNews();
    const totalViews = news.reduce((sum, n) => sum + (n.viewCount || 0), 0);
    const viewLogs = getStored<{ date: string; newsId: string }[]>(STORAGE_KEYS.VIEW_LOGS, []);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayViews = viewLogs.filter(l => l.date === todayStr).length || Math.round(totalViews * 0.18);

    const topNews = [...news]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 5);

    const publishedCount = news.filter(n => n.status === 'published').length;
    const draftCount = news.filter(n => n.status === 'draft').length;
    const scheduledCount = news.filter(n => n.status === 'scheduled').length;

    return {
      totalNews: news.length,
      publishedCount,
      draftCount,
      scheduledCount,
      totalViews,
      todayViews,
      topNews,
      categoriesCount: this.getCategories().length,
      authorsCount: this.getAuthors().length
    };
  },

  // --- BACKUP & EXPORT ---
  exportAllData(): string {
    const data = {
      news: this.getNews(),
      categories: this.getCategories(),
      breakingNews: this.getBreakingNews(),
      adSlots: this.getAdSlots(),
      siteSettings: this.getSiteSettings(),
      authors: this.getAuthors(),
      media: this.getMedia(),
      homepageLayout: this.getHomepageLayout(),
      comments: this.getComments(),
      exportDate: new Date().toISOString(),
      system: 'KHULNA_NEWS_CMS_V1'
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.news) this.saveNews(data.news);
      if (data.categories) this.saveCategories(data.categories);
      if (data.breakingNews) this.saveBreakingNews(data.breakingNews);
      if (data.adSlots) this.saveAdSlots(data.adSlots);
      if (data.siteSettings) this.saveSiteSettings(data.siteSettings);
      if (data.authors) this.saveAuthors(data.authors);
      if (data.media) this.saveMedia(data.media);
      if (data.homepageLayout) this.saveHomepageLayout(data.homepageLayout);
      if (data.comments) this.saveComments(data.comments);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetToDefault(): void {
    localStorage.clear();
    setStored(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
    setStored(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    setStored(STORAGE_KEYS.BREAKING_NEWS, DEFAULT_BREAKING_NEWS);
    setStored(STORAGE_KEYS.AD_SLOTS, DEFAULT_AD_SLOTS);
    setStored(STORAGE_KEYS.SITE_SETTINGS, DEFAULT_SITE_SETTINGS);
    setStored(STORAGE_KEYS.AUTHORS, DEFAULT_AUTHORS);
    setStored(STORAGE_KEYS.HOMEPAGE_LAYOUT, DEFAULT_HOMEPAGE_SECTIONS);
    setStored(STORAGE_KEYS.ADMIN_USERS, DEFAULT_ADMIN_USERS);
    setStored(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
  }
};
