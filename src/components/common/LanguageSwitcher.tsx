import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, Search, ChevronDown, X } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
  flag: string;
  popular?: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  // 1. Featured / Priority Languages requested by user
  { code: 'bn', name: 'Bangla', native: 'বাংলা', flag: '🇧🇩', popular: true },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', popular: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', popular: true },

  // 2. Comprehensive World & Regional Languages
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' }
];

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('khulna_selected_language');
      return saved && LANGUAGES.some(l => l.code === saved) ? saved : 'bn';
    } catch { return 'bn'; }
  });
  const [searchFilter, setSearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize language from localStorage or googtrans cookie
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('khulna_selected_language');
      if (savedLang) {
        setCurrentLang(savedLang);
        return;
      }

      // Check cookie
      const match = document.cookie.match(/googtrans=\/bn\/([a-zA-Z-]+)/);
      if (match && match[1]) {
        setCurrentLang(match[1]);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang || 'bn';
  }, [currentLang]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (langCode: string) => {
    try {
      setCurrentLang(langCode);
      document.documentElement.lang = langCode;
      localStorage.setItem('khulna_selected_language', langCode);
      window.dispatchEvent(new CustomEvent('khulna-language-change', { detail: langCode }));

      const domain = window.location.hostname;

      if (langCode === 'bn') {
        // Reset translation to original Bangla
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;

        // If Google Translate select exists
        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (select) {
          select.value = '';
          select.dispatchEvent(new Event('change'));
        }
        window.location.reload();
      } else {
        const cookieVal = `/bn/${langCode}`;
        document.cookie = `googtrans=${cookieVal}; path=/;`;
        document.cookie = `googtrans=${cookieVal}; path=/; domain=${domain};`;
        document.cookie = `googtrans=${cookieVal}; path=/; domain=.${domain};`;

        const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (select) {
          select.value = langCode;
          select.dispatchEvent(new Event('change'));
        } else {
          window.location.reload();
        }
      }
    } catch {
      window.location.reload();
    } finally {
      setIsOpen(false);
    }
  };

  const currentOption = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.native.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.code.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Sits right next to খুলনা, বাংলাদেশ */}
      <button
        type="button"
        id="language-switcher-button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] font-semibold transition-all duration-150 cursor-pointer border ${
          isOpen 
            ? 'bg-gray-700 text-white border-red-500 ring-1 ring-red-500' 
            : 'bg-gray-800/90 hover:bg-gray-700 text-gray-200 hover:text-white border-gray-700 hover:border-gray-600'
        }`}
        title="ভাষা পরিবর্তন করুন / Change Language (English, বাংলা, हिन्दी)"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-red-400 shrink-0" />
        <span className="text-xs shrink-0">{currentOption.flag}</span>
        <span className="font-bold text-[10px] sm:text-[11px] tracking-tight">
          {currentOption.native}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-400' : ''}`} />
      </button>

      {/* Language Selection Dropdown Menu */}
      {isOpen && (
        <div 
          id="language-dropdown-menu"
          className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-72 sm:w-80 bg-[#1e293b] text-white rounded-xl shadow-2xl border border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-3 border-b border-gray-700/80 bg-[#162032] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-red-400" />
              <div>
                <h4 className="text-xs font-bold text-white">ভাষা নির্বাচন করুন</h4>
                <p className="text-[10px] text-gray-400">Select Website Language</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Languages Quick Selector (Bangla, English, Hindi) */}
          <div className="p-2.5 bg-[#1a2333] border-b border-gray-700/60">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 px-1">
              প্রধান ভাষা / Primary Languages
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGES.filter(l => l.popular).map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-red-900/40 border-red-500 text-white shadow-xs'
                        : 'bg-gray-800/80 hover:bg-gray-700 border-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base mb-0.5">{lang.flag}</span>
                    <span className="text-[11px] font-black">{lang.native}</span>
                    <span className="text-[9px] text-gray-400 font-normal">{lang.name}</span>
                    {isSelected && (
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input for All Other Languages */}
          <div className="p-2 border-b border-gray-700/60 bg-[#162032]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="অন্যান্য ভাষা খুঁজুন / Search language..."
                className="w-full pl-8 pr-3 py-1.5 bg-gray-900/90 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Language List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 divide-y divide-gray-800/40">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">
                কোনো ভাষা পাওয়া যায়নি
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-red-900/30 text-white font-bold'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{lang.flag}</span>
                      <div>
                        <span className="font-semibold text-white block text-[11px]">
                          {lang.native}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded-full border border-red-800">
                        <Check className="w-3 h-3" />
                        <span>সক্রিয়</span>
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 border-t border-gray-700 bg-[#162032] text-center">
            <p className="text-[9px] text-gray-400">
              Powered by Google Translate • তাৎক্ষণিক বহুভাষিক অনুবাদ
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
