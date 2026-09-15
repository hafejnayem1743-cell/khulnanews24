import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Share2, Facebook, Youtube, Send, Twitter, Save } from 'lucide-react';

export const SocialSettingsPage: React.FC = () => {
  const { siteSettings, updateSettings, showToast } = useNews();
  const [formData, setFormData] = useState(siteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('সোশ্যাল মিডিয়া সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-red-600" />
            সোশ্যাল মিডিয়া প্রোফাইল লিংক
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ফুটার এবং আর্টিকেলের সাথে যুক্ত অফিশিয়াল সোশ্যাল হ্যান্ডেল কনফিগার করুন (খালি রাখলে আইকন প্রদর্শিত হবে না)
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

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>ফেসবুক পেজ URL</span>
          </label>
          <input
            type="url"
            value={formData.facebookUrl}
            onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/khulnanewsofficial"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>ইউটিউব চ্যানেল URL</span>
          </label>
          <input
            type="url"
            value={formData.youtubeUrl}
            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
            placeholder="https://youtube.com/@khulnanews"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Send className="w-4 h-4 text-sky-500" />
            <span>টেলিগ্রাম চ্যানেল লিংক</span>
          </label>
          <input
            type="url"
            value={formData.telegramUrl}
            onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
            placeholder="https://t.me/khulnanews"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Twitter className="w-4 h-4 text-slate-900 dark:text-white" />
            <span>টুইটার / X হ্যান্ডেল URL</span>
          </label>
          <input
            type="url"
            value={formData.twitterUrl}
            onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
            placeholder="https://x.com/khulnanews"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
        </div>
      </form>
    </div>
  );
};
