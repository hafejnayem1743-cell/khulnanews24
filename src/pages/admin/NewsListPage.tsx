import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { formatBanglaDate, toBanglaNumber, toBanglaCommaNumber, toBanglaMetric } from '../../services/seo';
import { NewsItem, KhulnaDistrict } from '../../types';
import { 
  PlusCircle, Search, Filter, Edit, Trash2, 
  ExternalLink, Eye, Star, Radio, Copy, Check, 
  AlertTriangle, ArrowUpDown, Heart, Share2,
  Rss, Bot, MapPin, Globe, Sparkles
} from 'lucide-react';

const KHULNA_DISTRICT_LABELS: Record<KhulnaDistrict, string> = {
  Khulna: 'খুলনা',
  Bagerhat: 'বাগেরহাট',
  Satkhira: 'সাতক্ষীরা',
  Jashore: 'যশোর',
  Narail: 'নড়াইল',
  Jhenaidah: 'ঝিনাইদহ',
  Magura: 'মাগুরা',
  Kushtia: 'কুষ্টিয়া',
  Chuadanga: 'চুয়াডাঙ্গা',
  Meherpur: 'মেহেরপুর'
};

export const NewsListPage: React.FC = () => {
  const { news, categories, updateNews, deleteNews, addNews, showToast } = useNews();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOrigin, setFilterOrigin] = useState<'all' | 'auto' | 'manual'>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const autoCount = news.filter(n => n.isAutoCollected).length;
  const manualCount = news.filter(n => !n.isAutoCollected).length;

  const filteredNews = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        n.authorName.toLowerCase().includes(search.toLowerCase()) ||
                        (n.district && n.district.toLowerCase().includes(search.toLowerCase())) ||
                        (n.sourceName && n.sourceName.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = filterCategory === 'all' || n.categoryId === filterCategory;
    const matchStatus = filterStatus === 'all' || n.status === filterStatus;
    const matchOrigin = filterOrigin === 'all' 
      ? true 
      : filterOrigin === 'auto' 
        ? !!n.isAutoCollected 
        : !n.isAutoCollected;
    const matchDistrict = filterDistrict === 'all' || n.district === filterDistrict;

    return matchSearch && matchCategory && matchStatus && matchOrigin && matchDistrict;
  }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const handleToggleFeatured = (item: NewsItem) => {
    updateNews({ ...item, isFeatured: !item.isFeatured });
    showToast(item.isFeatured ? 'ফিচার্ড লিস্ট থেকে সরানো হয়েছে' : 'ফিচার্ড সংবাদে যুক্ত হয়েছে', 'info');
  };

  const handleToggleBreaking = (item: NewsItem) => {
    updateNews({ ...item, isBreaking: !item.isBreaking });
    showToast(item.isBreaking ? 'ব্রেকিং স্ট্যাটাস অপসারিত' : 'ব্রেকিং নিউজ হিসেবে চিহ্নিত', 'info');
  };

  const handleDuplicate = (item: NewsItem) => {
    const duplicated: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      title: `${item.title} (কপি)`,
      slug: `${item.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft',
      viewCount: item.viewCount || (35000 + Math.floor(Math.random() * 40000)),
      likeCount: item.likeCount || (2400 + Math.floor(Math.random() * 3000)),
      shareCount: item.shareCount || (1100 + Math.floor(Math.random() * 1500)),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    addNews(duplicated);
    showToast('সংবাদের অনুলিপি তৈরি করা হয়েছে!', 'success');
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">সংবাদ তালিকা ও পরিচালনা</h1>
          <p className="text-xs text-slate-500 mt-0.5">ম্যানুয়াল ও স্বয়ংক্রিয় (Auto News) সংবাদ সম্পাদনা, ফিল্টার ও পরিচালনা করুন</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/auto-news"
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Rss className="w-4 h-4" />
            অটো নিউজ কালেক্টর
          </Link>
          <Link
            to="/admin/news/new"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            নতুন সংবাদ প্রকাশ
          </Link>
        </div>
      </div>

      {/* Origin Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilterOrigin('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterOrigin === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          সকল সংবাদ ({news.length})
        </button>
        <button
          onClick={() => setFilterOrigin('auto')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterOrigin === 'auto'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          স্বয়ংক্রিয় সংবাদ ({autoCount})
        </button>
        <button
          onClick={() => setFilterOrigin('manual')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterOrigin === 'manual'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          ম্যানুয়াল সংবাদ ({manualCount})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="শিরোনাম, জেলা, সোর্স বা রিপোর্টারের নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">১০টি জেলা (সকল)</option>
            {Object.entries(KHULNA_DISTRICT_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label} জেলা</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="published">প্রকাশিত</option>
            <option value="draft">ড্রাফট</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">ছবি ও শিরোনাম</th>
                <th className="p-3.5">জেলা ও সোর্স</th>
                <th className="p-3.5">বিভাগ</th>
                <th className="p-3.5">পাঠক ভিউজ</th>
                <th className="p-3.5">ফিচার্ড / ব্রেকিং</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5">প্রকাশের সময়</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    কোনো সংবাদ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredNews.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.featuredImage}
                          alt=""
                          className="w-14 h-10 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0 max-w-md">
                          <Link
                            to={`/news/${item.slug}`}
                            target="_blank"
                            className="font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors line-clamp-1 flex items-center gap-1.5"
                          >
                            {item.title}
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px]">
                            {item.isAutoCollected ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                                <Bot className="w-3 h-3" />
                                অটো নিউজ
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                ম্যানুয়াল পোস্ট
                              </span>
                            )}
                            <span className="text-slate-400">
                              রিপোর্টার: {item.authorName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* District & Source */}
                    <td className="p-3.5">
                      <div className="flex flex-col gap-1">
                        {item.district ? (
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 text-xs">
                            <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                            {KHULNA_DISTRICT_LABELS[item.district as KhulnaDistrict] || item.district}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">খুলনা বিভাগ</span>
                        )}

                        {item.sourceName && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Globe className="w-3 h-3 text-slate-400" />
                            {item.sourceUrl ? (
                              <a 
                                href={item.sourceUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                                title={item.sourceUrl}
                              >
                                {item.sourceName}
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span>{item.sourceName}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                      {item.categoryName}
                    </td>

                    {/* View Count & Engagement */}
                    <td className="p-3.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400" title="প্রকৃত পাঠক ভিজিট সংখ্যা">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{toBanglaCommaNumber(item.realViews ?? 0)}</span>
                            <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1 py-0.2 rounded">আসল</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium" title="পাবলিক ডিসপ্লে ভিউ">
                          পাবলিক: {toBanglaMetric(item.viewCount || 35000)}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-0.5 text-rose-500 font-semibold">
                            <Heart className="w-3 h-3 fill-rose-500/20" />
                            {toBanglaMetric(item.likeCount || 2500)}
                          </span>
                          <span className="flex items-center gap-0.5 text-blue-500 font-semibold">
                            <Share2 className="w-3 h-3" />
                            {toBanglaMetric(item.shareCount || 1100)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Quick Toggles */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`p-1.5 rounded-md border transition-colors ${
                            item.isFeatured 
                              ? 'bg-amber-100 border-amber-300 text-amber-600 dark:bg-amber-950/60 dark:border-amber-700' 
                              : 'border-slate-200 text-slate-400 dark:border-slate-700'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleBreaking(item)}
                          className={`p-1.5 rounded-md border transition-colors ${
                            item.isBreaking 
                              ? 'bg-red-100 border-red-300 text-red-600 dark:bg-red-950/60 dark:border-red-700' 
                              : 'border-slate-200 text-slate-400 dark:border-slate-700'
                          }`}
                          title="Toggle Breaking"
                        >
                          <Radio className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}>
                        {item.status === 'published' ? 'প্রকাশিত' : 'ড্রাফট'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                      {formatBanglaDate(item.publishedAt)}
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/news/edit/${item.id}`}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                          title="Edit News"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(item)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              সংবাদটি মুছে ফেলতে চান?
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              মুছে ফেলার পর এই সংবাদটি আর পুনরুদ্ধার করা সম্ভব হবে না।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                বাতিল
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
