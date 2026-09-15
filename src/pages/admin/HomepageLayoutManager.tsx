import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { HomepageSectionConfig } from '../../types';
import { 
  Layers, ArrowUp, ArrowDown, Eye, EyeOff, 
  Grid, List, LayoutTemplate, Save, Check 
} from 'lucide-react';

export const HomepageLayoutManager: React.FC = () => {
  const { homepageLayout, updateHomepageLayout, categories, showToast } = useNews();
  const [sections, setSections] = useState<HomepageSectionConfig[]>(homepageLayout);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    // Update orders
    const normalized = updated.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(normalized);
  };

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isVisible: !s.isVisible } : s));
  };

  const changeLayout = (id: string, layout: 'grid' | 'bento' | 'list') => {
    setSections(sections.map(s => s.id === id ? { ...s, layout } : s));
  };

  const changeCount = (id: string, count: number) => {
    setSections(sections.map(s => s.id === id ? { ...s, newsCount: count } : s));
  };

  const handleSave = () => {
    updateHomepageLayout(sections);
    showToast('হোমপেজের নতুন লেআউট সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-red-600" />
            হোমপেজ লেআউট ও সেকশন বিল্ডার
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            হোমপেজের প্রতিটি সেকশনের ক্রম, স্টাইল ও দৃশ্যমানতা সরাসরি পরিবর্তন করুন
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>লেআউট সংরক্ষণ করুন</span>
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs ${
              sec.isVisible 
                ? 'border-slate-200/80 dark:border-slate-800' 
                : 'border-slate-200/50 dark:border-slate-800/50 opacity-60 bg-slate-50 dark:bg-slate-950'
            }`}
          >
            {/* Left Info */}
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                #{idx + 1}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{sec.title}</h3>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  টাইপ: {sec.type} {sec.categoryId && `• ক্যাটাগরি: ${sec.categoryId}`}
                </span>
              </div>
            </div>

            {/* Middle Controls (Layout & Count) */}
            {sec.type !== 'ad_banner' && (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(['grid', 'bento', 'list'] as const).map(style => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => changeLayout(sec.id, style)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                        sec.layout === style ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                  <span>সংবাদ সংখ্যা:</span>
                  <select
                    value={sec.newsCount || 4}
                    onChange={(e) => changeCount(sec.id, Number(e.target.value))}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700"
                  >
                    <option value={2}>২ টি</option>
                    <option value={3}>৩ টি</option>
                    <option value={4}>৪ টি</option>
                    <option value={6}>৬ টি</option>
                    <option value={8}>৮ টি</option>
                  </select>
                </div>
              </div>
            )}

            {/* Right Move & Visibility Actions */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveSection(idx, 'up')}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-30 rounded-xl text-slate-700 dark:text-slate-300"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={idx === sections.length - 1}
                onClick={() => moveSection(idx, 'down')}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 disabled:opacity-30 rounded-xl text-slate-700 dark:text-slate-300"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleVisibility(sec.id)}
                className={`p-2 rounded-xl text-xs font-semibold ${
                  sec.isVisible ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' : 'bg-slate-200 text-slate-500 dark:bg-slate-800'
                }`}
                title="Toggle Visibility"
              >
                {sec.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
