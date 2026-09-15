import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Shield, Save, Globe, Search, Code, CheckCircle2 } from 'lucide-react';

export const SeoSettingsPage: React.FC = () => {
  const { siteSettings, updateSettings, showToast } = useNews();
  const [formData, setFormData] = useState(siteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('এসইও সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-red-600" />
            গ্লোবাল এসইও ও সার্চ ইঞ্জিন কনফিগারেশন
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Google Search Console, Analytics, Meta Tags ও Social Fallback Image কনফিগার করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>সংরক্ষণ করুন</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">সার্চ ইঞ্জিন মেটাডাটা (Search Engine Metadata)</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ডিফল্ট এসইও শিরোনাম (Default Title)
            </label>
            <input
              type="text"
              value={formData.defaultSeoTitle}
              onChange={(e) => setFormData({ ...formData, defaultSeoTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ডিফল্ট মেটা বিবরণ (Meta Description)
            </label>
            <textarea
              rows={3}
              value={formData.defaultMetaDescription}
              onChange={(e) => setFormData({ ...formData, defaultMetaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ডিফল্ট সোশ্যাল শেয়ারিং ইমেজ URL (OG Image)
            </label>
            <input
              type="url"
              value={formData.defaultSocialImage}
              onChange={(e) => setFormData({ ...formData, defaultSocialImage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">ট্র্যাকিং ও ভেরিফিকেশন কোড</h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Google Search Console ভেরিফিকেশন কোড
            </label>
            <input
              type="text"
              value={formData.searchConsoleVerification}
              onChange={(e) => setFormData({ ...formData, searchConsoleVerification: e.target.value })}
              placeholder="google-site-verification=..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Google Analytics Measurement ID (GA4)
            </label>
            <input
              type="text"
              value={formData.googleAnalyticsId}
              onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
              placeholder="G-KHULNA2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
