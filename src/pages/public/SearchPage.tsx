import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { NewsCard } from '../../components/common/NewsCard';
import { SeoHead } from '../../components/common/SeoHead';
import { toBanglaNumber } from '../../services/seo';
import { Search, Filter, Calendar, BookOpen } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');

  const { news, categories } = useNews();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const cleanQuery = query.toLowerCase().trim();

  const results = news.filter(n => {
    if (n.status !== 'published') return false;
    if (selectedCategory !== 'all' && n.categoryId !== selectedCategory) return false;

    if (!cleanQuery) return true;

    const matchTitle = n.title.toLowerCase().includes(cleanQuery);
    const matchContent = (n.content || '').toLowerCase().includes(cleanQuery);
    const matchSummary = (n.summary || '').toLowerCase().includes(cleanQuery);
    const matchCat = (n.categoryName || '').toLowerCase().includes(cleanQuery);
    const matchAuthor = (n.authorName || '').toLowerCase().includes(cleanQuery);
    const matchTags = (n.tags || []).some(t => t.toLowerCase().includes(cleanQuery));

    return matchTitle || matchContent || matchSummary || matchCat || matchAuthor || matchTags;
  }).sort((a, b) => {
    if (sortBy === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="min-h-screen">
      <SeoHead
        title={query ? `অনুসন্ধান: ${query}` : 'সংবাদ অনুসন্ধান'}
        description="খুলনা নিউজ আর্কাইভ থেকে আপনার কাঙ্ক্ষিত সংবাদটি সহজে খুঁজে নিন।"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Search Bar & Filters Box */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-6 sm:mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="শিরোনাম, বিষয়, ব্যক্তি বা ট্যাগ দিয়ে অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 dark:text-slate-300"
              >
                <option value="all">সকল বিভাগ</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-700 dark:text-slate-300"
              >
                <option value="latest">সর্বশেষ আগে</option>
                <option value="views">সর্বাধিক পঠিত</option>
              </select>

              <button
                type="submit"
                className="col-span-2 sm:col-span-1 w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shrink-0 shadow-2xs cursor-pointer text-center"
              >
                খুঁজুন
              </button>
            </div>
          </form>

          {/* Results Summary */}
          <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs text-slate-500">
            <span>
              অনুসন্ধানের ফলাফল: <strong className="text-red-600">{toBanglaNumber(results.length)}</strong> টি সংবাদ পাওয়া গেছে
            </span>
            {query && (
              <span>শব্দ: <strong className="text-slate-700 dark:text-slate-300">"{query}"</strong></span>
            )}
          </div>
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-300">
              কোনো সংবাদ খুঁজে পাওয়া যায়নি
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              দয়া করে বানান পরীক্ষা করুন অথবা ভিন্ন কোনো কীওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {results.map(item => (
              <NewsCard key={item.id} news={item} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
