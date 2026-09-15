import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { BreakingNewsItem } from '../../types';
import { 
  Radio, Plus, Edit, Trash2, CheckCircle2, 
  ExternalLink, ArrowUpDown, AlertCircle 
} from 'lucide-react';

export const BreakingNewsManager: React.FC = () => {
  const { 
    breakingNews, 
    addBreakingNews, 
    updateBreakingNews, 
    deleteBreakingNews, 
    siteSettings, 
    updateSettings, 
    showToast 
  } = useNews();

  const [headline, setHeadline] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [priority, setPriority] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setHeadline('');
    setLinkUrl('');
    setPriority(1);
    setIsActive(true);
    setEditingId(null);
  };

  const handleGlobalToggle = () => {
    updateSettings({
      ...siteSettings,
      breakingNewsEnabled: !siteSettings.breakingNewsEnabled
    });
    showToast(
      siteSettings.breakingNewsEnabled ? 'ব্রেকিং টিকার নিষ্ক্রিয় করা হয়েছে' : 'ব্রেকিং টিকার সক্রিয় করা হয়েছে', 
      'info'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    if (editingId) {
      const existing = breakingNews.find(b => b.id === editingId);
      if (existing) {
        updateBreakingNews({
          ...existing,
          headline: headline.trim(),
          linkUrl: linkUrl.trim() || undefined,
          priority: Number(priority),
          isActive
        });
        showToast('ব্রেকিং নিউজ আপডেট হয়েছে!', 'success');
      }
    } else {
      const newItem: BreakingNewsItem = {
        id: `brk-${Date.now()}`,
        headline: headline.trim(),
        linkUrl: linkUrl.trim() || undefined,
        isActive,
        priority: Number(priority),
        createdAt: new Date().toISOString()
      };
      addBreakingNews(newItem);
      showToast('নতুন ব্রেকিং নিউজ যুক্ত হয়েছে!', 'success');
    }

    resetForm();
  };

  const handleEditClick = (item: BreakingNewsItem) => {
    setEditingId(item.id);
    setHeadline(item.headline);
    setLinkUrl(item.linkUrl || '');
    setPriority(item.priority || 1);
    setIsActive(item.isActive);
  };

  const handleToggleActive = (item: BreakingNewsItem) => {
    updateBreakingNews({ ...item, isActive: !item.isActive });
    showToast(item.isActive ? 'টিকার থেকে লুকানো হয়েছে' : 'টিকারে সক্রিয় হয়েছে', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header and Master Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-600 animate-pulse" />
            ব্রেকিং নিউজ টিকার ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ওয়েবসাইটের শীর্ষে লাল ব্রেকিং নিউজ স্ক্রলবার নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={handleGlobalToggle}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors ${
            siteSettings.breakingNewsEnabled
              ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/30'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${siteSettings.breakingNewsEnabled ? 'bg-yellow-300' : 'bg-slate-400'}`} />
          {siteSettings.breakingNewsEnabled ? 'টিকার চালু আছে (Active)' : 'টিকার বন্ধ আছে (Disabled)'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            {editingId ? 'ব্রেকিং হেডলাইন সম্পাদনা' : 'নতুন ব্রেকিং হেডলাইন যোগ করুন'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ব্রেকিং হেডলাইন টেক্সট *
              </label>
              <textarea
                required
                rows={3}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="যেমন: খুলনা প্রকৌশল বিশ্ববিদ্যালয়ের শিক্ষার্থীদের নতুন উদ্ভাবন..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                সংবাদের লিঙ্ক (Link URL - Optional)
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/news/khulna-special-story"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                অগ্রাধিকার ক্রম (Priority)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                টিকারে সক্রিয়ভাবে দেখান
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                {editingId ? 'হালনাগাদ করুন' : 'হেডলাইন যোগ করুন'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              ব্রেকিং হেডলাইন তালিকা ({breakingNews.length})
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {breakingNews.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">কোনো ব্রেকিং নিউজ নেই।</p>
            ) : (
              breakingNews.map(item => (
                <div key={item.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {item.headline}
                    </p>
                    {item.linkUrl && (
                      <p className="text-[11px] text-red-600 font-mono">{item.linkUrl}</p>
                    )}
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                    }`}>
                      {item.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 text-xs"
                      title="Toggle Active"
                    >
                      <Radio className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteBreakingNews(item.id)}
                      className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
