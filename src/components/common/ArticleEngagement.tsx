import React from 'react';
import { Eye, Heart, ArrowUpRight } from 'lucide-react';
import { useActiveLanguage } from '../../services/language';

interface ArticleEngagementProps {
  views: number;
  likes?: number;
  shares?: number;
  variant?: 'card' | 'detail' | 'compact' | 'hero';
  isReal?: boolean;
  onLike?: () => void;
  onShare?: () => void;
  hasLiked?: boolean;
  className?: string;
  showLabels?: boolean;
}

export const ArticleEngagement: React.FC<ArticleEngagementProps> = ({
  views,
  likes = Math.floor(views * 0.12) || 2800,
  shares = Math.floor(views * 0.05) || 1200,
  variant = 'card',
  onLike,
  onShare,
  hasLiked = false,
  className = '',
  showLabels
}) => {
  const { labels, formatMetric } = useActiveLanguage();

  const safeViews = Number.isFinite(views) && views > 0 ? views : 0;
  const safeLikes = Number.isFinite(likes) && (likes || 0) > 0 ? (likes as number) : Math.max(7, Math.floor(safeViews * 0.075));
  const safeShares = Number.isFinite(shares) && (shares || 0) > 0 ? (shares as number) : Math.max(3, Math.floor(safeViews * 0.028));
  const formattedViews = formatMetric(safeViews);
  const formattedLikes = formatMetric(safeLikes);
  const formattedShares = formatMetric(safeShares);

  // 1. DETAIL VARIANT (Used on SingleNewsPage)
  if (variant === 'detail') {
    return (
      <div 
        className={`article-engagement-bar flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 py-2.5 px-3 sm:px-4 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs ${className}`}
      >
        {/* Metric Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Views */}
          <div 
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-2xs"
            title={`${labels.views}: ${formattedViews}`}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span className="font-extrabold text-slate-900 dark:text-white">{formattedViews}</span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {labels.views}
            </span>
          </div>

          {/* Likes */}
          <button
            type="button"
            onClick={onLike}
            disabled={!onLike || hasLiked}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold border shadow-2xs transition-all ${
              hasLiked
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-900'
                : onLike
                ? 'bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title={`${labels.likes}: ${formattedLikes}`}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
            <span className="font-extrabold text-slate-900 dark:text-white">{formattedLikes}</span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {labels.likes}
            </span>
          </button>

          {/* Shares */}
          <button
            type="button"
            onClick={onShare}
            disabled={!onShare}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold border shadow-2xs transition-all ${
              onShare
                ? 'bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95'
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title={`${labels.shares}: ${formattedShares}`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-extrabold text-slate-900 dark:text-white">{formattedShares}</span>
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              {labels.shares}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 2. HERO VARIANT (Overlay on dark hero card)
  if (variant === 'hero') {
    return (
      <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-gray-200 ${className}`}>
        <span 
          className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-red-300 border border-white/10"
          title={`${labels.views}: ${formattedViews}`}
        >
          <Eye className="w-3 h-3 text-red-400 shrink-0" />
          <span>{formattedViews}</span>
        </span>

        <span 
          className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-pink-300 border border-white/10"
          title={`${labels.likes}: ${formattedLikes}`}
        >
          <Heart className="w-3 h-3 fill-pink-400 text-pink-400 shrink-0" />
          <span>{formattedLikes}</span>
        </span>

        <span 
          className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md font-bold text-blue-300 border border-white/10"
          title={`${labels.shares}: ${formattedShares}`}
        >
          <ArrowUpRight className="w-3 h-3 text-blue-400 shrink-0" />
          <span>{formattedShares}</span>
        </span>
      </div>
    );
  }

  // 3. COMPACT VARIANT (For small cards or compact lists)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300 shrink-0 ${className}`}>
        <span className="inline-flex items-center gap-0.5 text-red-600 dark:text-red-400 font-bold" title={`${labels.views}: ${formattedViews}`}>
          <Eye className="w-3 h-3 shrink-0" />
          <span>{formattedViews}</span>
        </span>
      </div>
    );
  }

  // 4. DEFAULT CARD VARIANT (Grid & List News Cards)
  return (
    <div className={`article-engagement-card flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-medium ${className}`}>
      {/* Views */}
      <span 
        className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold"
        title={`${labels.views}: ${formattedViews}`}
      >
        <Eye className="w-3.5 h-3.5 shrink-0" />
        <span>{formattedViews}</span>
        {showLabels && <span className="font-normal text-slate-400 text-[10px]">{labels.views}</span>}
      </span>

      {/* Likes */}
      <span 
        className="inline-flex items-center gap-1 text-rose-500 font-semibold"
        title={`${labels.likes}: ${formattedLikes}`}
      >
        <Heart className="w-3 h-3 fill-rose-500/20 shrink-0" />
        <span>{formattedLikes}</span>
        {showLabels && <span className="font-normal text-slate-400 text-[10px]">{labels.likes}</span>}
      </span>

      {/* Shares */}
      <span 
        className="hidden xs:inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-semibold"
        title={`${labels.shares}: ${formattedShares}`}
      >
        <ArrowUpRight className="w-3 h-3 shrink-0" />
        <span>{formattedShares}</span>
        {showLabels && <span className="font-normal text-slate-400 text-[10px]">{labels.shares}</span>}
      </span>
    </div>
  );
};
