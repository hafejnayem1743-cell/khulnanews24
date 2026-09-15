import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { 
  Facebook, Youtube, Send, Twitter, 
  MapPin, Phone, Mail, ChevronUp, Newspaper, Shield
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteSettings, categories } = useNews();
  const { lang, labels } = useActiveLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasSocialLinks = Boolean(
    siteSettings.facebookUrl?.trim() || 
    siteSettings.youtubeUrl?.trim() || 
    siteSettings.telegramUrl?.trim() || 
    siteSettings.twitterUrl?.trim()
  );

  return (
    <footer className="bg-[#111827] text-gray-300 pt-8 sm:pt-10 pb-20 sm:pb-8 border-t border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-gray-800/80">
          {/* Column 1: Brand & About */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex flex-col text-left">
              <h2 className="text-2xl font-black text-[#D32F2F] tracking-tight">
                {siteSettings.websiteName || 'খুলনা নিউজ'}
              </h2>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.2em]">
                {siteSettings.englishBrandName || 'KHULNA NEWS'}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              {siteSettings.footerAbout || '‘খুলনা নিউজ’ দক্ষিণ-পশ্চিমাঞ্চলের সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ ডিজিটাল সংবাদ মাধ্যম।'}
            </p>
            <div className="pt-2 text-xs space-y-1 text-gray-400 border-t border-gray-800">
              <p><span className="text-gray-300 font-semibold">সম্পাদক:</span> {siteSettings.editorName}</p>
              <p><span className="text-gray-300 font-semibold">প্রকাশক:</span> {siteSettings.publisherName}</p>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-[#D32F2F] pl-2">
              {labels.categories}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.slice(0, 10).map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="hover:text-[#D32F2F] text-gray-400 transition-colors py-0.5 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]"></span>
                  {getCategoryNameByLanguage(cat, lang)}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Important Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-[#D32F2F] pl-2">
              {labels.about}
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link to="/about" className="hover:text-[#D32F2F] transition-colors">{labels.about}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#D32F2F] transition-colors">{labels.contact}</Link>
              </li>
              <li>
                <Link to="/editorial-policy" className="hover:text-[#D32F2F] transition-colors">সম্পাদকীয় নীতিমালা</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#D32F2F] transition-colors">{labels.privacy}</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#D32F2F] transition-colors">শর্তাবলি</Link>
              </li>
              <li>
                <Link to="/archive" className="hover:text-[#D32F2F] transition-colors">{labels.archive}</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#D32F2F] transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#D32F2F]" />
                  <span>{labels.cms} {labels.login}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 border-l-2 border-[#D32F2F] pl-2">
              যোগাযোগ
            </h3>
            <div className="space-y-2.5 text-xs text-gray-400">
              {siteSettings.address && !siteSettings.address.includes('প্রেসক্লাব ভবন') && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                  <span>{siteSettings.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <a 
                  href={`tel:+88${(siteSettings.phone || '01306721743').replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`} 
                  className="hover:text-white transition-colors"
                >
                  {siteSettings.phone || '01306721743'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.183 8.183 0 0 1-5.83 2.41c-1.47 0-2.93-.39-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.25-4.39c0-4.54 3.7-8.24 8.26-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z"/>
                </svg>
                <a 
                  href={`https://wa.me/88${(siteSettings.whatsapp || '01907655994').replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp: {siteSettings.whatsapp || '01907655994'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <a 
                  href={`mailto:${(siteSettings.email || 'worldbusiness677@gmail.com').trim()}`} 
                  className="hover:text-white transition-colors break-all"
                >
                  {siteSettings.email || 'worldbusiness677@gmail.com'}
                </a>
              </div>
            </div>

            {/* Render Social Icons ONLY when configured */}
            {hasSocialLinks && (
              <div className="pt-2">
                <p className="text-[11px] text-gray-400 font-semibold mb-2">সামাজিক যোগাযোগ মাধ্যম:</p>
                <div className="flex items-center gap-2">
                  {siteSettings.facebookUrl?.trim() && (
                    <a 
                      href={siteSettings.facebookUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-7 h-7 rounded bg-gray-900 border border-gray-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {siteSettings.youtubeUrl?.trim() && (
                    <a 
                      href={siteSettings.youtubeUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-7 h-7 rounded bg-gray-900 border border-gray-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                      title="YouTube"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {siteSettings.telegramUrl?.trim() && (
                    <a 
                      href={siteSettings.telegramUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-7 h-7 rounded bg-gray-900 border border-gray-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                      title="Telegram"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {siteSettings.twitterUrl?.trim() && (
                    <a 
                      href={siteSettings.twitterUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-7 h-7 rounded bg-gray-900 border border-gray-800 hover:border-red-600 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors"
                      title="Twitter / X"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Khulna Division 10 Districts SEO Crawl Section */}
        <div className="py-6 border-b border-gray-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>খুলনা বিভাগের ১০ জেলার সর্বশেষ খবর</span>
            </h3>
            <span className="text-[11px] text-gray-400">
              বস্তুনিষ্ঠ আঞ্চলিক সংবাদ ও প্রতি মুহূর্তের আপডেট
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
            <Link to="/khulna" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>খুলনা জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Khulna</span>
            </Link>
            <Link to="/bagerhat" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>বাগেরহাট জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Bagerhat</span>
            </Link>
            <Link to="/satkhira" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>সাতক্ষীরা জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Satkhira</span>
            </Link>
            <Link to="/jashore" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>যশোর জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Jashore</span>
            </Link>
            <Link to="/jhenaidah" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>ঝিনাইদহ জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Jhenaidah</span>
            </Link>
            <Link to="/magura" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>মাগুরা জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Magura</span>
            </Link>
            <Link to="/narail" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>নড়াইল জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Narail</span>
            </Link>
            <Link to="/kushtia" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>কুষ্টিয়া জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Kushtia</span>
            </Link>
            <Link to="/chuadanga" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>চুয়াডাঙ্গা জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Chuadanga</span>
            </Link>
            <Link to="/meherpur" className="px-3 py-2 rounded-lg bg-gray-900/80 hover:bg-red-950/40 text-gray-300 hover:text-white border border-gray-800 hover:border-red-600 transition-colors flex items-center justify-between">
              <span>মেহেরপুর জেলা</span>
              <span className="text-[10px] text-gray-400 font-mono">Meherpur</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p className="text-center sm:text-left">
            {siteSettings.copyrightText || '© ২০২৬ খুলনা নিউজ (KHULNA NEWS)। সর্বস্বত্ব সংরক্ষিত।'}
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-gray-800/60 px-3 py-1.5 rounded-lg"
          >
            <span>উপরে উঠুন</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
