import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdSlot, AdPosition } from '../../types';
import { 
  DollarSign, Code, Monitor, Smartphone, 
  CheckCircle2, AlertCircle, Eye, EyeOff, Save, Sparkles 
} from 'lucide-react';

export const AdsterraManager: React.FC = () => {
  const { adSlots, updateAdSlot, showToast } = useNews();
  const [selectedSlotId, setSelectedSlotId] = useState<string>(adSlots[0]?.id || '');

  const currentSlot = adSlots.find(s => s.id === selectedSlotId) || adSlots[0];

  const [name, setName] = useState(currentSlot?.name || '');
  const [adCode, setAdCode] = useState(currentSlot?.adCode || '');
  const [mobileCode, setMobileCode] = useState(currentSlot?.mobileCode || '');
  const [isActive, setIsActive] = useState(currentSlot?.isActive ?? true);

  const handleSlotSelect = (slot: AdSlot) => {
    setSelectedSlotId(slot.id);
    setName(slot.name);
    setAdCode(slot.adCode);
    setMobileCode(slot.mobileCode || '');
    setIsActive(slot.isActive);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSlot) return;

    const updated: AdSlot = {
      ...currentSlot,
      name,
      adCode,
      mobileCode: mobileCode.trim() || undefined,
      isActive
    };

    updateAdSlot(updated);
    showToast(`"${name}" স্লটের বিজ্ঞাপন কোড সফলভাবে সংরক্ষিত হয়েছে!`, 'success');
  };

  const handleInsertAdsterraDemo = (format: 'banner_728' | 'banner_300' | 'native') => {
    if (format === 'banner_728') {
      setAdCode(
        `<div style="width:100%;max-width:728px;height:90px;background:linear-gradient(135deg,#1e293b,#0f172a);color:#38bdf8;display:flex;align-items:center;justify-content:center;font-family:sans-serif;font-size:13px;font-weight:bold;border-radius:8px;border:1px dashed #38bdf8;margin:auto;">
  📢 Adsterra Leaderboard Banner (728x90) • Sponsored Advertisement
</div>`
      );
    } else if (format === 'banner_300') {
      setAdCode(
        `<div style="width:300px;height:250px;background:linear-gradient(135deg,#1e293b,#0f172a);color:#f59e0b;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;font-size:13px;font-weight:bold;border-radius:8px;border:1px dashed #f59e0b;margin:auto;text-align:center;padding:12px;">
  📢 Adsterra Medium Rectangle (300x250)<br/><span style="font-size:11px;color:#94a3b8;margin-top:6px;">High CTR Sidebar Ad Slot</span>
</div>`
      );
    } else {
      setAdCode(
        `<div style="width:100%;padding:16px;background:linear-gradient(135deg,#f8fafc,#f1f5f9);color:#0f172a;display:flex;align-items:center;justify-content:space-between;border-radius:10px;border:1px solid #cbd5e1;margin:auto;">
  <div><strong style="color:#dc2626;">Adsterra Native Ad:</strong> খুলনা ও দক্ষিণবঙ্গের সেরা অফার জানুন এখনই!</div>
  <button style="padding:6px 14px;background:#dc2626;color:#fff;border:none;border-radius:6px;font-weight:bold;font-size:11px;cursor:pointer;">ক্লিক করুন</button>
</div>`
      );
    }
    showToast('Adsterra ডেমো কোড যুক্ত হয়েছে! সংরক্ষণ করতে সেভ চাপুন।', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          Adsterra ও ডিজিটাল বিজ্ঞাপন ম্যানেজার
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ওয়েবসাইটের প্রতিটি সেকশনের বিজ্ঞাপন কোড (Adsterra / Google AdSense / কাস্টম ব্যানার) নিয়ন্ত্রণ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols): Ad Slot Selector */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">বিজ্ঞাপন স্লটসমূহ</h3>
          <div className="space-y-1.5">
            {adSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedSlotId === slot.id 
                    ? 'bg-white dark:bg-slate-900 border-red-500 shadow-md ring-1 ring-red-500' 
                    : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{slot.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{slot.position}</span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${slot.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (8 cols): Slot Configuration & Code Editor */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentSlot?.name}</h2>
              <span className="text-xs text-slate-400 font-mono">পজিশন: {currentSlot?.position}</span>
            </div>

            {/* Quick Templates */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">টেমপ্লেট:</span>
              <button
                type="button"
                onClick={() => handleInsertAdsterraDemo('banner_728')}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-[11px] font-semibold"
              >
                728x90
              </button>
              <button
                type="button"
                onClick={() => handleInsertAdsterraDemo('banner_300')}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-[11px] font-semibold"
              >
                300x250
              </button>
              <button
                type="button"
                onClick={() => handleInsertAdsterraDemo('native')}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded text-[11px] font-semibold"
              >
                Native
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">স্লট নাম</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Desktop HTML / JS Ad Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-blue-500" />
                ডেস্কটপ বিজ্ঞাপন কোড (Desktop Adsterra / HTML / Script Code) *
              </label>
              <textarea
                rows={5}
                value={adCode}
                onChange={(e) => setAdCode(e.target.value)}
                placeholder="<!-- Adsterra 728x90 script or HTML banner here -->"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Mobile Code (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                মোবাইল স্পেসিফিক কোড (Mobile Code - ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                value={mobileCode}
                onChange={(e) => setMobileCode(e.target.value)}
                placeholder="মোবাইল স্ক্রিনের জন্য ৩২০x৫০ বা বিশেষ ব্যানার কোড (খালি রাখলে ডেস্কটপ কোড ব্যবহৃত হবে)..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none"
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
                এই বিজ্ঞাপন স্লটটি ওয়েবসাইটে সক্রিয় রাখুন (Enable Slot)
              </span>
            </label>

            {/* Ad Live Preview */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">লাইভ প্রিভিউ (Preview)</label>
              <div className="p-4 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[100px] overflow-hidden">
                {adCode ? (
                  <div dangerouslySetInnerHTML={{ __html: adCode }} />
                ) : (
                  <span className="text-xs text-slate-400">কোনো কোড নেই</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              সংরক্ষণ করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
