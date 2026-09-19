import React, { useEffect, useMemo, useState } from 'react';
import {
  Facebook, Send, Twitter, Link as LinkIcon,
  Printer, Check, Share2, MessageCircle, Heart, Instagram
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';
import { useActiveLanguage } from '../../services/language';

interface SocialShareProps {
  newsId?: string;
  url?: string;
  title: string;
  summary?: string;
  image?: string;
  likeCount?: number;
  shareCount?: number;
  onFontSizeChange?: (delta: number) => void;
  fontSize?: number;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  newsId,
  url,
  title,
  summary = '',
  image = '',
  likeCount,
  shareCount,
  onFontSizeChange,
}) => {
  const { showToast, incrementNewsLike, incrementNewsShare } = useNews();
  const { labels, formatMetric } = useActiveLanguage();
  const baseLikes = Number.isFinite(likeCount) && (likeCount || 0) > 0 ? (likeCount as number) : 0;
  const baseShares = Number.isFinite(shareCount) && (shareCount || 0) > 0 ? (shareCount as number) : 0;
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(baseLikes);
  const [localShares, setLocalShares] = useState(baseShares);

  const shareUrl = useMemo(() => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [url]);

  useEffect(() => {
    setLocalLikes(baseLikes);
    setLocalShares(baseShares);
    setLiked(false);
  }, [newsId, baseLikes, baseShares]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary || title);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLocalLikes(prev => prev + 1);
    if (newsId) incrementNewsLike(newsId);
    showToast(labels.liked || labels.like, 'success');
  };

  const handleShareTrigger = () => {
    setLocalShares(prev => prev + 1);
    if (newsId) incrementNewsShare(newsId);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast(labels.linkCopied || 'লিংক কপি হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 2500);
      return true;
    } catch {
      showToast(labels.copyLink || 'লিংক কপি করুন', 'error');
      return false;
    }
  };

  const handleCopy = async () => {
    const ok = await copyUrl();
    if (ok) handleShareTrigger();
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      // Where supported, share the actual article image as a file so the
      // operating system can pass image + headline + URL to compatible apps.
      if (image && navigator.canShare) {
        try {
          const response = await fetch(image, { mode: 'cors', cache: 'force-cache' });
          if (response.ok) {
            const blob = await response.blob();
            const extension = blob.type.split('/')[1] || 'jpg';
            const file = new File([blob], `khulna-news-${newsId || 'article'}.${extension}`, { type: blob.type || 'image/jpeg' });
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({ title, text: summary || title, url: shareUrl, files: [file] });
              handleShareTrigger();
              return;
            }
          }
        } catch {
          // Fall back to the standard Web Share payload below.
        }
      }

      await navigator.share({ title, text: summary || title, url: shareUrl });
      handleShareTrigger();
    } catch {
      // User cancelled the share sheet.
    }
  };

  const handleInstagram = async () => {
    const ok = await copyUrl();
    if (ok) {
      handleShareTrigger();
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      showToast(labels.copyLink || 'Link copied', 'info');
    }
  };

  const handlePrint = () => window.print();


  return (
    <div className="social-share-bar flex flex-col gap-3 py-3 px-3 sm:px-4 bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 my-4 shadow-sm backdrop-blur">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleLike}
            className={`group inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm ${liked
              ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:text-rose-600'}
            `}
            title={labels.like}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current text-white' : 'text-rose-500'} transition-transform group-hover:scale-110`} />
            <span>{liked ? labels.liked : labels.like}</span>
            <span className="px-1.5 py-0.5 rounded-lg bg-white/70 dark:bg-black/20 text-[10px] font-black">{formatMetric(localLikes)}</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
            <Share2 className="w-3.5 h-3.5 text-red-600" />
            {labels.share} · {formatMetric(localShares)}
          </span>

          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" onClick={handleShareTrigger} className="share-btn share-btn-facebook" title="Share on Facebook">
            <Facebook className="w-4 h-4" /><span className="hidden sm:inline">{labels.facebook}</span>
          </a>

          <a href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" onClick={handleShareTrigger} className="share-btn share-btn-whatsapp" title="Share on WhatsApp">
            <MessageCircle className="w-4 h-4" /><span className="hidden sm:inline">{labels.whatsapp}</span>
          </a>

          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" onClick={handleShareTrigger} className="share-btn share-btn-telegram" title="Share on Telegram">
            <Send className="w-4 h-4" /><span className="hidden sm:inline">{labels.telegram}</span>
          </a>

          <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" onClick={handleShareTrigger} className="share-btn share-btn-x" title="Share on X">
            <Twitter className="w-4 h-4" /><span className="hidden sm:inline">X</span>
          </a>

          <button onClick={handleInstagram} className="share-btn share-btn-instagram" title="Share on Instagram">
            <Instagram className="w-4 h-4" /><span className="hidden sm:inline">Instagram</span>
          </button>

          <button onClick={handleNativeShare} className="share-btn share-btn-native" title={labels.share}>
            <Share2 className="w-4 h-4" /><span className="hidden sm:inline">{labels.share}</span>
          </button>

          <button onClick={handleCopy} className="share-btn share-btn-copy" title={labels.copyLink}>
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? labels.copied : labels.copy}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end xl:self-auto">
          {onFontSizeChange && (
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <button onClick={() => onFontSizeChange(-1)} className="px-2.5 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg">A−</button>
              <button onClick={() => onFontSizeChange(0)} className="px-2.5 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg">A</button>
              <button onClick={() => onFontSizeChange(1)} className="px-2.5 py-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg">A+</button>
            </div>
          )}
          <button onClick={handlePrint} className="share-btn share-btn-print" title={labels.print}>
            <Printer className="w-4 h-4" /><span className="hidden sm:inline">{labels.print}</span>
          </button>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
        {labels.shareArticle || labels.share}
      </p>
    </div>
  );
};
