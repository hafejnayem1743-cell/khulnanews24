import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdsterraSlot } from './AdsterraSlot';
import { BreakingNewsTicker } from './BreakingNewsTicker';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#D32F2F] selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Global Live Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Main Routed Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Global Adsterra overlays (admin controlled) */}
      <AdsterraSlot position="SOCIAL_BAR" />
      <AdsterraSlot position="POPUNDER" />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
