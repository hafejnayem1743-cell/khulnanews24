import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { formatBanglaDate, toBanglaNumber, toBanglaCommaNumber, toBanglaMetric } from '../../services/seo';
import { 
  Newspaper, Eye, Radio, FolderTree, PlusCircle, 
  DollarSign, TrendingUp, BarChart3,
  CheckCircle, Clock, ExternalLink, Edit 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { news, categories, breakingNews, adSlots, currentUser } = useNews();

  const totalNews = news.length;
  const publishedNews = news.filter(n => n.status === 'published').length;
  const draftNews = news.filter(n => n.status === 'draft').length;
  const totalViews = news.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const totalRealViews = news.reduce((acc, curr) => acc + (curr.realViews || 0), 0);
  const activeBreaking = breakingNews.filter(b => b.isActive).length;
  const activeAds = adSlots.filter(a => a.isActive).length;

  const recentNews = [...news]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md">
            অ্যাডমিন ড্যাশবোর্ড
          </span>
          <h1 className="text-2xl md:text-3xl font-black mt-2">
            স্বাগতম, {currentUser?.name || 'সম্পাদক'}!
          </h1>
          <p className="text-xs md:text-sm text-red-100 mt-1">
            খুলনা নিউজ পোর্টালের সর্বমোট কনটেন্ট, ট্রাফিক ও বিজ্ঞাপন স্ট্যাটাস এখান থেকে নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <Link
          to="/admin/news/new"
          className="px-5 py-3 bg-white text-red-600 hover:bg-yellow-300 hover:text-slate-900 font-extrabold text-xs md:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          নতুন সংবাদ তৈরি করুন
        </Link>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total News */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">মোট সংবাদ</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600">
              <Newspaper className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {toBanglaNumber(totalNews)}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
            <span className="text-emerald-600 font-semibold">{toBanglaNumber(publishedNews)} প্রকাশিত</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{toBanglaNumber(draftNews)} ড্রাফট</span>
          </div>
        </div>

        {/* Stat 2: Real Views vs Public Views */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">প্রকৃত পাঠক ভিজিটর</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-3">
            {toBanglaCommaNumber(totalRealViews)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="text-slate-700 dark:text-slate-300 font-bold">{toBanglaMetric(totalViews)}</span> পাবলিক প্রদর্শিত ভিউজ
          </p>
        </div>

        {/* Stat 3: Breaking News */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">সক্রিয় ব্রেকিং টিকার</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {toBanglaNumber(activeBreaking)}
          </p>
          <Link to="/admin/breaking" className="text-[11px] text-red-600 font-semibold mt-1 hover:underline block">
            টিকার পরিচালনা করুন →
          </Link>
        </div>

        {/* Stat 4: Ad Slots */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Adsterra স্লট</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-3">
            {toBanglaNumber(activeAds)} / {toBanglaNumber(adSlots.length)}
          </p>
          <Link to="/admin/ads" className="text-[11px] text-emerald-600 font-semibold mt-1 hover:underline block">
            বিজ্ঞাপন কোড আপডেট →
          </Link>
        </div>
      </div>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/admin/news/new"
          className="p-4 bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors shadow-xs group"
        >
          <PlusCircle className="w-6 h-6 text-red-600 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">নতুন খবর পোস্ট</span>
        </Link>
        <Link
          to="/admin/breaking"
          className="p-4 bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors shadow-xs group"
        >
          <Radio className="w-6 h-6 text-amber-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ব্রেকিং টিকার</span>
        </Link>
        <Link
          to="/admin/categories"
          className="p-4 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors shadow-xs group"
        >
          <FolderTree className="w-6 h-6 text-blue-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ক্যাটাগরি সমূহ</span>
        </Link>
        <Link
          to="/admin/analytics"
          className="p-4 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors shadow-xs group"
        >
          <BarChart3 className="w-6 h-6 text-purple-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            রিডার্স অ্যানালিটিক্স
          </span>
        </Link>
      </div>

      {/* Recent Published News Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">সাম্প্রতিক প্রকাশিত সংবাদ</h2>
            <p className="text-xs text-slate-500">সর্বশেষ সংযোজিত ও সম্পাদিত সংবাদসমূহের তালিকা</p>
          </div>
          <Link
            to="/admin/news"
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            সব সংবাদ দেখুন →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">ছবি ও শিরোনাম</th>
                <th className="p-3.5">বিভাগ</th>
                <th className="p-3.5">ভিউ (আসল / পাবলিক)</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {recentNews.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.featuredImage}
                        alt=""
                        className="w-12 h-9 object-cover rounded-md bg-slate-100 dark:bg-slate-800 shrink-0"
                      />
                      <div className="min-w-0 max-w-sm">
                        <Link 
                          to={`/news/${item.slug}`} 
                          target="_blank" 
                          className="font-bold text-slate-900 dark:text-white hover:text-red-600 line-clamp-1 flex items-center gap-1"
                        >
                          {item.title}
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-slate-400">{item.authorName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {item.categoryName}
                  </td>
                  <td className="p-3.5 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {toBanglaCommaNumber(item.realViews || 0)} আসল
                      </span>
                      <span className="text-[10px] text-slate-400">
                        পাবলিক: {toBanglaMetric(item.viewCount || 35000)}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'published' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {item.status === 'published' ? 'প্রকাশিত' : 'ড্রাফট'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 whitespace-nowrap">
                    {formatBanglaDate(item.publishedAt)}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <Link
                      to={`/admin/news/edit/${item.id}`}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-lg inline-flex items-center gap-1 text-[11px] font-semibold transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
