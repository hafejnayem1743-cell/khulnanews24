import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { KhulnaDistrict, AutoNewsCollectorSource, AutoNewsSettings, NewsItem } from '../../types';
import { formatBanglaDate, toBanglaNumber } from '../../services/seo';
import { fetchWorkerNews, mapWorkerItemToNewsItem } from '../../services/newsApi';
import { 
  Rss, Bot, Play, CheckCircle2, AlertCircle, RefreshCw, 
  Settings, Globe, MapPin, Plus, Trash2, Edit, ExternalLink, 
  Check, Power, ShieldCheck, Server, Clock, Sliders, Eye
} from 'lucide-react';

const KHULNA_DISTRICTS_DATA: { key: KhulnaDistrict; label: string; en: string }[] = [
  { key: 'Khulna', label: 'খুলনা', en: 'Khulna' },
  { key: 'Bagerhat', label: 'বাগেরহাট', en: 'Bagerhat' },
  { key: 'Satkhira', label: 'সাতক্ষীরা', en: 'Satkhira' },
  { key: 'Jashore', label: 'যশোর', en: 'Jashore' },
  { key: 'Narail', label: 'নড়াইল', en: 'Narail' },
  { key: 'Jhenaidah', label: 'ঝিনাইদহ', en: 'Jhenaidah' },
  { key: 'Magura', label: 'মাগুরা', en: 'Magura' },
  { key: 'Kushtia', label: 'কুষ্টিয়া', en: 'Kushtia' },
  { key: 'Chuadanga', label: 'চুয়াডাঙ্গা', en: 'Chuadanga' },
  { key: 'Meherpur', label: 'মেহেরপুর', en: 'Meherpur' },
];

export const AutoNewsManager: React.FC = () => {
  const { 
    autoNewsSettings, 
    saveAutoNewsSettings, 
    triggerAutoNewsCollection, 
    isCollectingNews, 
    news, 
    deleteNews, 
    showToast 
  } = useNews();

  const [settingsForm, setSettingsForm] = useState<AutoNewsSettings>({ ...autoNewsSettings });
  const [newSourceModalOpen, setNewSourceModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceType, setNewSourceType] = useState<'rss' | 'api'>('rss');
  const [testResult, setTestResult] = useState<{ message: string; ok: boolean } | null>(null);
  const [isTestingWorker, setIsTestingWorker] = useState(false);
  const [workerNews, setWorkerNews] = useState<NewsItem[]>([]);
  const [workerStoredCount, setWorkerStoredCount] = useState(0);
  const [workerDistrictCounts, setWorkerDistrictCounts] = useState<Record<string, number>>({});

  const loadWorkerStats = async () => {
    try {
      const res = await fetchWorkerNews({ limit: 5000, timeoutMs: 20000 });
      if (res.ok && Array.isArray(res.news)) {
        const mapped = res.news
          .filter(item => Boolean(item && (item.title || item.headline) && (item.url || item.link)))
          .map(item => ({ ...mapWorkerItemToNewsItem(item), isAutoCollected: true }));
        setWorkerNews(mapped);
        setWorkerStoredCount(Number(res.totalStored || res.count || mapped.length));
        const counts: Record<string, number> = {};
        mapped.forEach(item => {
          const key = String(item.district || '');
          if (key) counts[key] = (counts[key] || 0) + 1;
        });
        setWorkerDistrictCounts(counts);
      }
    } catch (error) {
      console.warn('Worker stats sync failed:', error);
    }
  };

  useEffect(() => {
    loadWorkerStats();
    const timer = setInterval(loadWorkerStats, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter auto-collected news
  const autoCollectedNews = (workerNews.length ? workerNews : news.filter(n => n.isAutoCollected))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const handleToggleDistrict = (dist: KhulnaDistrict) => {
    const current = settingsForm.targetDistricts || [];
    const exists = current.includes(dist);
    const updated = exists ? current.filter(d => d !== dist) : [...current, dist];
    const newSettings = { ...settingsForm, targetDistricts: updated };
    setSettingsForm(newSettings);
    saveAutoNewsSettings(newSettings);
  };

  const handleToggleSystem = () => {
    const newSettings = { ...settingsForm, isEnabled: !settingsForm.isEnabled };
    setSettingsForm(newSettings);
    saveAutoNewsSettings(newSettings);
  };

  const handleSaveSettings = () => {
    saveAutoNewsSettings(settingsForm);
  };

  const handleToggleSource = (sourceId: string) => {
    const updatedSources = (settingsForm.sources || []).map(s => 
      s.id === sourceId ? { ...s, isEnabled: !s.isEnabled } : s
    );
    const newSettings = { ...settingsForm, sources: updatedSources };
    setSettingsForm(newSettings);
    saveAutoNewsSettings(newSettings);
  };

  const handleDeleteSource = (sourceId: string) => {
    const updatedSources = (settingsForm.sources || []).filter(s => s.id !== sourceId);
    const newSettings = { ...settingsForm, sources: updatedSources };
    setSettingsForm(newSettings);
    saveAutoNewsSettings(newSettings);
    showToast('সোর্স অপসারিত হয়েছে।', 'info');
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceUrl.trim()) {
      showToast('নাম এবং ফিড ইউআরএল উভয়ই পূরণ করুন।', 'error');
      return;
    }

    const newSource: AutoNewsCollectorSource = {
      id: `src-${Date.now()}`,
      name: newSourceName.trim(),
      url: newSourceUrl.trim(),
      type: 'rss',
      isEnabled: true
    };

    const newSettings = {
      ...settingsForm,
      sources: [...(settingsForm.sources || []), newSource]
    };

    setSettingsForm(newSettings);
    saveAutoNewsSettings(newSettings);
    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceModalOpen(false);
    showToast('নতুন সংবাদ সোর্স যুক্ত হয়েছে!', 'success');
  };

  const handleTestWorker = async () => {
    if (!settingsForm.cloudflareWorkerUrl) {
      setTestResult({ message: 'দয়া করে Cloudflare Worker URL প্রদান করুন।', ok: false });
      return;
    }

    setIsTestingWorker(true);
    setTestResult(null);

    try {
      const configured = settingsForm.cloudflareWorkerUrl.trim().replace(/\/+$/, '');
      const baseUrl = configured.replace(/\/api\/(news|health|collect)(?:\/.*)?$/i, '');
      const endpoint = `${baseUrl}/api/health`;
      const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          message: `Worker সক্রিয় রয়েছে! (HTTP ${res.status} • ${data.totalStored ?? 0}টি সংবাদ)`,
          ok: true
        });
      } else {
        setTestResult({
          message: `Worker থেকে রেসপন্স কোড: ${res.status}`,
          ok: false
        });
      }
    } catch (err: any) {
      setTestResult({
        message: `সংযোগ ব্যর্থ: ${err.message || 'Worker-এ পৌঁছানো যায়নি'}`,
        ok: false
      });
    } finally {
      setIsTestingWorker(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & MAIN TOGGLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                অটো নিউজ কালেক্টর
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  settingsForm.isEnabled 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {settingsForm.isEnabled ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Disabled)'}
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                খুলনা বিভাগের ১০টি জেলার সংবাদ বিশ্বস্ত আরএসএস ও উন্মুক্ত ফিড থেকে স্বয়ংক্রিয়ভাবে সংগ্রহ ও সংরক্ষণ করুন
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleSystem}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              settingsForm.isEnabled
                ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            {settingsForm.isEnabled ? 'সিস্টেম বন্ধ করুন' : 'সিস্টেম চালু করুন'}
          </button>

          <button
            onClick={async () => { await triggerAutoNewsCollection(); await loadWorkerStats(); }}
            disabled={isCollectingNews}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-xs flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isCollectingNews ? 'animate-spin' : ''}`} />
            {isCollectingNews ? 'খবর সংগ্রহ চলছে...' : 'এখনই সংগ্রহ করুন (Collect Now)'}
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">মোট স্বয়ংক্রিয় সংবাদ</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {toBanglaNumber(autoCollectedNews.length)} টি
          </div>
          <span className="text-[11px] text-indigo-500 mt-1 block">১০টি জেলার আওতাধীন</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Worker-এ সংরক্ষিত হিস্টোরি</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {toBanglaNumber(workerStoredCount || settingsForm.totalCollected || 0)} টি
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">ডুপ্লিকেট স্বয়ংক্রিয়ভাবে ফিল্টার্ড</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">সক্রিয় সোর্স সংখ্যা</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {toBanglaNumber((settingsForm.sources || []).filter(s => s.isEnabled).length)} টি
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            মোট {(settingsForm.sources || []).length} টির মধ্যে
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">সর্বশেষ সংগ্রহের সময়</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2 truncate">
            {settingsForm.lastRunTime ? formatBanglaDate(settingsForm.lastRunTime) : 'এখনও সংগ্রহ করা হয়নি'}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            প্রতি {toBanglaNumber(settingsForm.intervalMinutes || 30)} মিনিট পর পর
          </span>
        </div>
      </div>

      {/* 3. 10 KHULNA DISTRICTS SELECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              খুলনা বিভাগের ১০টি জেলার টার্গেট নির্বাচন
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যে জেলাগুলোর খবর আপনি সংগ্রহ করতে চান সেগুলোতে টিক চিহ্ন দিন
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            নির্বাচিত জেলা: <span className="text-red-600 font-bold">{toBanglaNumber((settingsForm.targetDistricts || []).length)}/১০</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {KHULNA_DISTRICTS_DATA.map(item => {
            const isSelected = (settingsForm.targetDistricts || []).includes(item.key);
            const districtNewsCount = workerDistrictCounts[item.key] || news.filter(n => n.district === item.key).length;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleToggleDistrict(item.key)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-sm">{item.label}</span>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-red-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{item.en}</span>
                  <span className="font-semibold text-red-500">{toBanglaNumber(districtNewsCount)} সংবাদ</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. CONFIGURATION SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Automation Behavior */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">সংগ্রহ ও প্রকাশনা সেটিংস</h2>
          </div>

          <div className="space-y-4">
            {/* Auto Publish Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                সংগ্রহের পর সংবাদের স্ট্যাটাস
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, autoPublish: true })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    settingsForm.autoPublish
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>সরাসরি প্রকাশ (Auto-Publish)</span>
                  </div>
                  <p className="text-[10px] font-normal text-slate-500">
                    সংগ্রহ করার সাথে সাথে ওয়েবসাইটে লাইভ হয়ে যাবে
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, autoPublish: false })}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                    !settingsForm.autoPublish
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Edit className="w-3.5 h-3.5 text-amber-500" />
                    <span>খসড়া হিসেবে জমা (Draft Mode)</span>
                  </div>
                  <p className="text-[10px] font-normal text-slate-500">
                    অ্যাডমিন যাচাই করে ম্যানুয়ালি অনুমোদন দেবেন
                  </p>
                </button>
              </div>
            </div>

            {/* Interval */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>সংগ্রহের ব্যবধান (Frequency)</span>
                <span className="text-indigo-600 font-bold">{toBanglaNumber(settingsForm.intervalMinutes || 30)} মিনিট</span>
              </label>
              <select
                value={settingsForm.intervalMinutes || 30}
                onChange={(e) => setSettingsForm({ ...settingsForm, intervalMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value={5}>প্রতি ৫ মিনিট পর পর</option>
                <option value={10}>প্রতি ১০ মিনিট পর পর</option>
                <option value={15}>প্রতি ১৫ মিনিট পর পর</option>
                <option value={30}>প্রতি ৩০ মিনিট পর পর (প্রস্তাবিত)</option>
                <option value={60}>প্রতি ১ ঘণ্টা পর পর</option>
              </select>
            </div>

            {/* Max Items per Run */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                একবারে সর্বোচ্চ কয়টি নতুন সংবাদ নেবে
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={settingsForm.maxItemsPerRun || 20}
                onChange={(e) => setSettingsForm({ ...settingsForm, maxItemsPerRun: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>

        {/* Right: Cloudflare Worker Integration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Cloudflare Worker (Free-Tier)</h2>
            </div>
            <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">
              100% Free
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ব্যাকগ্রাউন্ড ক্রন শিডিউলারের মাধ্যমে স্বয়ংক্রিয়ভাবে ২৪/৭ ফিড স্ক্র্যাপ ও আরএসএস রিসিভ করতে Cloudflare Worker যুক্ত করতে পারেন।
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Cloudflare Worker URL
              </label>
              <input
                type="url"
                placeholder="https://khulna-news-collector.your-subdomain.workers.dev"
                value={settingsForm.cloudflareWorkerUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, cloudflareWorkerUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleTestWorker}
                disabled={isTestingWorker}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingWorker ? 'animate-spin' : ''}`} />
                কানেকশন টেস্ট করুন
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                সংরক্ষণ
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.ok 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                {testResult.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">💡 ডেপ্লয়মেন্ট গাইড:</span>
              <p>প্রজেক্ট রুটে প্রস্তুতকৃত <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">/cloudflare-worker</code> ডিরেক্টরি রয়েছে। সেখানে শুধু <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[10px]">npx wrangler deploy</code> করলেই আপনার ফ্রি ওয়ার্কার তৈরি হয়ে যাবে!</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ACTIVE SOURCES MANAGEMENT */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Rss className="w-4 h-4 text-orange-500" />
              সংবাদ সোর্স ও আরএসএস ফিড সমূহ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যে যে উন্মুক্ত জাতীয় ও আঞ্চলিক মিডিয়া থেকে খুলনা বিভাগের খবর সংগ্রহ করা হবে
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewSourceModalOpen(true)}
            className="px-3.5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            নতুন সোর্স যোগ করুন
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(settingsForm.sources || []).map(source => (
            <div
              key={source.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                source.isEnabled
                  ? 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {source.name}
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {source.type}
                  </span>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-slate-400 hover:text-blue-500 truncate block mt-1"
                >
                  {source.url}
                </a>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleSource(source.id)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    source.isEnabled
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-800'
                      : 'bg-slate-100 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                  title={source.isEnabled ? 'সোর্স বন্ধ করুন' : 'সোর্স চালু করুন'}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteSource(source.id)}
                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 dark:bg-red-950/40 transition-colors"
                  title="সোর্স মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. AUTO-COLLECTED RECENT NEWS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-500" />
              সংগৃহীত স্বয়ংক্রিয় সংবাদ তালিকা ({toBanglaNumber(autoCollectedNews.length)})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              অটো নিউজ সিস্টেম দ্বারা সংরক্ষিত খবরগুলো ম্যানুয়ালি এডিট বা ডিলিট করতে পারবেন
            </p>
          </div>

          <Link
            to="/admin/news"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>সকল সংবাদ পেজে দেখুন</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">শিরোনাম ও ছবি</th>
                <th className="p-3">জেলা</th>
                <th className="p-3">সোর্স মিডিয়া</th>
                <th className="p-3">ক্যাটাগরি</th>
                <th className="p-3">স্ট্যাটাস</th>
                <th className="p-3">তারিখ ও সময়</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {autoCollectedNews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    এখনও কোনো স্বয়ংক্রিয় সংবাদ সংগ্রহ করা হয়নি। উপরের "এখনই সংগ্রহ করুন" বাটনে ক্লিক করুন।
                  </td>
                </tr>
              ) : (
                autoCollectedNews.slice(0, 15).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.featuredImage}
                          alt=""
                          className="w-12 h-8 object-cover rounded-md bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0 max-w-sm">
                          <Link
                            to={`/news/${item.slug}`}
                            target="_blank"
                            className="font-bold text-slate-900 dark:text-white hover:text-red-600 transition-colors line-clamp-1 flex items-center gap-1"
                          >
                            {item.title}
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      {item.district ? (
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {item.district}
                        </span>
                      ) : (
                        <span className="text-slate-400">খুলনা</span>
                      )}
                    </td>

                    <td className="p-3">
                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>{item.sourceName || 'সোর্স লিংক'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span>{item.sourceName || 'RSS'}</span>
                      )}
                    </td>

                    <td className="p-3 font-semibold">{item.categoryName}</td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'published' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      }`}>
                        {item.status === 'published' ? 'প্রকাশিত' : 'ড্রাফট'}
                      </span>
                    </td>

                    <td className="p-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {formatBanglaDate(item.publishedAt)}
                    </td>

                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/news/edit/${item.id}`}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('সংবাদটি মুছে ফেলতে চান?')) {
                              deleteNews(item.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
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

      {/* 7. MODAL: ADD NEW FEED SOURCE */}
      {newSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              নতুন সংবাদ সোর্স / আরএসএস যোগ করুন
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              যেকোনো বৈধ আরএসএস ফিড বা উন্মুক্ত নিউজ ফিড ইউআরএল দিন
            </p>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  সংবাদ মাধ্যমের নাম (যেমন: দৈনিক ইত্তেফাক)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রথম আলো খুলনা"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  আরএসএস ফিড ইউআরএল (RSS Feed URL)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/rss/khulna.xml"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNewSourceModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
