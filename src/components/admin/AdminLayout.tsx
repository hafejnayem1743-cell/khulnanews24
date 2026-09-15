import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { 
  LayoutDashboard, Newspaper, PlusCircle, FolderTree, 
  Radio, Image as ImageIcon, DollarSign, MessageSquare, 
  Layers, Settings, LogOut, Globe, Moon, Sun, Menu, X, 
  Shield, UserCheck, ChevronRight, BarChart3, Users,
  Database, Rocket, Trash2, Palette, Search, Share2, UserCog,
  FileText, Rss, Bot
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { currentUser, logout, theme, toggleTheme, siteSettings, news, autoNewsSettings } = useNews();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Authentication Guard
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const trashCount = news.filter(n => n.status === 'trash').length;
  const autoCount = news.filter(n => n.isAutoCollected).length;

  const navGroups = [
    {
      title: 'মূল ব্যবস্থাপনা',
      items: [
        { name: 'ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'সকল সংবাদ', path: '/admin/news', icon: Newspaper, exact: true },
        { name: 'অটো নিউজ (১০ জেলা)', path: '/admin/auto-news', icon: Rss, badge: autoNewsSettings.isEnabled ? `${autoCount}টি` : 'OFF' },
        { name: 'নতুন সংবাদ প্রকাশ', path: '/admin/news/new', icon: PlusCircle, badge: 'New' },
        { name: 'ব্রেকিং নিউজ টিকার', path: '/admin/breaking', icon: Radio },
        { name: 'মুছে ফেলা সংবাদ', path: '/admin/trash', icon: Trash2, badge: trashCount > 0 ? `${trashCount}` : undefined },
      ]
    },
    {
      title: 'কাঠামো ও কন্টেন্ট',
      items: [
        { name: 'ক্যাটাগরি সমূহ', path: '/admin/categories', icon: FolderTree },
        { name: 'প্রতিবেদক ও লেখক', path: '/admin/authors', icon: Users },
        { name: 'মিডিয়া গ্যালারি', path: '/admin/media', icon: ImageIcon },
        { name: 'হোমপেজ লেআউট', path: '/admin/homepage-layout', icon: Layers },
      ]
    },
    {
      title: 'বিজ্ঞাপন ও পারফরম্যান্স',
      items: [
        { name: 'Adsterra বিজ্ঞাপন', path: '/admin/ads', icon: DollarSign },
        { name: 'রিডার্স অ্যানালিটিক্স', path: '/admin/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'কনফিগারেশন ও সিকিউরিটি',
      items: [
        { name: 'পোর্টাল সেটিংস', path: '/admin/settings', icon: Settings },
        { name: 'থিম ও অ্যাপিয়ারেন্স', path: '/admin/theme-settings', icon: Palette },
        { name: 'এসইও কনফিগারেশন', path: '/admin/seo-settings', icon: Search },
        { name: 'সোশ্যাল মিডিয়া লিংক', path: '/admin/social-settings', icon: Share2 },
        { name: 'অ্যাডমিন অ্যাকাউন্টস', path: '/admin/users', icon: UserCog },
        { name: 'ডাটাবেজ ব্যাকআপ', path: '/admin/backup', icon: Database },
        { name: 'ডেপ্লয়মেন্ট ও রিলিজ', path: '/admin/deployment', icon: Rocket },
      ]
    }
  ];

  const isItemActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row font-sans">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-md">
              খ
            </div>
            <div>
              <h2 className="font-bold text-sm text-white leading-none">{siteSettings.websiteName || 'খুলনা নিউজ'}</h2>
              <span className="text-[9px] text-red-400 font-semibold tracking-wider uppercase">CMS Panel</span>
            </div>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto no-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block">
                {group.title}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active 
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20' 
                        : 'hover:bg-slate-800 hover:text-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                        active ? 'bg-white text-red-600' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[9px] text-slate-400 capitalize">{currentUser.role}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
              title="Open Public Website"
            >
              <Globe className="w-3 h-3 text-red-400" />
              <span>লাইভ সাইট</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-400 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOPBAR & DRAWER */}
      <div className="md:hidden bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-1.5 bg-slate-800 rounded-lg text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              খ
            </div>
            <span className="font-bold text-sm">অ্যাডমিন সিএমএস</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" target="_blank" className="p-1.5 bg-slate-800 rounded-lg text-slate-300">
            <Globe className="w-4 h-4" />
          </Link>
          <button onClick={handleLogout} className="p-1.5 bg-red-950 text-red-400 rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-3/4 max-w-xs bg-slate-900 text-slate-200 h-full p-4 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                    খ
                  </div>
                  <span className="font-bold text-sm text-white">খুলনা নিউজ সিএমএস</span>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {navGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 block">
                      {group.title}
                    </span>
                    {group.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${
                          isItemActive(item.path, item.exact)
                            ? 'bg-red-600 text-white font-bold'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-red-600">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-950 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
