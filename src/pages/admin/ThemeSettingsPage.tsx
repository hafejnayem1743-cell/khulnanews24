import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Palette, Sun, Moon, Check, Save } from 'lucide-react';

export const ThemeSettingsPage: React.FC = () => {
  const { theme, toggleTheme, setTheme, showToast } = useNews();
  const [accentColor, setAccentColor] = useState('#D32F2F');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('থিম সেটিংস সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-red-600" />
            থিম ও ভিজ্যুয়াল স্টাইল সেটিংস
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ডার্ক মোড, লাইট মোড ও পোর্টালের এডিটোরিয়াল কালার প্যালেট কনফিগার করুন
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

      {/* Theme Selection */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">ডিফল্ট অ্যাপিয়ারেন্স (Default Mode)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              theme === 'light'
                ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">লাইট মোড (Light Mode)</h3>
                <p className="text-[11px] text-slate-500">পরিষ্কার সাদা ব্যাকগ্রাউন্ড ও উচ্চ বৈসাদৃশ্য</p>
              </div>
            </div>
            {theme === 'light' && <Check className="w-5 h-5 text-red-600 font-bold" />}
          </div>

          <div
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              theme === 'dark'
                ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">ডার্ক মোড (Dark Mode)</h3>
                <p className="text-[11px] text-slate-500">গভীর চারকোল ব্যাকগ্রাউন্ড ও চোখের জন্য আরামদায়ক</p>
              </div>
            </div>
            {theme === 'dark' && <Check className="w-5 h-5 text-red-600 font-bold" />}
          </div>
        </div>
      </div>

      {/* Brand Accent Color */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">ব্র্যান্ড অ্যাকসেন্ট কালার (Editorial Primary Accent)</h2>
        <p className="text-xs text-slate-500">খুলনা নিউজের শিরোনাম, ব্রেকিং ব্যাজ ও বাটন হাইলাইট হিসেবে ব্যবহৃত রঙ</p>

        <div className="flex items-center gap-3">
          {[
            { name: 'খুলনা রেড (ডিফল্ট)', hex: '#D32F2F' },
            { name: 'গভীর মেরুন', hex: '#B71C1C' },
            { name: 'রয়েল ব্লু', hex: '#1E40AF' },
            { name: 'সুন্দরবন গ্রিন', hex: '#065F46' },
            { name: 'চারকোল স্লেট', hex: '#0F172A' },
          ].map(c => (
            <button
              key={c.hex}
              onClick={() => setAccentColor(c.hex)}
              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className="w-5 h-5 rounded-full" style={{ backgroundColor: c.hex }} />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
