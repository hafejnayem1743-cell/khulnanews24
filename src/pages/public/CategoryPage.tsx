import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { NewsCard } from '../../components/common/NewsCard';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';
import { SeoHead } from '../../components/common/SeoHead';
import { ChevronRight, Grid, List, Flame } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, news } = useNews();
  const { lang, labels } = useActiveLanguage();
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const currentCategory = categories.find(c => c.slug === slug || c.id === `cat-${slug}`);

  const categoryNews = news
    .filter(n => n.status === 'published' && (n.categoryId === currentCategory?.id || n.categoryName.toLowerCase() === slug?.toLowerCase()))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const featuredCategoryNews = categoryNews[0];
  const remainingNews = categoryNews.slice(1);
  const paginatedNews = remainingNews.slice(0, page * itemsPerPage);

  const popularInCat = [...categoryNews]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  if (!currentCategory) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">ক্যাটাগরি পাওয়া যায়নি</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">অনুগ্রহ করে সঠিক ক্যাটাগরি নির্বাচন করুন।</p>
        <Link to="/" className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg">প্রচ্ছদে ফিরে যান</Link>
      </div>
    );
  }

  const localizedCategoryName = getCategoryNameByLanguage(currentCategory, lang);

  return (
    <div className="min-h-screen">
      <SeoHead
        title={`${localizedCategoryName} | Khulna News 24`}
        description={`${localizedCategoryName} - ${labels.latestNews}, ${labels.breaking}`}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 sm:mb-4 overflow-x-auto no-scrollbar py-1">
          <Link to="/" className="hover:text-red-600 shrink-0">{labels.home}</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#D32F2F] font-bold shrink-0">{localizedCategoryName}</span>
        </div>

        {/* Category Header Title & Layout toggles */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-l-3 border-[#D32F2F] pl-2">
              {localizedCategoryName}
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 pl-2.5">
              {currentCategory.englishName} • {labels.latestNews}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-gray-200 dark:border-gray-800 shadow-2xs">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded ${layoutMode === 'grid' ? 'bg-[#D32F2F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded ${layoutMode === 'list' ? 'bg-[#D32F2F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Featured Story for Category */}
            {featuredCategoryNews && (
              <div className="mb-4 sm:mb-6">
                <NewsCard news={featuredCategoryNews} variant="hero" />
              </div>
            )}

            {/* List / Grid of Category News */}
            {paginatedNews.length === 0 && !featuredCategoryNews ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500">{labels.noResults}</p>
              </div>
            ) : layoutMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                {paginatedNews.map(item => (
                  <NewsCard key={item.id} news={item} variant="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedNews.map(item => (
                  <NewsCard key={item.id} news={item} variant="list" />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {remainingNews.length > paginatedNews.length && (
              <div className="text-center pt-4 sm:pt-6">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="px-6 sm:px-8 py-2.5 bg-slate-900 dark:bg-slate-800 text-white hover:bg-[#D32F2F] dark:hover:bg-[#D32F2F] rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors"
                >
                  {labels.moreNews}
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 p-2 shadow-2xs flex justify-center overflow-hidden max-w-full">
              <AdsterraSlot position="SIDEBAR_TOP" />
            </div>

            {/* Popular in Category */}
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#D32F2F]" />
                {localizedCategoryName} - {labels.trending}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {popularInCat.map((item, i) => (
                  <NewsCard key={item.id} news={item} variant="trending" rank={i + 1} />
                ))}
              </div>
            </div>

            <div className="flex justify-center overflow-hidden max-w-full">
              <AdsterraSlot position="SIDEBAR_MIDDLE" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
