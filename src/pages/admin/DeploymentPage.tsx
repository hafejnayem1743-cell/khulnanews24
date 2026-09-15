import React from 'react';
import { 
  Rocket, CheckCircle2, ShieldCheck, 
  Terminal, Globe, Copy, Check, ExternalLink, History 
} from 'lucide-react';
import { VERSION_HISTORY } from '../../config/constants';
import { useNews } from '../../context/NewsContext';

export const DeploymentPage: React.FC = () => {
  const { showToast } = useNews();
  const [copied, setCopied] = React.useState(false);

  const netlifyConfigText = `[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const handleCopyNetlify = () => {
    navigator.clipboard.writeText(netlifyConfigText);
    setCopied(true);
    showToast('Netlify রিডাইরেক্ট কনফিগারেশন কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const checklist = [
    { title: 'প্রোডাকশন বিল্ড টেস্ট', desc: 'npm run build কমান্ড নির্বিঘ্নে সংকলন সম্পন্ন করে', status: true },
    { title: 'সিঙ্গল পেজ অ্যাপ্লিকেশন রিডাইরেক্ট', desc: 'public/_redirects এবং netlify.toml কনফিগারেশন সংযুক্ত', status: true },
    { title: 'নিরাপদ ক্লায়েন্ট-সাইড হ্যাশ অথেনটিকেশন', desc: 'SHA-256 ক্রিপ্টোগ্রাফিক হ্যাশিংয়ের মাধ্যমে পাসওয়ার্ড সংরক্ষিত', status: true },
    { title: 'এসইও মেটাডাটা ও ওপেন গ্রাফ', desc: 'স্বয়ংক্রিয় ওপেন গ্রাফ ও Schema.org NewsArticle মেটাডাটা কার্যকর', status: true },
    { title: 'Adsterra ও অ্যাডভার্টাইজিং স্লট', desc: 'সবগুলো অ্যাড প্লেসমেন্টে স্ক্রিপ্ট ও ব্যানার রেন্ডারিং সক্রিয়', status: true },
    { title: 'ডার্ক ও লাইট থিম সুসংহতকরণ', desc: 'গ্লোবাল সিএসএস ভেরিয়েবল ও ইনস্ট্যান্ট লোকালস্টোরেজ লোডিং', status: true },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-red-600" />
          প্রোডাকশন ডেপ্লয়মেন্ট ও রিলিজ গাইড
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Netlify, Vercel বা Cloudflare Pages-এ সহজে লাইভ ডেপ্লয়মেন্টের নির্দেশিকা ও ভার্সন হিস্ট্রি
        </p>
      </div>

      {/* Deployment Ready Card */}
      <div className="bg-emerald-50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <div>
            <h2 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
              প্রোডাকশন বিল্ড সম্পূর্ণ প্রস্তুত (Production Ready)
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
              সমস্ত রাউটিং, টাইপস্ক্রিপ্ট ইন্টারফেস ও স্টোরেজ ইঞ্জিন স্ট্যান্ডার্ড অনুসরণ করে তৈরি।
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ডেপ্লয়মেন্ট প্রস্তুতি চেকলিস্ট</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {checklist.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Netlify Config snippet */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-red-600" />
            <span>Netlify / SPA Redirects Configuration</span>
          </h2>
          <button
            onClick={handleCopyNetlify}
            className="flex items-center gap-1 text-xs text-red-600 font-bold hover:underline"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
          {netlifyConfigText}
        </pre>
        <p className="text-[11px] text-slate-500">
          প্রকল্পের মূল ফোল্ডারে `netlify.toml` এবং `public/_redirects` ফাইলগুলো অন্তর্ভুক্ত রয়েছে।
        </p>
      </div>

      {/* Version Change Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          <span>রিলিজ ও ভার্সন ইতিহাস (Version History)</span>
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">v1.1.0-PREMIUM</span>
              <span className="text-xs text-slate-400">২০২৬-০৯-০২</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2">
              Clean Editorial UI Redesign, Top Micro-bar (No Fake Socials), Cryptographic Salted SHA-256 Auth, Rich Text Auto-Save Editor, Category Expansion & Complete Admin Management Suite
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-600 text-white">v1.0.0-STABLE</span>
              <span className="text-xs text-slate-400">২০২৬-০৯-০১</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
              Initial Release with Bangla News CMS, Breaking News Marquee, Dynamic Category Routing, and Full Adsterra Slots
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
