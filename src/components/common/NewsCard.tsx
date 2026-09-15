import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { Clock, User, Sparkles, Newspaper, MapPin } from 'lucide-react';
import { ArticleEngagement } from './ArticleEngagement';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'hero' | 'grid' | 'list' | 'compact' | 'trending';
  rank?: number;
  showSummary?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  variant = 'grid',
  rank,
  showSummary = true
}) => {
  const { lang, labels, formatNumber, formatDate } = useActiveLanguage();
  const [imgError, setImgError] = useState(false);

  // Route internally to Khulna News 24 news details page:
  // Both auto-collected and manual news route to /news/:id (or /news/:slug)
  const internalRoute = `/news/${news.id || news.slug}`;

  const rawImage = (news.featuredImage || (news as any).image || '').trim();
  const hasImage = Boolean(rawImage) && !imgError;

  const authorDisplayName = news.authorName || 'খুলনা নিউজ ২৪ ডেস্ক';
  const districtName = news.district || '';

  const localizedCategory = districtName 
    ? districtName 
    : getCategoryNameByLanguage({ name: news.categoryName, slug: news.categorySlug }, lang);

  const formattedDate = formatDate(news.publishedAt);

  // Reusable Link wrapper: ALWAYS navigates internally to the news details page
  const CardLink: React.FC<{
    children: React.ReactNode;
    className?: string;
    title?: string;
  }> = ({ children, className, title }) => {
    return (
      <Link to={internalRoute} className={className} title={title || news.title} aria-label={news.title}>
        {children}
      </Link>
    );
  };

  // 1. HERO VARIANT (Large Featured Story)
  if (variant === 'hero') {
    return (
      <article className="group relative bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[360px] md:h-[430px] shadow-sm cursor-pointer active:scale-[0.99] transition-transform">
        <CardLink className="block w-full h-full relative">
          {hasImage ? (
            <img
              src={rawImage}
              alt={news.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
              <Newspaper className="w-16 h-16 text-slate-700/60 mb-2" />
              <span className="text-xs font-bold text-slate-400 tracking-wider">খুলনা নিউজ ২৪</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-95 z-10"></div>
          
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-[#D32F2F] text-white px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold rounded-lg uppercase tracking-wider shadow-2xs flex items-center gap-1">
              {districtName && <MapPin className="w-3 h-3" />}
              {localizedCategory}
            </span>
            {news.isBreaking && (
              <span className="bg-white text-[#D32F2F] text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-lg uppercase flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#D32F2F]" /> {labels.breaking}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 md:bottom-6 md:left-6 md:right-6 z-20">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white mb-1.5 sm:mb-2 leading-snug group-hover:text-red-200 transition-colors line-clamp-3 sm:line-clamp-2">
              {news.title}
            </h2>
            {news.subTitle && (
              <p className="text-gray-200 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3 leading-relaxed hidden xs:block font-normal">
                {news.subTitle}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-gray-300 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 truncate max-w-[140px]">
                  <User className="w-3 h-3 text-red-400 shrink-0" />
                  <span className="truncate">{authorDisplayName}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{formattedDate}</span>
                </span>
              </div>
              <ArticleEngagement 
                views={news.viewCount || 48000} 
                likes={news.likeCount} 
                shares={news.shareCount} 
                variant="hero" 
              />
            </div>
          </div>
        </CardLink>
      </article>
    );
  }

  // 2. TRENDING / RANKED VARIANT
  if (variant === 'trending') {
    return (
      <article className="group p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800/80 last:border-b-0 active:scale-[0.99]">
        <CardLink className="block">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {rank !== undefined ? (
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-red-100 dark:bg-red-950/60 text-[#D32F2F] dark:text-red-400 text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                  {formatNumber(rank)}
                </span>
              ) : (
                <span className="w-2 h-2 bg-[#D32F2F] rounded-full shrink-0"></span>
              )}
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                {localizedCategory} • {formattedDate}
              </span>
            </div>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-[#D32F2F] transition-colors line-clamp-2">
            {news.title}
          </h4>
        </CardLink>
      </article>
    );
  }

  // 3. LIST / HORIZONTAL VARIANT (Thumb-friendly mobile list)
  if (variant === 'list') {
    return (
      <article className="group flex gap-3 bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl border border-gray-200/80 dark:border-gray-800 shadow-2xs hover:border-red-300 dark:hover:border-gray-700 transition-all active:scale-[0.99]">
        <CardLink className="w-24 h-20 sm:w-28 sm:h-24 bg-gray-100 dark:bg-slate-800 shrink-0 rounded-lg overflow-hidden relative flex items-center justify-center">
          {hasImage ? (
            <img
              src={rawImage}
              alt={news.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-2 text-center">
              <Newspaper className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-1" />
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 line-clamp-1">
                {districtName || 'সংবাদ'}
              </span>
            </div>
          )}
          {news.isBreaking && (
            <span className="absolute bottom-1 left-1 bg-[#D32F2F] text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase">
              {labels.breaking}
            </span>
          )}
        </CardLink>
        <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] text-[#D32F2F] font-bold uppercase tracking-wider">
                {localizedCategory}
              </span>
            </div>
            <CardLink className="block">
              <h3 className="text-xs sm:text-sm font-bold leading-snug line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors">
                {news.title}
              </h3>
            </CardLink>
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 pt-1 border-t border-gray-50 dark:border-gray-800/60">
            <span className="truncate max-w-[140px]">{formattedDate}</span>
            <ArticleEngagement 
              views={news.viewCount || 38000} 
              likes={news.likeCount} 
              shares={news.shareCount} 
              variant="card" 
            />
          </div>
        </div>
      </article>
    );
  }

  // 4. COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <article className="group p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-lg border-b border-gray-100 dark:border-gray-800/80 last:border-b-0 transition-colors active:scale-[0.99]">
        <CardLink className="block">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full shrink-0"></span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">
                {localizedCategory} • {formattedDate}
              </span>
            </div>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-[#D32F2F] transition-colors">
            {news.title}
          </h4>
        </CardLink>
      </article>
    );
  }

  // 5. DEFAULT GRID CARD VARIANT
  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-2xs hover:border-gray-300 dark:hover:border-gray-700 transition-all h-full overflow-hidden active:scale-[0.99]">
      <CardLink className="block relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
        {hasImage ? (
          <img
            src={rawImage}
            alt={news.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-4 text-center">
            <Newspaper className="w-10 h-10 text-slate-400/80 dark:text-slate-500 mb-1" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {districtName ? `${districtName} জেলা` : 'খুলনা নিউজ ২৪'}
            </span>
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs flex items-center gap-1">
            {districtName && <MapPin className="w-2.5 h-2.5" />}
            {localizedCategory}
          </span>
          {news.isBreaking && (
            <span className="bg-white text-[#D32F2F] text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shadow-2xs">
              {labels.breaking}
            </span>
          )}
        </div>
      </CardLink>
      
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <CardLink className="block">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#D32F2F] transition-colors leading-snug line-clamp-2">
              {news.title}
            </h3>
          </CardLink>
          {showSummary && news.summary && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
              {news.summary}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800">
          <span className="truncate max-w-[140px] font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>{authorDisplayName}</span>
          </span>
          <span className="text-[10px] text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </article>
  );
};

