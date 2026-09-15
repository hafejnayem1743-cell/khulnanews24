import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage } from '../../services/language';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BreakingNewsTicker: React.FC = () => {
  const { breakingNews, siteSettings } = useNews();
  const { labels } = useActiveLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeItems = breakingNews
    .filter(item => item.isActive)
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  useEffect(() => {
    if (!siteSettings.breakingNewsEnabled || activeItems.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeItems.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeItems.length, isPaused, siteSettings.breakingNewsEnabled]);

  if (!siteSettings.breakingNewsEnabled || activeItems.length === 0) {
    return null;
  }

  const currentItem = activeItems[currentIndex] || activeItems[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeItems.length);
  };

  return (
    <div 
      id="breaking-news-ticker" 
      className="breaking-ticker bg-[#D32F2F] text-white flex items-center px-3 sm:px-6 py-1.5 sm:py-2 overflow-hidden border-b border-red-700/60 relative z-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Badge */}
        <div className="bg-white text-[#D32F2F] px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase rounded-md shrink-0 flex items-center gap-1 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] animate-pulse"></span>
          <span>{labels.breaking}</span>
        </div>

        {/* Headline Content */}
        <div className="flex-1 overflow-hidden min-w-0">
          <div className="text-xs sm:text-sm font-medium truncate">
            {currentItem.linkUrl ? (
              <Link 
                to={currentItem.linkUrl} 
                className="hover:underline hover:text-red-100 transition-colors block truncate"
              >
                {currentItem.headline}
              </Link>
            ) : (
              <span className="block truncate">{currentItem.headline}</span>
            )}
          </div>
        </div>

        {/* Controls with touch-friendly targets */}
        <div className="flex items-center gap-0.5 shrink-0 text-white/90">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-7 h-7 flex items-center justify-center hover:text-white hover:bg-black/15 rounded-lg transition-colors"
            title={isPaused ? "Play" : "Pause"}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="w-7 h-7 flex items-center justify-center hover:text-white hover:bg-black/15 rounded-lg transition-colors"
            title="Previous"
            aria-label="Previous Breaking News"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 flex items-center justify-center hover:text-white hover:bg-black/15 rounded-lg transition-colors"
            title="Next"
            aria-label="Next Breaking News"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
