import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { SeoHead } from '../../components/common/SeoHead';
import { NewsCard } from '../../components/common/NewsCard';
import { ShieldCheck, FileText, Info, Phone, Mail, Megaphone, MessageCircle, ExternalLink } from 'lucide-react';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const { tag } = useParams<{ tag?: string }>();
  const { siteSettings, news } = useNews();

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

  // 2. CONTACT / ADVERTISING PAGE
  if (location.pathname === '/contact') {
    const cleanPhone = (siteSettings.phone || '').replace(/[^0-9]/g, '');
    const cleanWhatsApp = (siteSettings.whatsapp || '').replace(/[^0-9]/g, '');
    const phoneLink = cleanPhone ? `tel:${cleanPhone.startsWith('88') ? `+${cleanPhone}` : `+88${cleanPhone.replace(/^0/, '0')}`}` : '#';
    const whatsappLink = cleanWhatsApp ? `https://wa.me/${cleanWhatsApp.startsWith('88') ? cleanWhatsApp : `88${cleanWhatsApp}`}` : '#';
    const emailLink = siteSettings.email?.trim() ? `mailto:${siteSettings.email.trim()}` : '#';

    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F172A]">
        <SeoHead title="বিজ্ঞাপন দিতে যোগাযোগ করুন" description="খুলনা নিউজ ২৪-এ বিজ্ঞাপন, স্পন্সরশিপ ও ব্যবসায়িক যোগাযোগের জন্য সরাসরি যোগাযোগ করুন।" />

        <div className="max-w-5xl mx-auto px-3 sm:px-5 py-5 sm:py-8 md:py-12">
          <div className="mb-4 sm:mb-6 flex justify-center overflow-hidden">
            <AdsterraSlot position="HOMEPAGE_TOP" />
          </div>

          <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            <div className="px-4 sm:px-8 md:px-12 py-7 sm:py-10 md:py-12 text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/50">
                <Megaphone className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-red-600 dark:text-red-400">Khulna News 24 • Advertisement</p>
              <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                বিজ্ঞাপন দিতে যোগাযোগ করুন
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm md:text-base leading-7 text-slate-600 dark:text-slate-300">
                বিজ্ঞাপন, স্পন্সরশিপ, ব্যবসায়িক প্রচার বা রেটকার্ডের তথ্য জানতে নিচের যেকোনো একটি মাধ্যম বেছে নিন। যোগাযোগের তথ্য স্ক্রিনে দেখানো হচ্ছে না—শুধু বোতামে ক্লিক করলেই সরাসরি সংশ্লিষ্ট মাধ্যমে পৌঁছে যাবেন।
              </p>

              <div className="mx-auto mt-5 sm:mt-7 max-w-2xl rounded-xl sm:rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/20 px-3.5 sm:px-5 py-3.5 sm:py-4 text-left">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <Info className="mt-0.5 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-[11px] sm:text-xs md:text-sm leading-6 text-amber-900 dark:text-amber-200">
                    <strong>নির্দেশনা:</strong> বিজ্ঞাপন সংক্রান্ত বিষয়ে যোগাযোগের সময় আপনার প্রতিষ্ঠান/ব্র্যান্ডের নাম, বিজ্ঞাপনের ধরন এবং প্রয়োজনীয় সময়কাল সংক্ষেপে জানালে দ্রুত সাড়া দেওয়া সহজ হবে।
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
                <a href={phoneLink} id="advertising-contact-phone" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-white hover:shadow-md dark:hover:border-red-900 dark:hover:bg-slate-800" aria-label="ফোনে সরাসরি যোগাযোগ করুন">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400"><Phone className="h-5 w-5" /></div>
                  <h2 className="mt-3 text-sm sm:text-base font-black text-slate-900 dark:text-white">ফোনে যোগাযোগ</h2>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">সরাসরি কল করতে ক্লিক করুন</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-red-600 dark:text-red-400">কল করুন <ExternalLink className="h-3.5 w-3.5" /></span>
                </a>

                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" id="advertising-contact-whatsapp" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-md dark:hover:border-emerald-900 dark:hover:bg-slate-800" aria-label="হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করুন">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"><MessageCircle className="h-5 w-5" /></div>
                  <h2 className="mt-3 text-sm sm:text-base font-black text-slate-900 dark:text-white">WhatsApp</h2>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">চ্যাট শুরু করতে ক্লিক করুন</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400">মেসেজ করুন <ExternalLink className="h-3.5 w-3.5" /></span>
                </a>

                <a href={emailLink} id="advertising-contact-email" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md dark:hover:border-blue-900 dark:hover:bg-slate-800" aria-label="ইমেইলে সরাসরি যোগাযোগ করুন">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"><Mail className="h-5 w-5" /></div>
                  <h2 className="mt-3 text-sm sm:text-base font-black text-slate-900 dark:text-white">ইমেইল</h2>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">ইমেইল পাঠাতে ক্লিক করুন</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400">ইমেইল করুন <ExternalLink className="h-3.5 w-3.5" /></span>
                </a>
              </div>
            </div>
          </section>

          <div className="mt-5 sm:mt-7 flex justify-center overflow-hidden">
            <AdsterraSlot position="HOMEPAGE_MIDDLE" />
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
