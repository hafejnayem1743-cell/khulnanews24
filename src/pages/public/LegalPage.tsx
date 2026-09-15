import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { SeoHead } from '../../components/common/SeoHead';
import { NewsCard } from '../../components/common/NewsCard';
import { MapPin, Phone, Mail, Send, CheckCircle2, ShieldCheck, FileText, Info } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const { tag } = useParams<{ tag?: string }>();
  const { siteSettings, news, showToast } = useNews();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    setContactSent(true);
    showToast('আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।', 'success');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
  };

  // 1. TAG PAGE
  if (location.pathname.startsWith('/tag') && tag) {
    const decodedTag = decodeURIComponent(tag);
    const taggedNews = news.filter(n => n.status === 'published' && n.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase()));

    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 min-h-screen">
        <SeoHead title={`ট্যাগ: #${decodedTag}`} description={`#${decodedTag} ট্যাগযুক্ত সকল সংবাদ ও প্রতিবেদন।`} />
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 border-b-2 border-red-600 pb-2.5 sm:pb-3">
          ট্যাগ: <span className="text-red-600">#{decodedTag}</span> ({taggedNews.length})
        </h1>
        {taggedNews.length === 0 ? (
          <p className="text-slate-500 text-sm">এই ট্যাগে কোনো খবর পাওয়া যায়নি।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {taggedNews.map(n => <NewsCard key={n.id} news={n} variant="grid" />)}
          </div>
        )}
      </div>
    );
  }

  // 2. CONTACT US PAGE
  if (location.pathname === '/contact') {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 min-h-screen">
        <SeoHead title="যোগাযোগ ও বিজ্ঞাপন" description="খুলনা নিউজ কর্তৃপক্ষের সাথে যোগাযোগ করুন ও বিজ্ঞাপনের তথ্যাবলি জানুন।" />
        
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3">যোগাযোগ ও বিজ্ঞাপন</h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            সংবাদ সংক্রান্ত মতামত, তথ্য বা বিজ্ঞাপনের যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10">
          {/* Info Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white border-l-4 border-red-600 pl-3">
              অফিস ঠিকানা ও যোগাযোগ
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {siteSettings.address && !siteSettings.address.includes('প্রেসক্লাব ভবন') && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white">প্রধান কার্যালয়:</strong>
                    <span>{siteSettings.address}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">ফোন ও হটলাইন:</strong>
                  <a 
                    href={`tel:+88${(siteSettings.phone || '01306721743').replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`} 
                    className="hover:text-red-600 dark:hover:text-red-400 font-mono font-bold"
                  >
                    {siteSettings.phone || '01306721743'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.183 8.183 0 0 1-5.83 2.41c-1.47 0-2.93-.39-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.25-4.39c0-4.54 3.7-8.24 8.26-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z"/>
                </svg>
                <div>
                  <strong className="block text-slate-900 dark:text-white">হোয়াটসঅ্যাপ:</strong>
                  <a 
                    href={`https://wa.me/88${(siteSettings.whatsapp || '01907655994').replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-mono font-bold"
                  >
                    {siteSettings.whatsapp || '01907655994'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">অফিশিয়াল ইমেইল:</strong>
                  <a 
                    href={`mailto:${(siteSettings.email || 'worldbusiness677@gmail.com').trim()}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-mono font-bold break-all"
                  >
                    {siteSettings.email || 'worldbusiness677@gmail.com'}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 mb-1.5">বিজ্ঞাপন ও বাণিজ্যিক যোগাযোগ</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                অনলাইন পোর্টাল এবং সামাজিক যোগাযোগ মাধ্যমে ডিজিটাল বিজ্ঞাপনের রেটকার্ড ও স্পনসরশিপের জন্য সরাসরি ফোন, হোয়াটসঅ্যাপ অথবা ইমেইল করুন।
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">
              আমাদের একটি বার্তা পাঠান
            </h3>

            {contactSent && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3.5 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="নাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল এড্রেস *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">বিষয়</label>
                <input
                  type="text"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="বার্তার বিষয়"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">বার্তা বা তথ্য *</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" /> বার্তা পাঠান
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 3. ABOUT US PAGE
  if (location.pathname === '/about') {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12 min-h-screen">
        <SeoHead title="আমাদের সম্পর্কে" description="খুলনা নিউজের লক্ষ্য, উদ্দেশ্য ও সম্পাদকীয় মূল্যবোধ।" />
        <article className="bg-white dark:bg-slate-900 p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white border-b-2 border-red-600 pb-3">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>‘খুলনা নিউজ’ (KHULNA NEWS)</strong> দক্ষিণ-পশ্চিমাঞ্চল ও সমগ্র বাংলাদেশের অগ্রণী ডিজিটাল সংবাদমাধ্যম। খুলনা বিভাগের সকল জেলা-উপজেলা, রূপসা-ভৈরব নদী অববাহিকা, মংলা বন্দর, সুন্দরবন এবং জাতীয় ও আন্তর্জাতিক পরিমণ্ডলের নিরপেক্ষ ও তাৎক্ষণিক সংবাদ পরিবেশনই আমাদের মূল লক্ষ্য।
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-2 sm:pt-4">আমাদের মিশন ও ভিশন</h2>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <li>নিরপেক্ষ, নির্ভুল এবং বস্তুনিষ্ঠ সাংবাদিকতার নীতি অনুসরণ করা।</li>
            <li>খুলনা অঞ্চলের মানুষের অধিকার, উন্নয়ন, কৃষি, বাণিজ্য ও সম্ভাবনার কথা জাতীয় ও আন্তর্জাতিক স্তরে তুলে ধরা।</li>
            <li>গুজব ও বিভ্রান্তিকর তথ্যের বিরুদ্ধে তথ্যের সত্যতা যাচাই করে দ্রুত সঠিক খবর প্রচার করা।</li>
          </ul>
        </article>
      </div>
    );
  }

  // 4. EDITORIAL POLICY / PRIVACY / TERMS
  const isPrivacy = location.pathname === '/privacy';
  const isTerms = location.pathname === '/terms';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-12 min-h-screen">
      <SeoHead 
        title={isPrivacy ? "গোপনীয়তা নীতি" : isTerms ? "ব্যবহারের শর্তাবলি" : "সম্পাদকীয় নীতি ও আচরণবিধি"} 
      />
      <article className="bg-white dark:bg-slate-900 p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white border-b-2 border-red-600 pb-3">
          {isPrivacy ? "গোপনীয়তা নীতি (Privacy Policy)" : isTerms ? "ব্যবহারের শর্তাবলি (Terms & Conditions)" : "সম্পাদকীয় নীতি ও আচরণবিধি"}
        </h1>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 sm:space-y-4">
          <p>
            খুলনা নিউজ সর্বদা গণমাধ্যমের সর্বোচ্চ পেশাদারিত্ব ও নৈতিক আচরণবিধি কঠোরভাবে মেনে চলে। পাঠকদের তথ্যের নিরাপত্তা নিশ্চিত করা আমাদের অঙ্গীকার।
          </p>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">১. তথ্যের যথার্থতা ও নিরপেক্ষতা</h3>
          <p>
            প্রতিটি সংবাদের সত্যতা একাধিক নির্ভরযোগ্য উৎস থেকে যাচাই করে প্রকাশ করা হয়। কোনো অসাবধানতাবশত ভুল হলে অবিলম্বে তা সংশোধন করে নোটিশ দেওয়া হয়।
          </p>
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">২. কপিরাইট ও পুনঃপ্রকাশ</h3>
          <p>
            খুলনা নিউজের সমস্ত লেখা, অডিও, ভিডিও এবং ছবি কপিরাইট আইনের আওতাধীন। লিখিত অনুমতি ব্যতীত বাণিজ্যিক উদ্দেশ্যে ব্যবহার নিষিদ্ধ।
          </p>
        </div>
      </article>
    </div>
  );
};
