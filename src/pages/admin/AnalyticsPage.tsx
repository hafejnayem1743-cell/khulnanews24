import React from 'react';
import { useNews } from '../../context/NewsContext';
import { toBanglaNumber, formatBanglaDate, toBanglaCommaNumber, toBanglaMetric } from '../../services/seo';
import { 
  TrendingUp, Eye, Newspaper, Users, BarChart3, 
  ArrowUpRight, Clock, Award, Globe, Flame, Heart, Share2 
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { news, categories, authors } = useNews();

  const totalViews = news.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const publishedNews = news.filter(n => n.status === 'published');
  const avgViewsPerArticle = publishedNews.length ? Math.round(totalViews / publishedNews.length) : 0;

  // Top 10 viewed news
  const topNews = [...news]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 10);

  // Category views breakdown
  const categoryStats = categories.map(cat => {
    const catArticles = news.filter(n => n.categoryId === cat.id);
    const catViews = catArticles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    return {
      id: cat.id,
      name: cat.name,
      articleCount: catArticles.length,
      views: catViews,
      percentage: totalViews ? Math.round((catViews / totalViews) * 100) : 0
    };
  }).sort((a, b) => b.views - a.views);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-red-600" />
          রিয়েল-টাইম রিডার্স অ্যানালিটিক্স
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          পাঠকের এনগেজমেন্ট, সর্বোচ্চ পঠিত সংবাদ ও বিভাগভিত্তিক ট্রাফিকের পরিসংখ্যান
        </p>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500">মোট রিডার ভিউজ</span>
          <p className="text-3xl font-black text-red-600 mt-2">
            {toBanglaCommaNumber(totalViews)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> লাইভ ভিউ কাউন্টার
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500">প্রকাশিত সংবাদ</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {toBanglaNumber(publishedNews.length)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            সর্বমোট {toBanglaNumber(news.length)} টি সংবাদের মধ্যে
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500">গড় ভিউ / সংবাদ</span>
          <p className="text-3xl font-black text-blue-600 mt-2">
            {toBanglaCommaNumber(avgViewsPerArticle)}
          </p>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            প্রতি আর্টিকেলের গড় পাঠক
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500">সক্রিয় বিভাগসমূহ</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">
            {toBanglaNumber(categories.length)}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {toBanglaNumber(authors.length)} জন নিবন্ধিত রিপোর্টার
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Viewed News */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600" />
              <span>সর্বোচ্চ পঠিত শীর্ষ সংবাদ (Top Viewed Stories)</span>
            </h2>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topNews.map((item, idx) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                    idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-amber-500 text-white' : idx === 2 ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-12 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <a
                      href={`/news/${item.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-red-600 line-clamp-1"
                    >
                      {item.title}
                    </a>
                    <span className="text-[10px] text-slate-500">
                      {item.categoryName} • {formatBanglaDate(item.publishedAt)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-red-600 block">
                    {toBanglaCommaNumber(item.viewCount || 0)} ভিউ
                  </span>
                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <span className="text-rose-500 font-bold">{toBanglaMetric(item.likeCount || 2500)} লাইক</span>
                    <span>•</span>
                    <span className="text-blue-500 font-bold">{toBanglaMetric(item.shareCount || 1100)} শেয়ার</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Category Performance */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>বিভাগভিত্তিক ট্রাফিক অনুপাত</span>
          </h2>

          <div className="space-y-3.5">
            {categoryStats.slice(0, 8).map(stat => (
              <div key={stat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{stat.name}</span>
                  <span className="text-slate-500 font-semibold">{toBanglaNumber(stat.views)} ভিউ ({stat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(stat.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
