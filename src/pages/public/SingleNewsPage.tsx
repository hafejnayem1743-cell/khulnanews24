import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { NewsCard } from '../../components/common/NewsCard';
import { SocialShare } from '../../components/common/SocialShare';
import { AdsterraSlot } from '../../components/common/AdsterraSlot';
import { SeoHead } from '../../components/common/SeoHead';
import { ArticleEngagement } from '../../components/common/ArticleEngagement';
import { useActiveLanguage, getCategoryNameByLanguage } from '../../services/language';
import { fetchNewsByIdOrSlug, fetchArticleMeta, isNewsMatch } from '../../services/newsApi';
import { NewsItem } from '../../types/index';
import { 
  Clock, Eye, User, ChevronRight, Tag, 
  Calendar, Share2, Heart, Flame, Home,
  MapPin, ArrowLeft, Newspaper, AlertCircle
} from 'lucide-react';

const stableMetric = (seed: string, min: number, max: number): number => {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const unit = (hash >>> 0) / 4294967295;
  return Math.floor(min + unit * (max - min));
};

const getArticleMetrics = (item: NewsItem) => {
  const seed = item.id || item.slug || item.url || item.title || 'khulna-news';
  const storedViews = Number(item.viewCount) || 0;
  const storedLikes = Number(item.likeCount) || 0;
  const storedShares = Number(item.shareCount) || 0;
  const generatedViews = stableMetric(seed + ':views', 18000, 185000);
  const views = item.isAutoCollected && storedViews < 100 ? generatedViews + storedViews : (storedViews > 0 ? storedViews : generatedViews);
  const generatedLikes = Math.floor(views * (0.055 + stableMetric(seed + ':like-rate', 0, 100) / 10000));
  const generatedShares = Math.floor(views * (0.018 + stableMetric(seed + ':share-rate', 0, 100) / 10000));
  const likes = item.isAutoCollected && storedLikes < 20 ? generatedLikes + storedLikes : (storedLikes > 0 ? storedLikes : generatedLikes);
  const shares = item.isAutoCollected && storedShares < 10 ? generatedShares + storedShares : (storedShares > 0 ? storedShares : generatedShares);
  return { views, likes: Math.max(120, likes), shares: Math.max(40, shares) };
};

export const SingleNewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string; district?: string }>();
  const { news, authors, incrementNewsView, incrementNewsLike, incrementNewsShare, showToast, siteSettings } = useNews();
  const { lang, labels, formatDate } = useActiveLanguage();
  const navigate = useNavigate();

  const [fontSizeDelta, setFontSizeDelta] = useState(0); // -1, 0, 1
  const [hasLiked, setHasLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedNews, setFetchedNews] = useState<NewsItem | null>(null);

  // Reset state when article slug or route changes
  useEffect(() => {
    setFetchedNews(null);
    setImgError(false);
    setHasLiked(false);
  }, [slug]);

  // 1. Locate news from existing context by id or slug
  const contextNews = useMemo(() => {
    if (!slug) return null;
    return news.find(n => isNewsMatch(n, slug)) || null;
  }, [slug, news]);

  // Use fetchedNews (which may be enriched or loaded via API) or contextNews
  const currentNews = fetchedNews || contextNews;
  const engagement = currentNews ? getArticleMetrics(currentNews) : { views: 0, likes: 0, shares: 0 };

  // 2. Fetch from Worker API / cache if not yet in state (e.g. direct URL load / browser refresh)
  useEffect(() => {
    if (!contextNews && slug) {
      setIsLoading(true);
      fetchNewsByIdOrSlug(slug, news)
        .then(item => {
          if (item) {
            setFetchedNews(item);
          } else {
            setFetchedNews(null);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug, contextNews, news]);

  // Enrich auto-collected news with complete public metadata if available
  useEffect(() => {
    if (currentNews && currentNews.isAutoCollected) {
      const targetUrl = currentNews.sourceUrl || currentNews.url;
      const contentLen = (currentNews.content || (currentNews as any).description || currentNews.summary || '').length;
      if (targetUrl && (contentLen < 90 || !currentNews.featuredImage)) {
        fetchArticleMeta(targetUrl).then(meta => {
          if (meta) {
            setFetchedNews(prev => {
              const base = prev || currentNews;
              const newDesc = meta.description && meta.description.length > (base.content || '').length ? meta.description : base.content;
              return {
                ...base,
                featuredImage: base.featuredImage || meta.image || '',
                content: newDesc || base.content,
                summary: newDesc || base.summary,
                description: newDesc || (base as any).description,
              };
            });
          }
        });
      }
    }
  }, [currentNews?.id, currentNews?.sourceUrl, currentNews?.url]);

  // Reset image error flag when news changes
  useEffect(() => {
    setImgError(false);
  }, [currentNews?.id]);

  // Increment view on load
  useEffect(() => {
    if (currentNews) {
      incrementNewsView(currentNews.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentNews?.id]);

  // Loading skeleton for direct navigation or refresh
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        <div className="animate-pulse space-y-4 max-w-4xl">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          <div className="h-64 sm:h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentNews) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
          {lang === 'bn' ? 'দুঃখিত! খবরটি পাওয়া যায়নি।' : 'Sorry! The news could not be found.'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
          {lang === 'bn' ? 'আপনি যে সংবাদটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি পরিবর্তিত হয়েছে।' : 'The news you are looking for was removed or the link has changed.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D32F2F] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-colors"
        >
          <Home className="w-4 h-4" />
          {labels.home}
        </Link>
      </div>
    );
  }

  const author = authors.find(a => a.id === currentNews.authorId);
  const relatedNews = news
    .filter(n => n.id !== currentNews.id && n.status === 'published' && (n.categoryId === currentNews.categoryId || n.tags.some(t => currentNews.tags.includes(t))))
    .slice(0, 4);

  const latestNews = news
    .filter(n => n.id !== currentNews.id && n.status === 'published')
    .slice(0, 5);

  const handleFontSize = (delta: number) => {
    if (delta === 0) setFontSizeDelta(0);
    else setFontSizeDelta(prev => Math.max(-1, Math.min(2, prev + delta)));
  };

  const getFontSizeClass = () => {
    if (fontSizeDelta === -1) return 'text-base leading-relaxed';
    if (fontSizeDelta === 1) return 'text-xl leading-loose';
    if (fontSizeDelta === 2) return 'text-2xl leading-loose';
    return 'text-lg leading-relaxed';
  };

  const handleLike = () => {
    if (hasLiked) return;
    setHasLiked(true);
    incrementNewsLike(currentNews.id);
    showToast('এই সংবাদটি আপনার পছন্দ হয়েছে!', 'success');
  };

  const handleShare = () => {
    incrementNewsShare(currentNews.id);
  };

  const rawImage = (currentNews.featuredImage || (currentNews as any).image || '').trim();
  const hasImage = Boolean(rawImage) && !imgError;
  const districtName = currentNews.district || '';

  const breadcrumbs = [
    { name: labels.home || 'প্রচ্ছদ', url: '/' },
    ...(districtName ? [{ 
      name: `${districtName} জেলা`, 
      url: `/${districtName.toLowerCase()}` 
    }] : []),
    { 
      name: getCategoryNameByLanguage({ name: currentNews.categoryName, slug: currentNews.categorySlug }, lang), 
      url: `/category/${currentNews.categoryId.replace('cat-', '')}` 
    },
    { name: currentNews.title, url: `/news/${currentNews.id || currentNews.slug}` }
  ];

  return (
    <div className="min-h-screen">
      <SeoHead
        title={currentNews.seo?.seoTitle || `${currentNews.title} | খুলনা নিউজ ২৪`}
        description={currentNews.seo?.metaDescription || currentNews.summary || currentNews.title}
        image={hasImage ? rawImage : undefined}
        type="article"
        news={currentNews}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
        {/* Top Navigation Bar: Back button + Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-1">
            <Link to="/" className="hover:text-red-600 transition-colors shrink-0">{labels.home}</Link>
            {districtName && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <Link to={`/${districtName.toLowerCase()}`} className="hover:text-red-600 text-slate-600 dark:text-slate-300 font-medium transition-colors shrink-0">
                  {districtName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <Link to={`/category/${currentNews.categoryId.replace('cat-', '')}`} className="hover:text-red-600 text-[#D32F2F] font-bold transition-colors shrink-0">
              {getCategoryNameByLanguage({ name: currentNews.categoryName, slug: currentNews.categorySlug }, lang)}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate max-w-[180px] sm:max-w-md text-slate-700 dark:text-slate-300">{currentNews.title}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors shrink-0 shadow-2xs"
            title="পূর্ববর্তী পৃষ্ঠায় ফিরে যান"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{labels.back}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Main Article Content (Left 8 cols) */}
          <main className="lg:col-span-8">
            <article className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs article-content">
              {/* Category, District, and Breaking Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2.5 sm:mb-3">
                <span className="bg-[#D32F2F] text-white text-[11px] sm:text-xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md uppercase">
                  {getCategoryNameByLanguage({ name: currentNews.categoryName, slug: currentNews.categorySlug }, lang)}
                </span>
                {districtName && (
                  <Link
                    to={`/${districtName.toLowerCase()}`}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md flex items-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-red-500" />
                    {districtName} জেলা
                  </Link>
                )}
                {currentNews.isBreaking && (
                  <span className="bg-yellow-400 text-black text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {labels.breaking}
                  </span>
                )}
              </div>

              {/* Headline */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-snug mb-3 sm:mb-4">
                {currentNews.title}
              </h1>

              {/* Subtitle if manual news has one */}
              {currentNews.subTitle && !currentNews.isAutoCollected && (
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
                  {currentNews.subTitle}
                </p>
              )}

              {/* Author & Published Info Bar */}
              <div className="flex items-center justify-between gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 my-3 sm:my-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {author?.photo ? (
                    <img 
                      src={author.photo} 
                      alt={currentNews.authorName || 'খুলনা নিউজ ২৪ ডেস্ক'} 
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 font-bold">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm block">
                      {currentNews.authorName || 'খুলনা নিউজ ২৪ ডেস্ক'}
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(currentNews.publishedAt)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Article Engagement Bar */}
              <ArticleEngagement
                views={engagement.views}
                likes={engagement.likes}
                shares={engagement.shares}
                variant="detail"
                isReal={currentNews.isRealEngagement}
                onLike={handleLike}
                onShare={handleShare}
                hasLiked={hasLiked}
                className="my-3 sm:my-4"
              />

              {/* Social Share Bar */}
              <SocialShare 
                newsId={currentNews.id}
                title={currentNews.title} 
                summary={currentNews.summary} 
                likeCount={engagement.likes}
                shareCount={engagement.shares}
                onFontSizeChange={handleFontSize}
              />

              {/* Article Top Ad */}
              <AdsterraSlot position="ARTICLE_TOP" />

              {/* Article Image (with neutral placeholder fallback) */}
              <figure className="my-6 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                {hasImage ? (
                  <img
                    src={rawImage}
                    alt={currentNews.title}
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-[500px] object-cover"
                  />
                ) : (
                  <div className="w-full h-56 sm:h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800 shadow-xs flex items-center justify-center mb-3">
                      <Newspaper className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
                      {districtName ? `${districtName} ${lang === 'bn' ? 'জেলা সম্পর্কিত প্রতিবেদন' : 'District Report'}` : 'Khulna News 24'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Khulna News 24 • Reliable news from Khulna Division
                    </span>
                  </div>
                )}
                {currentNews.imageCaption && hasImage && !currentNews.imageCaption.includes('সম্পর্কিত চিত্র') && (
                  <figcaption className="p-2.5 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                    <span>{currentNews.imageCaption}</span>
                  </figcaption>
                )}
              </figure>

              {/* Main Content Body */}
              {(() => {
                const rawContent = (currentNews.content || '').trim();
                const rawDesc = ((currentNews as any).description || currentNews.summary || '').trim();
                const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);

                // Manual admin news with rich HTML formatting
                if (!currentNews.isAutoCollected && isHtml) {
                  return (
                    <div 
                      className={`news-body prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${getFontSizeClass()} space-y-4 sm:space-y-5 leading-relaxed`}
                      dangerouslySetInnerHTML={{ __html: rawContent }}
                    />
                  );
                }

                // If content already contains pre-formatted HTML paragraphs
                if (isHtml) {
                  return (
                    <div 
                      className={`news-body prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${getFontSizeClass()} space-y-4 sm:space-y-5 leading-relaxed`}
                      dangerouslySetInnerHTML={{ __html: rawContent }}
                    />
                  );
                }

                // Available legitimate content without any card truncation or fake text
                // Combine all available non-redundant fields from API (content, description, summary)
                const textPool = [
                  (currentNews.content || '').trim(),
                  ((currentNews as any).description || '').trim(),
                  (currentNews.summary || '').trim()
                ].filter(Boolean);

                let fullAvailableText = '';
                for (const piece of textPool) {
                  if (!fullAvailableText) {
                    fullAvailableText = piece;
                  } else if (!fullAvailableText.includes(piece) && !piece.includes(fullAvailableText)) {
                    fullAvailableText += '\n\n' + piece;
                  } else if (piece.length > fullAvailableText.length) {
                    fullAvailableText = piece;
                  }
                }

                if (!fullAvailableText) {
                  fullAvailableText = (currentNews.title || '').trim();
                }

                // Break text cleanly into readable paragraphs based on line breaks and natural sentence flow
                let paragraphs: string[] = [];
                if (fullAvailableText.includes('\n')) {
                  paragraphs = fullAvailableText
                    .split(/\n+/)
                    .map(p => p.trim())
                    .filter(Boolean);
                } else {
                  // Natural Bengali sentence splitting for comfortable readability without dropping any text
                  const sentences = fullAvailableText
                    .split(/(?<=[।?!])\s+/)
                    .map(s => s.trim())
                    .filter(Boolean);

                  if (sentences.length > 2) {
                    for (let i = 0; i < sentences.length; i += 2) {
                      paragraphs.push(sentences.slice(i, i + 2).join(' '));
                    }
                  } else if (sentences.length > 0) {
                    paragraphs = [sentences.join(' ')];
                  } else {
                    paragraphs = [fullAvailableText];
                  }
                }

                return (
                  <div className={`news-body prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 ${getFontSizeClass()} space-y-4 sm:space-y-5 leading-relaxed font-normal h-auto min-h-0 overflow-visible`}>
                    {paragraphs.map((para, idx) => (
                      <p key={idx} className="text-slate-800 dark:text-slate-200 leading-relaxed text-base sm:text-lg">
                        {para}
                      </p>
                    ))}
                  </div>
                );
              })()}

              {/* Article Middle Ad */}
              <AdsterraSlot position="ARTICLE_MIDDLE" />

              {/* Tags Section */}
              {currentNews.tags && currentNews.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-600" />
                    {labels.tags}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentNews.tags
                      .filter(tag => tag && tag !== currentNews.sourceName && tag !== (currentNews as any).source && tag !== 'অনলাইন ডেস্ক')
                      .map(tag => (
                      <Link
                        key={tag}
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Social Share */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <SocialShare 
                  newsId={currentNews.id}
                  title={currentNews.title} 
                  summary={currentNews.summary} 
                  likeCount={engagement.likes}
                  shareCount={engagement.shares}
                />
              </div>

              {/* Article Bottom Ad */}
              <AdsterraSlot position="ARTICLE_BOTTOM" />

              {/* Author Bio Box (if manual author) */}
              {author && !currentNews.isAutoCollected && (
                <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <img
                    src={author.photo}
                    alt={author.banglaName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-500 shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {author.banglaName}
                    </h4>
                    <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">
                      {author.designation}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {author.bio}
                    </p>
                    <Link
                      to={`/author/${author.id}`}
                      className="inline-block mt-2 text-xs font-bold text-red-600 hover:underline"
                    >
                      {labels.authorArticles}
                    </Link>
                  </div>
                </div>
              )}
            </article>

            {/* Related News Section */}
            {relatedNews.length > 0 && (
              <section className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-red-600 pl-3">
                  {labels.relatedNews}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedNews.map(item => (
                    <NewsCard key={item.id} news={item} variant="grid" />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Sidebar Top Ad Slot */}
            <AdsterraSlot position="SIDEBAR_TOP" />

            {/* Latest News Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                {labels.latestNews}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                {latestNews.map(item => (
                  <NewsCard key={item.id} news={item} variant="compact" />
                ))}
              </div>
            </div>

            {/* Sidebar Middle Ad Slot */}
            <AdsterraSlot position="SIDEBAR_MIDDLE" />
          </aside>
        </div>
      </div>
    </div>
  );
};
