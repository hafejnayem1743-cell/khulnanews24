import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { NewsCard } from '../../components/common/NewsCard';
import { SeoHead } from '../../components/common/SeoHead';
import { formatBanglaDate, toBanglaNumber } from '../../services/seo';
import { Calendar, Archive, Filter } from 'lucide-react';

export const ArchivePage: React.FC = () => {
  const { news, categories } = useNews();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const publishedNews = news.filter(n => n.status === 'published');

  const matchedNews = publishedNews.filter(n => {
    const pubDate = (n.publishedAt || '').slice(0, 10);
    const matchDate = selectedDate ? pubDate === selectedDate : true;
    const matchCat = selectedCat === 'all' || n.categoryId === selectedCat;
    return matchDate && matchCat;
  });

  return (
    <div className="min-h-screen">
      <SeoHead
        title="সংবাদ আর্কাইভ - পূর্ববর্তী সংবাদ সম্ভার"
        description="তারিখ অনুযায়ী খুলনা নিউজের সকল প্রকাশিত সংবাদ ব্রাউজ করুন।"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Archive Selector Box */}
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Archive className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">সংবাদ আর্কাইভ</h1>
              <p className="text-xs text-slate-500">তারিখ ও ক্যাটাগরি অনুযায়ী অতীতের খবর খুঁজুন</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-600" /> তারিখ নির্বাচন করুন:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-red-600" /> ক্যাটাগরি:
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => { setSelectedDate(''); setSelectedCat('all'); }}
                className="w-full px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl transition-colors"
              >
                ফিল্টার রিসেট
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedDate ? `${formatBanglaDate(selectedDate)} তারিখের খবর` : 'সকল আর্কাইভ সংবাদ'}
          </h2>
          <span className="text-xs text-slate-500">
            মোট: <strong className="text-red-600">{toBanglaNumber(matchedNews.length)}</strong> টি
          </span>
        </div>

        {matchedNews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">এই তারিখে বা ফিল্টারে কোনো প্রকাশিত সংবাদ পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedNews.map(item => (
              <NewsCard key={item.id} news={item} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
