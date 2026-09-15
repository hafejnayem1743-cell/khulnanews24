import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  Facebook, Send, Twitter, Link as LinkIcon, 
  Printer, Check, Share2, MessageCircle, Heart 
} from 'lucide-react';
import { useActiveLanguage } from '../../services/language';

interface SocialShareProps {
  newsId?: string;
  url?: string;
  title: string;
  summary?: string;
  likeCount?: number;
  shareCount?: number;
  onFontSizeChange?: (delta: number) => void;
  fontSize?: number;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  newsId,
  url = window.location.href,
  title,
  summary = '',
  likeCount,
  shareCount,
  onFontSizeChange,
  fontSize
}) => {
  const { showToast, incrementNewsLike, incrementNewsShare } = useNews();
  const { labels, formatMetric } = useActiveLanguage();
  const baseLikes = Number.isFinite(likeCount) && (likeCount || 0) > 0 ? (likeCount as number) : 0;
  const baseShares = Number.isFinite(shareCount) && (shareCount || 0) > 0 ? (shareCount as number) : 0;
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(baseLikes);
  const [localShares, setLocalShares] = useState(baseShares);

  React.useEffect(() => {
    setLocalLikes(baseLikes);
    setLocalShares(baseShares);
    setLiked(false);
  }, [newsId, baseLikes, baseShares]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedSummary = encodeURIComponent(summary);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setLocalLikes(prev => prev + 1);
    if (newsId) {
      incrementNewsLike(newsId);
    }
    showToast('এই সংবাদটি আপনার পছন্দ হয়েছে!', 'success');
  };

  const handleShareTrigger = () => {
    setLocalShares(prev => prev + 1);
    if (newsId) {
      incrementNewsShare(newsId);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      handleShareTrigger();
      showToast('সংবাদের লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('লিংক কপি করতে ব্যর্থ হয়েছে।', 'error');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url
        });
        handleShareTrigger();
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="social-share-bar flex flex-wrap items-center justify-between gap-3 py-3 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 my-4">
      {/* Interactive Like & Share Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs ${
            liked 
              ? 'bg-rose-600 text-white shadow-rose-200 dark:shadow-none' 
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:text-rose-600'
          }`}
          title={labels.like}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current text-white scale-110' : 'text-rose-500'} transition-transform`} />
          <span>{liked ? labels.liked : labels.like}</span>
          <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded text-[11px] font-extrabold ml-0.5">
            {formatMetric(localLikes)}
          </span>
        </button>

        <span className="hidden sm:inline-block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></span>

        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Share2 className="w-3.5 h-3.5 text-red-600" />
          {labels.share} ({formatMetric(localShares)}):
        </span>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareTrigger}
          className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-semibold shadow-xs"
          title="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.facebook}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareTrigger}
          className="p-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-semibold shadow-xs"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.whatsapp}</span>
        </a>

        {/* Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareTrigger}
          className="p-2 bg-[#229ED9] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-semibold shadow-xs"
          title="Share on Telegram"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.telegram}</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleShareTrigger}
          className="p-2 bg-black dark:bg-slate-950 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-semibold shadow-xs"
          title="Share on X"
        >
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline">X</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
          title={labels.copy}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? labels.copied : labels.copy}</span>
        </button>

        {/* Native share for mobile */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="sm:hidden p-2 bg-red-600 text-white rounded-lg text-xs font-semibold"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Utility Actions: Font Resizer & Print */}
      <div className="flex items-center gap-2">
        {onFontSizeChange && (
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => onFontSizeChange(-1)}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="px-1 text-slate-400">|</span>
            <button
              onClick={() => onFontSizeChange(0)}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Default Font Size"
            >
              A
            </button>
            <span className="px-1 text-slate-400">|</span>
            <button
              onClick={() => onFontSizeChange(1)}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        )}

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Print Article"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden sm:inline">{labels.print}</span>
        </button>
      </div>
    </div>
  );
};
