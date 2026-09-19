import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage } from '../../services/language';
import { KHULNA_DISTRICTS } from '../../services/newsCollector';
import { fetchDistrictNews } from '../../services/newsApi';
import { NewsCard } from '../../components/common/NewsCard';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';
import { SeoHead } from '../../components/common/SeoHead';
import { generateDistrictSchema } from '../../services/seo';
import { NewsItem } from '../../types';
import { 
  ChevronRight, MapPin, Grid, List, Flame, 
  PhoneCall, MessageSquare, AlertCircle, Compass, 
  RefreshCw, Share2 
} from 'lucide-react';

interface DistrictPageProps {
  districtSlug?: string;
}

export const DistrictPage: React.FC<DistrictPageProps> = ({ districtSlug: propSlug }) => {
  const params = useParams<{ districtSlug?: string; districtName?: string }>();
  const rawSlug = (propSlug || params.districtSlug || params.districtName || '').toLowerCase().trim();
  
  // Handle alias: /jessore -> /jashore
  if (rawSlug === 'jessore') {
    return <Navigate to="/jashore" replace />;
  }

  const { news: globalNews, siteSettings } = useNews();
  const { labels, formatDate } = useActiveLanguage();
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  // State for API fetched news
  const [apiNews, setApiNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Find target district definition
  const currentDistrict = useMemo(() => {
    return KHULNA_DISTRICTS.find(d => 
      d.englishName.toLowerCase() === rawSlug || 
      d.id.toLowerCase() === rawSlug ||
      d.banglaName === rawSlug
    );
  }, [rawSlug]);

  // If slug doesn't match any of the 10 districts, return not found or redirect to home
  if (!currentDistrict) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          জেলা পাওয়া যায়নি
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          খুলনা বিভাগের ১০টি জেলার মধ্য থেকে অনুগ্রহ করে সঠিক জেলা নির্বাচন করুন।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto mb-8">
          {KHULNA_DISTRICTS.map(d => (
            <Link
              key={d.id}
              to={`/${d.englishName.toLowerCase()}`}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors"
            >
              {d.banglaName}
            </Link>
          ))}
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          প্রচ্ছদে ফিরে যান
        </Link>
      </div>
    );
  }

  const districtBangla = currentDistrict.banglaName;
  const districtEnglish = currentDistrict.englishName;
  const activeSlug = districtEnglish.toLowerCase();

  // Load district-specific news from Cloudflare Worker API using exact Bengali name
  const loadDistrictNews = useCallback(async () => {
    if (!districtBangla) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetchDistrictNews(districtBangla, 5000);
      if (res.ok) {
        setApiNews(res.news);
      } else {
        setErrorMessage('এই মুহূর্তে সংবাদ লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error(`Error loading news for district ${districtBangla}:`, err);
      setErrorMessage('এই মুহূর্তে সংবাদ লোড করা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }, [districtBangla]);

  useEffect(() => {
    loadDistrictNews();
  }, [loadDistrictNews]);

  // Combine fetched Worker news with any manual admin posts for this district
  const districtNews = useMemo(() => {
    // Collect any manual news created in admin for this district
    const manualMatches = globalNews.filter(n => {
      if (n.status !== 'published' || n.isAutoCollected) return false;
      return (
        n.district === districtBangla ||
        (n.district && n.district.toLowerCase() === districtEnglish.toLowerCase()) ||
        (n.tags && n.tags.includes(districtBangla))
      );
    });

    const combined = [...manualMatches, ...apiNews];
    // Deduplicate
    const seen = new Set<string>();
    const unique = combined.filter(item => {
      const key = item.url || item.sourceUrl || item.id || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [apiNews, globalNews, districtBangla, districtEnglish]);

  const featuredStory = districtNews[0];
  const remainingStories = districtNews.slice(1);
  const displayedStories = remainingStories.slice(0, visibleCount);

  // Other Khulna division top news (for fallback or sidebar)
  const divisionTopNews = useMemo(() => {
    return globalNews
      .filter(n => n.status === 'published' && n.id !== featuredStory?.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
  }, [globalNews, featuredStory?.id]);

  // Structured breadcrumb items
  const breadcrumbs = [
    { name: labels.home || 'প্রচ্ছদ', url: '/' },
    { name: 'খুলনা বিভাগ', url: '/category/khulna' },
    { name: `${districtBangla} জেলা`, url: `/${activeSlug}` }
  ];

  // District JSON-LD schema
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://khulnanews24.pages.dev';
  const districtSchema = generateDistrictSchema(
    districtBangla,
    districtEnglish,
    activeSlug,
    districtNews,
    siteSettings,
    origin
  );

  return (
    <div className="min-h-screen">
      {/* Primary District SEO Head */}
      <SeoHead
        title={`${districtBangla} জেলার খবর | খুলনা নিউজ ২৪`}
        description={`${districtBangla} (${districtEnglish}) জেলার সর্বশেষ তাজা খবর, ব্রেকিং নিউজ, স্থানীয় সংবাদ, রাজনীতি ও জনজীবনের আপডেট পড়ুন খুলনা নিউজ ২৪ পোর্টালে।`}
        url={`${origin}/${activeSlug}`}
        breadcrumbs={breadcrumbs}
        jsonLdSchema={districtSchema}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Breadcrumb (Crawlable & Clean) */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 overflow-x-auto no-scrollbar py-1">
          <Link to="/" className="hover:text-red-600 transition-colors shrink-0">{labels.home || 'প্রচ্ছদ'}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <Link to="/category/khulna" className="hover:text-red-600 transition-colors shrink-0">খুলনা বিভাগ</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="text-[#D32F2F] font-bold shrink-0">{districtBangla} জেলা</span>
        </nav>

        {/* District Page Header & Identity Banner */}
        <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-6 md:p-8 mb-5 sm:mb-6 shadow-sm overflow-hidden border border-slate-700/60">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[11px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 sm:mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>খুলনা বিভাগ • {districtEnglish} District</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2 sm:mb-3">
              {districtBangla} জেলার সর্বশেষ খবর
            </h1>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
              {districtBangla} জেলার প্রশাসন, স্থানীয় রাজনীতি, অর্থনীতি, কৃষি, শিক্ষা, সংস্কৃতি, অপরাধ ও সাধারণ মানুষের জীবনের সর্বশেষ বিশ্বস্ত তথ্য ও তাজা সংবাদ।
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-300">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-md font-medium">
                মোট সংবাদ: <strong className="text-white font-bold">{districtNews.length}</strong> টি
              </span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1 rounded-md font-medium">
                সর্বশেষ আপডেট: <strong className="text-white font-bold">{districtNews[0] ? formatDate(districtNews[0].publishedAt) : 'নিয়মিত আপডেট'}</strong>
              </span>
              <button
                onClick={loadDistrictNews}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 rounded-md font-medium text-white transition-all cursor-pointer"
                title="তাজা সংবাদ রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-red-400' : ''}`} />
                <span>রিফ্রেশ</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-5 pointer-events-none">
            <Compass className="w-80 h-80 text-white" />
          </div>
        </header>

        {/* 10 Khulna Division Districts Quick Navigation Ribbon */}
        <div className="mb-6 bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>খুলনা বিভাগের ১০টি জেলার খবর:</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              যেকোনো জেলায় ক্লিক করে সংবাদ পড়ুন
            </span>
          </div>
          
          <nav aria-label="Khulna 10 Districts" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-0.5">
            {KHULNA_DISTRICTS.map(dist => {
              const slug = dist.englishName.toLowerCase();
              const isActive = slug === activeSlug;
              return (
                <Link
                  key={dist.id}
                  to={`/${slug}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600'
                  }`}
                >
                  {dist.banglaName}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Left Column (8 cols): District News Stories */}
          <main className="lg:col-span-8 space-y-5 sm:space-y-6">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                {districtBangla} সংবাদের তালিকা
              </h2>

              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded transition-colors ${layoutMode === 'grid' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                  title="গ্রিড ভিউ"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded transition-colors ${layoutMode === 'list' ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
                  title="লিস্ট ভিউ"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 1. Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {/* Hero skeleton */}
                <div className="w-full h-64 sm:h-80 bg-slate-100 dark:bg-slate-800/80 rounded-2xl animate-pulse flex flex-col justify-end p-6">
                  <div className="w-24 h-5 bg-slate-300 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="w-3/4 h-7 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-slate-300 dark:bg-slate-700 rounded"></div>
                </div>
                {/* Grid skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                      <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                      <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : errorMessage ? (
              /* 2. Error State (No fake news, simple genuine message) */
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-red-200/80 dark:border-red-900/40 text-center shadow-2xs">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {errorMessage}
                </h3>
                <button
                  onClick={loadDistrictNews}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs mt-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>পুনরায় চেষ্টা করুন</span>
                </button>
              </div>
            ) : districtNews.length > 0 ? (
              /* 3. News Loaded Successfully */
              <div className="space-y-6">
                {/* Featured Story */}
                {featuredStory && (
                  <div className="mb-4">
                    <NewsCard news={featuredStory} variant="hero" />
                  </div>
                )}

                {/* Remaining Stories */}
                {displayedStories.length > 0 && (
                  <div className={
                    layoutMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'
                      : 'space-y-4'
                  }>
                    {displayedStories.map(item => (
                      <NewsCard
                        key={item.id}
                        news={item}
                        variant={layoutMode === 'grid' ? 'grid' : 'list'}
                      />
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {remainingStories.length > visibleCount && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setVisibleCount(prev => prev + 12)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-2xs"
                    >
                      আরো সংবাদ দেখুন ({remainingStories.length - visibleCount}টি বাকি)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* 4. Empty State (Zero news returned) */
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2">
                  এই বিভাগে বর্তমানে কোনো সংবাদ পাওয়া যায়নি।
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
                  আমাদের আঞ্চলিক সাংবাদিক ও সংবাদের সংগ্রাহক সিস্টেম মাঠ পর্যায় থেকে তথ্য সংগ্রহ করছে। নতুন সংবাদ প্রকাশিত হওয়ামাত্রই এখানে দেখতে পাবেন।
                </p>

                {/* Citizen Journalism Call to Action */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 max-w-md mx-auto border border-slate-200 dark:border-slate-700 text-left mb-6">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-1.5">
                    <MessageSquare className="w-4 h-4 text-red-600" />
                    আপনার এলাকার সংবাদ পাঠান
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-normal mb-3">
                    {districtBangla} জেলার যেকোনো ঘটনার তথ্য, ছবি বা ভিডিও আমাদের বার্তা বিভাগে সরাসরি কল অথবা এসএমএস করে পাঠাতে পারেন।
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${siteSettings.phone || '01306721743'}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      কল করুন ({siteSettings.phone || '01306721743'})
                    </a>
                    <a
                      href={`sms:${siteSettings.phone || '01306721743'}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      এসএমএস পাঠান
                    </a>
                  </div>
                </div>

                {/* Division Top News to keep user engaged */}
                <div className="text-left pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-600" />
                    খুলনা বিভাগের অন্যান্য জেলার সর্বশেষ খবর
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {divisionTopNews.slice(0, 4).map(item => (
                      <NewsCard key={item.id} news={item} variant="compact" />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-5 sm:space-y-6">
            {/* Citizen Journalism Card */}
            <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl p-4 sm:p-5 shadow-sm">
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-2">
                নাগরিক সাংবাদিকতা
              </span>
              <h3 className="text-base sm:text-lg font-black leading-snug mb-2">
                {districtBangla} থেকে সংবাদ দিন
              </h3>
              <p className="text-xs text-red-50 leading-relaxed mb-4">
                আপনার চারপাশের অনিয়ম, সাফল্য, উন্নয়ন অথবা যেকোনো জনগুরুত্বপূর্ণ ঘটনা আমাদের জানান। আমাদের বার্তা টিম তথ্য যাচাই করে গুরুত্বের সাথে প্রকাশ করবে।
              </p>
              
              <div className="space-y-2">
                <a 
                  href={`tel:${siteSettings.phone || '01306721743'}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-red-600 font-black text-xs rounded-xl shadow-xs hover:bg-red-50 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  সরাসরি কল করুন: {siteSettings.phone || '01306721743'}
                </a>
                <a 
                  href={`sms:${siteSettings.phone || '01306721743'}`}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-800/60 hover:bg-red-800 text-white font-bold text-xs rounded-xl transition-colors border border-red-400/40"
                >
                  <MessageSquare className="w-4 h-4" />
                  এসএমএস করে খবর পাঠান
                </a>
              </div>
            </div>

            {/* Adsterra Slot */}
            <AdsterraSlot position="SIDEBAR_TOP" />

            {/* Most Read in Khulna Division */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  খুলনা বিভাগের আলোচিত সংবাদ
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {divisionTopNews.map((item, idx) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id || item.slug}`}
                    className="flex items-start gap-3 py-2.5 group"
                  >
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.district && `${item.district} • `}{formatDate(item.publishedAt)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Khulna 10 Districts Directory Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-600" />
                ১০ জেলার লিংক
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {KHULNA_DISTRICTS.map(dist => {
                  const slug = dist.englishName.toLowerCase();
                  const isCurrent = slug === activeSlug;
                  return (
                    <Link
                      key={dist.id}
                      to={`/${slug}`}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/60 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600'
                      }`}
                    >
                      <span>{dist.banglaName}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
