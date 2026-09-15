import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { NewsCard } from '../../components/common/NewsCard';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';
import { SeoHead } from '../../components/common/SeoHead';
import { ArrowRight, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { KHULNA_DISTRICTS } from '../../services/newsCollector';
import { fetchHomepageNews } from '../../services/newsApi';
import { NewsItem } from '../../types';

export const HomePage: React.FC = () => {
  const { news: globalNews, categories, homepageLayout } = useNews();
  const { lang, labels } = useActiveLanguage();

  const [apiNews, setApiNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load latest news automatically from Cloudflare Worker API
  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchHomepageNews(5000);
      if (res.ok) {
        setApiNews(res.news);
      } else {
        setErrorMessage('এই মুহূর্তে সংবাদ লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error('Error fetching homepage news:', err);
      setErrorMessage('এই মুহূর্তে সংবাদ লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Combine live API news with any manual admin posts and sort chronologically
  const publishedNews = useMemo(() => {
    const manualPosts = globalNews.filter(n => n.status === 'published' && !n.isAutoCollected);
    const combined = [...manualPosts, ...apiNews];

    const seen = new Set<string>();
    const unique = combined.filter(item => {
      const key = item.url || item.sourceUrl || item.id || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [apiNews, globalNews]);

  const featuredNews = publishedNews[0];
  const secondaryHero = publishedNews.filter(n => n.id !== featuredNews?.id).slice(0, 4);

  // Trending news sorted by views or chronologically
  const trendingNews = useMemo(() => {
    return [...publishedNews].slice(0, 5);
  }, [publishedNews]);

  // Sorted homepage layout sections from admin
  const visibleSections = homepageLayout
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <SeoHead />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-6 space-y-5 sm:space-y-8">
        {/* Loading State Skeleton */}
        {isLoading ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 animate-pulse">
            <div className="lg:col-span-8 space-y-4">
              <div className="w-full h-72 sm:h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          </section>
        ) : errorMessage ? (
          /* Error State: Show required Bengali message */
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-red-200/80 dark:border-red-900/40 text-center shadow-2xs">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              {errorMessage}
            </h2>
            <button
              onClick={loadNews}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>পুনরায় চেষ্টা করুন</span>
            </button>
          </div>
        ) : publishedNews.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
              এই বিভাগে বর্তমানে কোনো সংবাদ পাওয়া যায়নি।
            </h2>
          </div>
        ) : (
          <>
            {/* 1. HERO & TOP STORIES SECTION (Mobile-First Layout) */}
            <section id="hero-section" className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Main Hero (Left 8 cols) */}
              <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                {featuredNews && (
                  <NewsCard news={featuredNews} variant="hero" />
                )}

                {/* Secondary Stories underneath hero: Clean mobile list/grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {secondaryHero.slice(0, 2).map(item => (
                    <NewsCard key={item.id} news={item} variant="grid" />
                  ))}
                </div>
              </div>

              {/* Right Sidebar: Trending & Square Ad (Right 4 cols) */}
              <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
                {/* Trending News Widget */}
                <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs p-3.5 sm:p-4">
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>
                      {labels.trending}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-[#D32F2F] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
                      {labels.top5}
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800/70">
                    {trendingNews.map((item, idx) => (
                      <NewsCard key={item.id} news={item} variant="trending" rank={idx + 1} />
                    ))}
                  </div>
                </div>

                {/* Sidebar Ad Slot with responsive container */}
                <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 p-2 shadow-2xs flex justify-center overflow-hidden max-w-full">
                  <AdsterraSlot position="SIDEBAR_TOP" />
                </div>
              </aside>
            </section>

            {/* 2. TOP BANNER AD (Responsive container, no overflow) */}
            <div className="py-1 flex justify-center overflow-hidden max-w-full">
              <AdsterraSlot position="HOMEPAGE_TOP" />
            </div>
          </>
        )}

        {/* 2.5 KHULNA DIVISION 10 DISTRICTS SEO EXPLORER */}
        <section aria-label="Khulna Division Districts" className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 p-3 sm:p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  খুলনা বিভাগের ১০ জেলার খবর
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  আপনার এলাকার সর্বশেষ তাজা সংবাদ পড়ুন
                </p>
              </div>
            </div>
            <Link 
              to="/khulna" 
              className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              <span>বিভাগীয় সব খবর</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {KHULNA_DISTRICTS.map(dist => {
              const slug = dist.englishName.toLowerCase();
              return (
                <Link
                  key={dist.id}
                  to={`/${slug}`}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 dark:bg-slate-800/60 dark:hover:bg-red-950/30 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 border border-slate-200/70 dark:border-slate-700/60 hover:border-red-300 dark:hover:border-red-900/60 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-bold group-hover:translate-x-0.5 transition-transform">
                    {dist.banglaName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                    {dist.englishName}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. DYNAMIC SECTIONS CONTROLLED BY ADMIN HOMEPAGE CONFIG */}
        {visibleSections.map(sec => {
          if (sec.type === 'ad_banner') {
            return (
              <div key={sec.id} className="py-2 flex justify-center overflow-hidden max-w-full">
                <AdsterraSlot position="HOMEPAGE_MIDDLE" />
              </div>
            );
          }

          if (sec.type === 'latest') {
            // v9.3: The Worker is the source of truth. Show the complete merged
            // published feed here instead of limiting the homepage to 12/20 items.
            const allNewsItems = publishedNews;
            return (
              <section key={sec.id} id="all-news" className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-7 rounded-full bg-[#D32F2F]"></span>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        সকল সর্বশেষ সংবাদ
                      </h2>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-3.5">
                      খুলনা বিভাগের ১০ জেলার সব প্রকাশিত সংবাদ একসাথে
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-[#D32F2F] text-[11px] font-black">
                      {allNewsItems.length.toLocaleString('bn-BD')} সংবাদ
                    </span>
                    <Link 
                      to="/latest" 
                      className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1 group py-1"
                    >
                      <span>আলাদা পেজ</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {allNewsItems.map(item => (
                    <NewsCard key={item.id || item.url || item.title} news={item} variant="grid" />
                  ))}
                </div>
              </section>
            );
          }

          if (sec.type === 'category' && sec.categoryId) {
            const cat = categories.find(c => c.id === sec.categoryId);
            if (!cat) return null;

            const catNews = publishedNews.filter(n => n.categoryId === cat.id);
            if (catNews.length === 0) return null;

            const mainStory = catNews[0];
            const otherStories = catNews.slice(1, sec.newsCount || 4);
            const localizedCatName = getCategoryNameByLanguage(cat, lang);

            return (
              <section key={sec.id} className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#D32F2F] pl-2 sm:pl-2.5">
                    {sec.title || localizedCatName}
                  </h2>
                  <Link 
                    to={`/category/${cat.slug}`} 
                    className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#D32F2F] flex items-center gap-1 group py-1"
                  >
                    <span>{labels.moreNews}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                {sec.layout === 'bento' || cat.slug === 'khulna' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                    {/* Big category spotlight on left */}
                    <div className="lg:col-span-7">
                      {mainStory && <NewsCard news={mainStory} variant="grid" showSummary={true} />}
                    </div>
                    {/* Horizontal cards on right */}
                    <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
                      {otherStories.map(item => (
                        <NewsCard key={item.id} news={item} variant="list" showSummary={false} />
                      ))}
                    </div>
                  </div>
                ) : sec.layout === 'list' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {catNews.slice(0, sec.newsCount || 4).map(item => (
                      <NewsCard key={item.id} news={item} variant="list" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {catNews.slice(0, sec.newsCount || 3).map(item => (
                      <NewsCard key={item.id} news={item} variant="grid" />
                    ))}
                  </div>
                )}
              </section>
            );
          }

          return null;
        })}

        {/* 4. MORE CATEGORIES IN COLUMNS (Mobile optimized cards) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 pt-2 sm:pt-4 border-t border-gray-200 dark:border-gray-800">
          {/* Column A: রাজনীতি */}
          <div className="space-y-2.5 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white border-l-3 border-[#D32F2F] pl-2">
                {getCategoryNameByLanguage(categories.find(c => c.slug === 'politics') || { name: 'রাজনীতি', slug: 'politics' }, lang)}
              </h3>
              <Link to="/category/politics" className="text-xs text-[#D32F2F] font-bold hover:underline py-0.5">{labels.viewAll}</Link>
            </div>
            <div className="space-y-1">
              {publishedNews.filter(n => n.categoryId === 'cat-politics').slice(0, 3).map(item => (
                <NewsCard key={item.id} news={item} variant="compact" />
              ))}
            </div>
          </div>

          {/* Column B: খেলাধুলা */}
          <div className="space-y-2.5 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white border-l-3 border-[#D32F2F] pl-2">
                {getCategoryNameByLanguage(categories.find(c => c.slug === 'sports') || { name: 'খেলাধুলা', slug: 'sports' }, lang)}
              </h3>
              <Link to="/category/sports" className="text-xs text-[#D32F2F] font-bold hover:underline py-0.5">{labels.viewAll}</Link>
            </div>
            <div className="space-y-1">
              {publishedNews.filter(n => n.categoryId === 'cat-sports').slice(0, 3).map(item => (
                <NewsCard key={item.id} news={item} variant="compact" />
              ))}
            </div>
          </div>

          {/* Column C: অর্থনীতি ও মোংলা */}
          <div className="space-y-2.5 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white border-l-3 border-[#D32F2F] pl-2">
                {getCategoryNameByLanguage(categories.find(c => c.slug === 'economy' || c.slug === 'business') || { name: 'ব্যবসা ও বাণিজ্য', slug: 'economy' }, lang)}
              </h3>
              <Link to="/category/economy" className="text-xs text-[#D32F2F] font-bold hover:underline py-0.5">{labels.viewAll}</Link>
            </div>
            <div className="space-y-1">
              {publishedNews.filter(n => n.categoryId === 'cat-economy' || n.categoryId === 'cat-business').slice(0, 3).map(item => (
                <NewsCard key={item.id} news={item} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
