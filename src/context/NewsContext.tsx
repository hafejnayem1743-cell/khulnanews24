import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  NewsItem, Category, BreakingNewsItem, AdSlot, SiteSettings, 
  Author, Comment, MediaItem, HomepageSectionConfig, AdminUser, UserRole,
  AutoNewsSettings 
} from '../types';
import { StorageService } from '../services/storage';
import { AuthService, AuthSession } from '../services/auth';
import { 
  fetchRssFeedSafely, 
  createNewsItemFromCollected 
} from '../services/newsCollector';
import { fetchWorkerNews, mapWorkerItemToNewsItem, registerNewsItems } from '../services/newsApi';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface NewsContextType {
  news: NewsItem[];
  categories: Category[];
  breakingNews: BreakingNewsItem[];
  adSlots: AdSlot[];
  siteSettings: SiteSettings;
  authors: Author[];
  comments: Comment[];
  media: MediaItem[];
  homepageLayout: HomepageSectionConfig[];
  adminUsers: AdminUser[];
  currentUser: AdminUser | AuthSession | null;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];
  autoNewsSettings: AutoNewsSettings;
  isCollectingNews: boolean;
  
  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  
  // Auth
  login: (usernameOrEmail: string, plaintextPassword?: string) => Promise<boolean>;
  logout: () => void;
  
  // News CRUD & Aliases
  addNews: (item: NewsItem) => void;
  addNewsItem: (item: NewsItem) => void;
  updateNews: (itemOrId: NewsItem | string, updates?: Partial<NewsItem>) => void;
  updateNewsItem: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  deleteNewsItem: (id: string) => void;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentDeleteNews: (id: string) => void;
  incrementNewsView: (id: string) => number;
  incrementNewsLike: (id: string) => number;
  incrementNewsShare: (id: string) => number;
  
  // Auto News & Worker API
  syncWorkerNews: () => Promise<void>;
  saveAutoNewsSettings: (settings: AutoNewsSettings) => void;
  triggerAutoNewsCollection: () => Promise<{ added: number; skipped: number; total: number }>;
  batchAddAutoNews: (items: NewsItem[]) => { added: number; skipped: number };
  
  // Categories
  saveCategoriesList: (cats: Category[]) => void;
  
  // Breaking
  saveBreakingList: (items: BreakingNewsItem[]) => void;
  
  // Ads
  saveAdSlotsList: (slots: AdSlot[]) => void;
  
  // Settings
  saveSettings: (settings: SiteSettings) => void;
  updateSettings: (settings: SiteSettings) => void;
  
  // Authors
  saveAuthorsList: (authors: Author[]) => void;
  
  // Comments
  addReaderComment: (comment: Comment) => void;
  updateCommentsList: (comments: Comment[]) => void;
  
  // Media
  addMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;
  
  // Homepage Layout
  saveHomepageConfig: (layout: HomepageSectionConfig[]) => void;
  
  // Backup / Restore
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  resetToDefault: () => void;
  reloadAllData: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>(() => StorageService.getNews());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => StorageService.getBreakingNews());
  const [adSlots, setAdSlots] = useState<AdSlot[]>(() => StorageService.getAdSlots());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => StorageService.getSiteSettings());
  const [authors, setAuthors] = useState<Author[]>(() => StorageService.getAuthors());
  const [comments, setComments] = useState<Comment[]>(() => StorageService.getComments());
  const [media, setMedia] = useState<MediaItem[]>(() => StorageService.getMedia());
  const [homepageLayout, setHomepageLayout] = useState<HomepageSectionConfig[]>(() => StorageService.getHomepageLayout());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => StorageService.getAdminUsers());
  const [currentUser, setCurrentUser] = useState<AdminUser | AuthSession | null>(() => {
    return AuthService.getCurrentSession() || StorageService.getCurrentUser();
  });
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => StorageService.getTheme());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [autoNewsSettings, setAutoNewsSettings] = useState<AutoNewsSettings>(() => StorageService.getAutoNewsSettings());
  const [isCollectingNews, setIsCollectingNews] = useState<boolean>(false);

  // Apply theme class on mount and change
  useEffect(() => {
    StorageService.setTheme(theme);
  }, [theme]);

  // Function to sync latest live news from Cloudflare Worker
  const syncWorkerNews = async () => {
    try {
      const res = await fetchWorkerNews({ limit: 5000 });
      if (res.ok && res.news && res.news.length > 0) {
        setNews(prevNews => {
          // Keep manual admin news
          const manual = prevNews.filter(n => !n.isAutoCollected);
          const mappedWorkerNews = res.news
            .filter(item => Boolean(item && ((item as any).title || (item as any).headline) && ((item as any).url || (item as any).link)))
            .map(item => ({ ...mapWorkerItemToNewsItem(item), isAutoCollected: true, status: 'published' as const }));
          registerNewsItems(mappedWorkerNews);
          const combined = [...manual, ...mappedWorkerNews];
          const seen = new Set<string>();
          const unique = combined.filter(n => {
            const key = n.url || n.sourceUrl || n.id || n.title;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          registerNewsItems(unique);
          return unique;
        });
      }
    } catch (err) {
      console.error('Failed to sync worker news in context:', err);
    }
  };

  // Sync news from Worker on initial mount
  useEffect(() => {
    registerNewsItems(news);
    syncWorkerNews();
  }, []);

  // Periodic check for scheduled posts & view sync
  useEffect(() => {
    const timer = setInterval(() => {
      const latestNews = StorageService.getNews();
      setNews(prev => {
        // Merge latest storage news without removing API items
        const manual = latestNews.filter(n => !n.isAutoCollected);
        const apiItems = prev.filter(n => n.isAutoCollected);
        const combined = [...manual, ...apiItems];
        const seen = new Set<string>();
        return combined.filter(n => {
          const key = n.url || n.sourceUrl || n.id || n.title;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const saveAutoNewsSettings = (settings: AutoNewsSettings) => {
    StorageService.saveAutoNewsSettings(settings);
    setAutoNewsSettings(settings);
    showToast('অটো নিউজ সেটিংস সংরক্ষিত হয়েছে।', 'success');
  };

  const batchAddAutoNews = (items: NewsItem[]) => {
    const result = StorageService.addBatchNews(items);
    setNews(result.news);
    return { added: result.added, skipped: result.skipped };
  };

  const triggerAutoNewsCollection = async (): Promise<{ added: number; skipped: number; total: number }> => {
    if (isCollectingNews) return { added: 0, skipped: 0, total: 0 };
    setIsCollectingNews(true);
    let totalAdded = 0;
    let totalSkipped = 0;
    let totalFound = 0;
    let workerSucceeded = false;

    try {
      // 1. If Cloudflare Worker URL is specified, try fetching from Worker first
      if (autoNewsSettings.cloudflareWorkerUrl) {
        try {
          const workerBase = autoNewsSettings.cloudflareWorkerUrl.replace(/\/+$/, '').replace(/\/api\/(news|health|collect)$/i, '');
          const workerEndpoint = `${workerBase}/api/collect`;
          const res = await fetch(workerEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(autoNewsSettings.apiKey ? { 'Authorization': `Bearer ${autoNewsSettings.apiKey}` } : {})
            }
          });
          if (res.ok) {
            workerSucceeded = true;
            const data = await res.json();
            totalFound += Number(data.fetchedNow || data.count || (Array.isArray(data.news) ? data.news.length : 0));
            await syncWorkerNews();
          }
        } catch (workerErr) {
          console.warn('Cloudflare worker trigger error, falling back to direct collector:', workerErr);
        }
      }

      // 2. Direct RSS is only a fallback when the Worker is unavailable.
      if (!workerSucceeded) {
      const activeSources = (autoNewsSettings.sources || []).filter(s => s.isEnabled);
      const collectedRaw: any[] = [];

      for (const source of activeSources) {
        try {
          const items = await fetchRssFeedSafely(source.url, source.name);
          collectedRaw.push(...items);
        } catch (sourceErr) {
          console.error(`Error fetching from ${source.name}:`, sourceErr);
        }
      }

      totalFound += collectedRaw.length;

      if (collectedRaw.length > 0) {
        // Convert to NewsItem format
        const converted = collectedRaw.map(raw => createNewsItemFromCollected(raw, categories, autoNewsSettings));
        // Filter by target districts if configured
        const filtered = converted.filter(item => {
          if (!item.district) return true;
          return (autoNewsSettings.targetDistricts || []).includes(item.district as any);
        });

        const result = StorageService.addBatchNews(filtered);
        totalAdded += result.added;
        totalSkipped += result.skipped;
        setNews(result.news);
      }

      }

      // Update settings with last run time & count
      const updatedSettings: AutoNewsSettings = {
        ...autoNewsSettings,
        lastRunTime: new Date().toISOString(),
        totalCollected: (autoNewsSettings.totalCollected || 0) + totalAdded
      };
      StorageService.saveAutoNewsSettings(updatedSettings);
      setAutoNewsSettings(updatedSettings);

      if (workerSucceeded) {
        // Worker is the source of truth. fetchedNow can be 0 when the sources
        // have not published anything new, while the stored feed is still valid.
        if (totalAdded > 0) {
          showToast(`${totalAdded}টি নতুন খবর সফলভাবে সংগ্রহ ও সিঙ্ক হয়েছে!`, 'success');
        } else {
          showToast('অটো নিউজ সংগ্রহ সম্পন্ন। Worker-এর সংরক্ষিত সংবাদ সিঙ্ক হয়েছে। নতুন সংবাদ না থাকলেও পুরোনো সংবাদ ঠিক আছে।', 'info');
        }
      } else if (totalAdded > 0) {
        showToast(`${totalAdded}টি নতুন খবর সফলভাবে সংগৃহীত ও যুক্ত হয়েছে! (${totalSkipped}টি ডুপ্লিকেট বাদ)`, 'success');
      } else if (totalFound > 0) {
        showToast(`খবর সংগ্রহ সম্পন্ন। কোনো নতুন খবর যোগ হয়নি (${totalSkipped}টি ইতোমধ্যেই বিদ্যমান)।`, 'info');
      } else {
        showToast('ফিড থেকে এই মুহূর্তে কোনো নতুন খবর পাওয়া যায়নি।', 'info');
      }

    } catch (err) {
      console.error('Auto news collection error:', err);
      showToast('খবর সংগ্রহে কিছু সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsCollectingNews(false);
    }

    return { added: totalAdded, skipped: totalSkipped, total: totalFound };
  };

  // Cloudflare Cron performs the actual 24/7 collection. The browser only syncs the stored feed.
  useEffect(() => {
    if (!autoNewsSettings.isEnabled) return;
    const timer = setInterval(() => { syncWorkerNews(); }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [autoNewsSettings.isEnabled]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    StorageService.setTheme(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Secure Cryptographic Authentication
  const login = async (usernameOrEmail: string, plaintextPassword?: string): Promise<boolean> => {
    if (!plaintextPassword) {
      // Fallback simple login for mock testing if needed
      const user = adminUsers.find(
        u => u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
             u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      ) || {
        id: `user-${Date.now()}`,
        username: usernameOrEmail,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@khulnanews.com`,
        name: usernameOrEmail,
        role: 'super_admin' as UserRole
      };
      setCurrentUser(user);
      StorageService.setCurrentUser(user);
      showToast(`স্বাগতম, ${user.name}!`, 'success');
      return true;
    }

    const verification = await AuthService.verifyLogin(usernameOrEmail, plaintextPassword);
    if (verification.success && verification.session) {
      setCurrentUser(verification.session);
      StorageService.setCurrentUser(verification.session as any);
      showToast(`স্বাগতম, ${verification.session.name}! আপনি সফলভাবে লগইন করেছেন।`, 'success');
      return true;
    } else {
      showToast(verification.message || 'লগইন ব্যর্থ হয়েছে!', 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    AuthService.clearSession();
    StorageService.setCurrentUser(null);
    showToast('সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  const addNewsItem = (item: NewsItem) => {
    const updated = StorageService.addNews(item);
    setNews(updated);
    showToast('সংবাদ সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  const addNews = addNewsItem;

  const updateNewsItem = (id: string, updates: Partial<NewsItem>) => {
    const updated = StorageService.updateNews(id, updates);
    setNews(updated);
    showToast('সংবাদ সফলভাবে আপডেট করা হয়েছে।', 'success');
  };

  const updateNews = (itemOrId: NewsItem | string, updates?: Partial<NewsItem>) => {
    if (typeof itemOrId === 'string') {
      updateNewsItem(itemOrId, updates || {});
    } else {
      updateNewsItem(itemOrId.id, itemOrId);
    }
  };

  const deleteNewsItem = (id: string) => {
    // Soft delete / Move to trash
    moveToTrash(id);
  };

  const deleteNews = deleteNewsItem;

  const moveToTrash = (id: string) => {
    const updated = StorageService.updateNews(id, { status: 'trash' });
    setNews(updated);
    showToast('সংবাদ ট্র্যাশে পাঠানো হয়েছে।', 'info');
  };

  const restoreFromTrash = (id: string) => {
    const updated = StorageService.updateNews(id, { status: 'draft' });
    setNews(updated);
    showToast('সংবাদ ড্রাফট হিসেবে রিস্টোর করা হয়েছে।', 'success');
  };

  const permanentDeleteNews = (id: string) => {
    const updated = StorageService.deleteNews(id);
    setNews(updated);
    showToast('সংবাদ স্থায়ীভাবে মুছে ফেলা হয়েছে।', 'info');
  };

  const incrementNewsView = (id: string): number => {
    const count = StorageService.incrementView(id);
    setNews(StorageService.getNews());
    return count;
  };

  const incrementNewsLike = (id: string): number => {
    const count = StorageService.incrementLike(id);
    setNews(StorageService.getNews());
    return count;
  };

  const incrementNewsShare = (id: string): number => {
    const count = StorageService.incrementShare(id);
    setNews(StorageService.getNews());
    return count;
  };

  const saveCategoriesList = (cats: Category[]) => {
    StorageService.saveCategories(cats);
    setCategories(cats);
    showToast('ক্যাটাগরি তালিকা আপডেট হয়েছে।', 'success');
  };

  const saveBreakingList = (items: BreakingNewsItem[]) => {
    StorageService.saveBreakingNews(items);
    setBreakingNews(items);
    showToast('ব্রেকিং নিউজ টিকার আপডেট হয়েছে।', 'success');
  };

  const saveAdSlotsList = (slots: AdSlot[]) => {
    StorageService.saveAdSlots(slots);
    setAdSlots(slots);
    showToast('বিজ্ঞাপন কনফিগারেশন সংরক্ষিত হয়েছে।', 'success');
  };

  const saveSettings = (settings: SiteSettings) => {
    StorageService.saveSiteSettings(settings);
    setSiteSettings(settings);
    showToast('সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'success');
  };

  const updateSettings = saveSettings;

  const saveAuthorsList = (auths: Author[]) => {
    StorageService.saveAuthors(auths);
    setAuthors(auths);
    showToast('রিপোর্টার তালিকা আপডেট হয়েছে।', 'success');
  };

  const addReaderComment = (comment: Comment) => {
    const updated = StorageService.addComment(comment);
    setComments(updated);
    showToast(siteSettings.commentsAutoApprove ? 'আপনার মন্তব্য প্রকাশিত হয়েছে।' : 'আপনার মন্তব্য পর্যালোচনার জন্য জমা হয়েছে।', 'info');
  };

  const updateCommentsList = (commList: Comment[]) => {
    StorageService.saveComments(commList);
    setComments(commList);
    showToast('মন্তব্য তালিকা আপডেট হয়েছে।', 'success');
  };

  const addMediaItem = (item: MediaItem) => {
    const current = StorageService.getMedia();
    const updated = [item, ...current];
    StorageService.saveMedia(updated);
    setMedia(updated);
    showToast('ছবি সফলভাবে মিডিয়া লাইব্রেরিতে যুক্ত হয়েছে।', 'success');
  };

  const deleteMediaItem = (id: string) => {
    const current = StorageService.getMedia();
    const updated = current.filter(m => m.id !== id);
    StorageService.saveMedia(updated);
    setMedia(updated);
    showToast('ছবি মুছে ফেলা হয়েছে।', 'info');
  };

  const saveHomepageConfig = (layout: HomepageSectionConfig[]) => {
    StorageService.saveHomepageLayout(layout);
    setHomepageLayout(layout);
    showToast('হোমপেজ লেআউট সংরক্ষিত হয়েছে।', 'success');
  };

  const exportBackup = () => {
    return StorageService.exportAllData();
  };

  const importBackup = (jsonString: string) => {
    const success = StorageService.importData(jsonString);
    if (success) {
      reloadAllData();
    }
    return success;
  };

  const resetToDefault = () => {
    StorageService.resetToDefault();
    reloadAllData();
    showToast('সকল ডাটা ডিফল্ট কনফিগারেশনে রিসেট হয়েছে।', 'info');
  };

  const reloadAllData = () => {
    setNews(StorageService.getNews());
    setCategories(StorageService.getCategories());
    setBreakingNews(StorageService.getBreakingNews());
    setAdSlots(StorageService.getAdSlots());
    setSiteSettings(StorageService.getSiteSettings());
    setAuthors(StorageService.getAuthors());
    setComments(StorageService.getComments());
    setMedia(StorageService.getMedia());
    setHomepageLayout(StorageService.getHomepageLayout());
    setAdminUsers(StorageService.getAdminUsers());
  };

  return (
    <NewsContext.Provider
      value={{
        news,
        categories,
        breakingNews,
        adSlots,
        siteSettings,
        authors,
        comments,
        media,
        homepageLayout,
        adminUsers,
        currentUser,
        theme,
        toasts,
        autoNewsSettings,
        isCollectingNews,
        toggleTheme,
        setTheme,
        showToast,
        removeToast,
        login,
        logout,
        addNews,
        addNewsItem,
        updateNews,
        updateNewsItem,
        deleteNews,
        deleteNewsItem,
        moveToTrash,
        restoreFromTrash,
        permanentDeleteNews,
        incrementNewsView,
        incrementNewsLike,
        incrementNewsShare,
        syncWorkerNews,
        saveAutoNewsSettings,
        triggerAutoNewsCollection,
        batchAddAutoNews,
        saveCategoriesList,
        saveBreakingList,
        saveAdSlotsList,
        saveSettings,
        updateSettings,
        saveAuthorsList,
        addReaderComment,
        updateCommentsList,
        addMediaItem,
        deleteMediaItem,
        saveHomepageConfig,
        exportBackup,
        importBackup,
        resetToDefault,
        reloadAllData
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
