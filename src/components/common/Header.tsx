import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { getLiveBanglaHeaderDate } from '../../services/seo';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AdsterraSlot } from './AdsterraSlot';
import { 
  Search, Moon, Sun, Menu, X, 
  Shield, Calendar, Newspaper, Megaphone, CloudSun,
  MapPin, ChevronDown
} from 'lucide-react';
import { KHULNA_DISTRICTS } from '../../services/newsCollector';

export const Header: React.FC = () => {
  const { categories, siteSettings, theme, toggleTheme, currentUser } = useNews();
  const { lang, labels, isBangla, formatDate } = useActiveLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtsOpen, setDistrictsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { banglaDate, englishDate } = getLiveBanglaHeaderDate();
  const displayDate = isBangla ? banglaDate : formatDate(new Date().toISOString());

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate('/contact');
  };

  const navCategories = categories
    .filter(c => c.showInNav)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const isActiveCategory = (slug: string) => {
    return location.pathname === `/category/${slug}`;
  };

  return (
    <header className="w-full bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-gray-800 transition-colors">
      {/* 1. TOP MICRO BAR (Compact, responsive, clean) */}
      <div className="bg-[#111827] text-white px-3 sm:px-6 py-1.5 text-[11px] border-b border-gray-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
          {/* Left: Live Bangla Date & Location */}
          <div className="flex items-center gap-2 sm:gap-3 font-medium min-w-0">
            <span className="flex items-center gap-1.5 text-gray-200 truncate">
              <Calendar className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
              <span className="truncate">{displayDate}</span>
            </span>
            {isBangla && (
              <>
                <span className="hidden sm:inline-block opacity-30">|</span>
                <span className="hidden md:inline-block text-gray-400 truncate">{englishDate}</span>
              </>
            )}
          </div>

          {/* Right: Weather/City, Language Switcher, Theme & Admin */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-gray-300">
              <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] whitespace-nowrap">{labels.khulna}</span>
            </div>

            <LanguageSwitcher />

            <span className="opacity-20">|</span>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1 sm:px-1.5 sm:py-0.5 rounded flex items-center gap-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? labels.lightMode : labels.darkMode}
              aria-label="Theme toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-gray-300" />
              )}
              <span className="text-[10px] hidden md:inline">{theme === 'dark' ? labels.lightMode : labels.darkMode}</span>
            </button>

            <span className="opacity-20">|</span>

            {/* Admin CMS Access */}
            <Link
              to={currentUser ? "/admin" : "/login"}
              className="flex items-center gap-1 text-gray-300 hover:text-red-400 text-[10px] font-bold tracking-wider transition-colors"
              title="Admin Portal"
            >
              <Shield className="w-3 h-3 text-[#D32F2F]" />
              <span className="hidden xs:inline">{currentUser ? labels.cms : labels.login}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-3">
        {/* Brand Identity & Logo */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#D32F2F] text-white rounded-xl flex items-center justify-center font-black text-xl sm:text-2xl shadow-xs group-hover:scale-102 transition-transform shrink-0">
            খ
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#D32F2F] tracking-tight leading-none truncate">
              {siteSettings.websiteName || 'খুলনা নিউজ'}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
                {siteSettings.englishBrandName || 'KHULNA NEWS'}
              </span>
              <span className="hidden sm:inline-block text-[10px] text-gray-400">•</span>
              <span className="hidden sm:inline-block text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {siteSettings.tagline || 'খুলনার খবর, সবার আগে'}
              </span>
            </div>
          </div>
        </Link>

        {/* Top Advertisement Contact Pill (Desktop center/right) */}
        <div className="hidden lg:flex items-center justify-center">
          <a
            href="/contact"
            onClick={handleContactClick}
            id="ad-contact-top-button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/95 hover:from-red-100 hover:to-orange-100 dark:hover:from-gray-700 dark:hover:to-gray-700 text-gray-900 dark:text-gray-100 text-xs font-bold rounded-xl border border-red-200 dark:border-gray-700 hover:border-[#D32F2F] dark:hover:border-red-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            title="খুলনা নিউজে বিজ্ঞাপন দিতে যোগাযোগ করুন"
          >
            <span className="w-5 h-5 rounded-md bg-[#D32F2F] text-white flex items-center justify-center shrink-0">
              <Megaphone className="w-3 h-3" />
            </span>
            <span className="tracking-tight text-gray-800 dark:text-gray-200 text-xs">
              বিজ্ঞাপন দিতে যোগাযোগ করুন
            </span>
          </a>
        </div>

        {/* Action Controls: Quick Search & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Search Toggle / Form */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
                <input
                  type="text"
                  autoFocus
                  placeholder={labels.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs w-36 sm:w-48 md:w-56 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-[#D32F2F]"
                />
                <button
                  type="submit"
                  className="bg-[#D32F2F] hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors"
                >
                  {labels.searchButton}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                title={labels.searchPlaceholder}
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          <Link
            to="/latest"
            className="px-3.5 py-2 bg-[#D32F2F] hover:bg-red-700 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-xs hidden md:inline-flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{labels.latestNews}</span>
          </Link>

          {/* Mobile menu toggle with >=44px touch area */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Header Banner Adsterra slot */}
      <div className="px-3 sm:px-6 py-1.5 flex justify-center overflow-hidden max-w-full bg-white dark:bg-[#111827]">
        <AdsterraSlot position="HEADER_BANNER" className="w-full max-w-[728px]" />
      </div>

      {/* Mobile Top Ad Strip (Compact, non-intrusive) */}
      <div className="lg:hidden px-3 pb-2 pt-0">
        <a
          href="/contact"
          onClick={handleContactClick}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800/90 dark:to-gray-800/70 border border-red-200 dark:border-gray-700/80 rounded-lg text-slate-800 dark:text-slate-200 text-[11px] font-bold shadow-2xs text-center"
        >
          <Megaphone className="w-3 h-3 text-[#D32F2F]" />
          <span>বিজ্ঞাপন দিতে যোগাযোগ করুন</span>
        </a>
      </div>

      {/* 3. NAVIGATION BAR (Mobile-friendly horizontal category scroll pills) */}
      <nav className="bg-white dark:bg-[#111827] border-y border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                location.pathname === '/' 
                  ? 'bg-[#D32F2F] text-white shadow-xs' 
                  : 'bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {labels.home}
            </Link>

            <Link
              to="/latest"
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                location.pathname === '/latest' 
                  ? 'bg-[#D32F2F] text-white shadow-xs' 
                  : 'bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {labels.latestNews}
            </Link>

            {navCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActiveCategory(cat.slug) 
                    ? 'bg-[#D32F2F] text-white shadow-xs' 
                    : 'bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {getCategoryNameByLanguage(cat, lang)}
              </Link>
            ))}

            {/* 10 Districts Navigation Popover */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setDistrictsOpen(prev => !prev)}
                onBlur={() => setTimeout(() => setDistrictsOpen(false), 200)}
                className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/60 cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-red-600" />
                <span>১০ জেলা</span>
                <ChevronDown className="w-3 h-3 text-red-500" />
              </button>

              {districtsOpen && (
                <div className="absolute left-0 mt-2 w-48 sm:w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                    খুলনা বিভাগের ১০ জেলা
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {KHULNA_DISTRICTS.map(dist => (
                      <Link
                        key={dist.id}
                        to={`/${dist.englishName.toLowerCase()}`}
                        onClick={() => setDistrictsOpen(false)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-600 transition-colors"
                      >
                        {dist.banglaName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/archive"
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                location.pathname === '/archive' 
                  ? 'bg-[#D32F2F] text-white shadow-xs' 
                  : 'bg-gray-100 dark:bg-gray-800/70 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {labels.archive}
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER MENU (Modern, Touch-optimized slide-in) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-[85%] max-w-xs bg-white dark:bg-[#111827] text-gray-900 dark:text-white h-full p-4 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              {/* Drawer Top Branding */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#D32F2F] rounded-xl flex items-center justify-center text-white font-black text-lg">
                    খ
                  </div>
                  <div>
                    <span className="font-black text-base leading-tight block text-[#D32F2F]">{siteSettings.websiteName}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider block">{siteSettings.englishBrandName}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* In-Drawer Quick Search Input */}
              <form onSubmit={handleSearchSubmit} className="mt-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={labels.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#D32F2F]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </form>

              {/* Navigation Links */}
              <div className="py-3 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 block mb-1">
                  {labels.categories}
                </span>

                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs ${
                    location.pathname === '/' 
                      ? 'bg-red-50 dark:bg-red-950/40 text-[#D32F2F]' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span>{labels.home}</span>
                </Link>

                <Link
                  to="/latest"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs ${
                    location.pathname === '/latest' 
                      ? 'bg-red-50 dark:bg-red-950/40 text-[#D32F2F]' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <span>{labels.latestNews}</span>
                  <span className="text-[9px] bg-[#D32F2F] text-white px-1.5 py-0.5 rounded font-bold">LIVE</span>
                </Link>

                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActiveCategory(cat.slug)
                        ? 'bg-red-50 dark:bg-red-950/40 text-[#D32F2F] font-bold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{getCategoryNameByLanguage(cat, lang)}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{cat.englishName}</span>
                  </Link>
                ))}

                {/* Khulna 10 Districts Section */}
                <div className="pt-2 pb-1 my-1 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D32F2F]" />
                    খুলনা বিভাগের ১০ জেলা
                  </span>
                  <div className="grid grid-cols-2 gap-1 px-1">
                    {KHULNA_DISTRICTS.map(dist => (
                      <Link
                        key={dist.id}
                        to={`/${dist.englishName.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {dist.banglaName}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/archive"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {labels.archive}
                </Link>

                <a
                  href="/contact"
                  onClick={handleContactClick}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#D32F2F] hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>বিজ্ঞাপন ও যোগাযোগ</span>
                </a>
              </div>
            </div>

            {/* Drawer Bottom Controls */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-2.5">
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">ভাষা / Language:</span>
                <LanguageSwitcher />
              </div>

              <div className="flex gap-2">
                <Link
                  to={currentUser ? "/admin" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#D32F2F] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{currentUser ? labels.cms : labels.login}</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 shrink-0"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
