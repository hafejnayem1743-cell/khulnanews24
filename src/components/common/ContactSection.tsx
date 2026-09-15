import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Phone, Mail, Megaphone, ExternalLink, MessageCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { siteSettings } = useNews();

  // Dynamic values connected to Site Settings with strict requested defaults
  const phone = siteSettings.phone || '01306721743';
  const whatsapp = siteSettings.whatsapp || '01907655994';
  const email = siteSettings.email || 'worldbusiness677@gmail.com';

  // Sanitized links
  const telLink = `tel:+88${phone.replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0')}`;
  const cleanWhatsappDigits = whatsapp.replace(/[^0-9]/g, '').replace(/^88/, '').replace(/^0/, '0');
  const whatsappLink = `https://wa.me/88${cleanWhatsappDigits}`;
  const mailtoLink = `mailto:${email.trim()}`;

  return (
    <section 
      id="contact" 
      aria-label="যোগাযোগ ও বিজ্ঞাপন"
      className="scroll-mt-24 w-full bg-white dark:bg-[#111827] border-t border-b border-gray-200 dark:border-gray-800 transition-colors py-8 sm:py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-950/50 text-[#D32F2F] dark:text-red-400 text-xs font-bold rounded-full border border-red-200 dark:border-red-900/60 mb-2 sm:mb-3">
            <Megaphone className="w-3.5 h-3.5" />
            <span>বিজ্ঞাপন ও ব্যবসায়িক যোগাযোগ</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            যোগাযোগ
          </h2>

          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-gray-300 mt-1.5 sm:mt-2">
            খুলনা নিউজের সঙ্গে যোগাযোগ করুন
          </p>

          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-lg mx-auto">
            খুলনা নিউজে ডিজিটাল বিজ্ঞাপন প্রচার, স্পন্সরশিপ, সংবাদ বিজ্ঞপ্তি অথবা যেকোনো প্রাতিষ্ঠানিক তথ্যের জন্য সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        {/* 3 Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6 max-w-5xl mx-auto">
          {/* Card 1: Phone */}
          <a
            href={telLink}
            id="contact-card-phone"
            className="group block p-4 sm:p-6 bg-gray-50 dark:bg-[#1f2937] hover:bg-white dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#D32F2F] dark:hover:border-red-500 shadow-2xs hover:shadow-md transition-all duration-200 text-center"
            title="সরাসরি কল করতে ট্যাপ করুন"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#D32F2F] dark:text-red-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 block mb-1">
              Phone / ফোন
            </span>

            <span className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white group-hover:text-[#D32F2F] dark:group-hover:text-red-400 transition-colors block font-mono tracking-wide">
              {phone}
            </span>

            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
              সরাসরি কল করতে ট্যাপ করুন
            </p>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-center gap-1.5 text-xs font-bold text-[#D32F2F] dark:text-red-400 group-hover:underline">
              <span>কল করুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 2: WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-card-whatsapp"
            className="group block p-4 sm:p-6 bg-gray-50 dark:bg-[#1f2937] hover:bg-white dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-2xs hover:shadow-md transition-all duration-200 text-center"
            title="হোয়াটসঅ্যাপে চ্যাট করুন"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg 
                className="w-5 h-5 sm:w-6 sm:h-6 fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.183 8.183 0 0 1-5.83 2.41c-1.47 0-2.93-.39-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.25-4.39c0-4.54 3.7-8.24 8.26-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3z"/>
              </svg>
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 block mb-1">
              WhatsApp / হোয়াটসঅ্যাপ
            </span>

            <span className="text-base sm:text-lg md:text-xl font-black text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block font-mono tracking-wide">
              {whatsapp}
            </span>

            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
              মেসেজ পাঠাতে ট্যাপ করুন
            </p>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              <span>মেসেজ পাঠান</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Card 3: Email */}
          <a
            href={mailtoLink}
            id="contact-card-email"
            className="group block p-4 sm:p-6 bg-gray-50 dark:bg-[#1f2937] hover:bg-white dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-2xs hover:shadow-md transition-all duration-200 text-center"
            title="ইমেইল পাঠাতে ক্লিক করুন"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 block mb-1">
              Email / ইমেইল
            </span>

            <span className="text-xs sm:text-sm md:text-base font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block break-all font-mono tracking-tight">
              {email}
            </span>

            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2">
              মেইল পাঠাতে ট্যাপ করুন
            </p>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
              <span>ইমেইল পাঠান</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
