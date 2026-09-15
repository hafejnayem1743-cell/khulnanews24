import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { NewsCard } from '../../components/common/NewsCard';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';
import { SeoHead } from '../../components/common/SeoHead';
import { TrendingUp, Clock, Filter } from 'lucide-react';

export const LatestNewsPage: React.FC = () => {
  const { news, categories } = useNews();
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const publishedNews = news
    .filter(n => n.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const filteredNews = selectedCat === 'all' 
    ? publishedNews 
    : publishedNews.filter(n => n.categoryId === selectedCat);

  return (
    <div className="min-h-screen">
      <SeoHead
        title="সর্বশেষ সংবাদ ও তাজা খবর"
        description="খুলনা, বাংলাদেশ ও বিশ্বের সর্বশেষ ব্রেকিং নিউজ এবং সংবাদ বুলেটিন।"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b-2 border-red-600 mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-600" />
              সর্বশেষ তাজা খবর
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
              মুহূর্তের খবর সবার আগে পেতে চোখ রাখুন খুলনা নিউজে
            </p>
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> ফিল্টার:
            </span>
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                selectedCat === 'all' ? 'bg-red-600 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              সব খবর ({publishedNews.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  selectedCat === cat.id ? 'bg-red-600 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {filteredNews.map(item => (
              <NewsCard key={item.id} news={item} variant="list" />
            ))}
          </div>

          <aside className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="flex justify-center overflow-hidden max-w-full">
              <AdsterraSlot position="SIDEBAR_TOP" />
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
