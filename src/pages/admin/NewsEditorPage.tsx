import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { NewsItem, NewsStatus } from '../../types';
import { toBanglaNumber, formatBanglaDate } from '../../services/seo';
import { 
  Save, Eye, ArrowLeft, Image as ImageIcon, Sparkles, 
  Tag, Globe, Search, Bold, Italic, Underline, Strikethrough,
  Heading2, Heading3, Quote, List, ListOrdered, Link as LinkIcon, 
  CheckCircle2, Upload, HelpCircle, Radio, Star, TrendingUp,
  Youtube, Table, AlignLeft, AlignCenter, AlignRight, FileText,
  Clock, Calendar, AlertCircle, RefreshCw
} from 'lucide-react';

export const NewsEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { news, categories, authors, addNews, updateNews, showToast } = useNews();

  const isEditing = Boolean(id);
  const existingNews = isEditing ? news.find(n => n.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // District & Source Attribution
  const [district, setDistrict] = useState('খুলনা');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isAutoCollected, setIsAutoCollected] = useState(false);

  // Flags & Status
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTopNews, setIsTopNews] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isRealEngagement, setIsRealEngagement] = useState(false);
  const [status, setStatus] = useState<NewsStatus>('published');
  const [scheduledAt, setScheduledAt] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Tabs & Preview
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo'>('editor');
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load existing data or draft
  useEffect(() => {
    if (existingNews) {
      setTitle(existingNews.title || '');
      setSubTitle(existingNews.subTitle || '');
      setSlug(existingNews.slug || '');
      setCategoryId(existingNews.categoryId || categories[0]?.id || '');
      setSubCategoryId(existingNews.subCategoryId || '');
      setAuthorId(existingNews.authorId || authors[0]?.id || '');
      setContent(existingNews.content || '');
      setSummary(existingNews.summary || '');
      setFeaturedImage(existingNews.featuredImage || '');
      setImageCaption(existingNews.imageCaption || '');
      setImageCredit(existingNews.imageCredit || '');
      setTags(existingNews.tags || []);
      setIsBreaking(Boolean(existingNews.isBreaking));
      setIsFeatured(Boolean(existingNews.isFeatured));
      setIsTopNews(Boolean(existingNews.isTopNews));
      setIsTrending(Boolean(existingNews.isTrending));
      setIsRealEngagement(Boolean(existingNews.isRealEngagement));
      setDistrict(existingNews.district || 'খুলনা');
      setSourceName(existingNews.sourceName || '');
      setSourceUrl(existingNews.sourceUrl || '');
      setIsAutoCollected(Boolean(existingNews.isAutoCollected));
      setStatus(existingNews.status || 'published');
      setScheduledAt(existingNews.scheduledAt || '');
      setSeoTitle(existingNews.seo?.seoTitle || '');
      setMetaDescription(existingNews.seo?.metaDescription || '');
      setFocusKeyword(existingNews.seo?.focusKeywords?.[0] || '');
      setCanonicalUrl(existingNews.seo?.canonicalUrl || '');
    } else {
      // Check local storage for recovered draft
      const draftKey = 'khulna_news_wip_draft';
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title || parsed.content) {
            setTitle(parsed.title || '');
            setContent(parsed.content || '');
            setSummary(parsed.summary || '');
            setSlug(parsed.slug || '');
            setCategoryId(parsed.categoryId || categories[0]?.id || '');
            setFeaturedImage(parsed.featuredImage || '');
          }
        } catch (e) {
          console.error(e);
        }
      }

      if (categories.length > 0 && !categoryId) setCategoryId(categories[0].id);
      if (authors.length > 0 && !authorId) setAuthorId(authors[0].id);
      if (!featuredImage) {
        setFeaturedImage('https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80');
      }
    }
  }, [existingNews, categories, authors]);

  // Auto-Save Draft to LocalStorage every 20 seconds
  useEffect(() => {
    if (!isEditing) {
      autoSaveTimerRef.current = setInterval(() => {
        if (title.trim() || content.trim()) {
          const draftObj = {
            title,
            slug,
            categoryId,
            content,
            summary,
            featuredImage,
            savedAt: new Date().toLocaleTimeString('bn-BD')
          };
          localStorage.setItem('khulna_news_wip_draft', JSON.stringify(draftObj));
          setLastAutoSaved(draftObj.savedAt);
        }
      }, 20000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [title, slug, categoryId, content, summary, featuredImage, isEditing]);

  // Selected category object
  const currentCategory = categories.find(c => c.id === categoryId);
  const currentAuthor = authors.find(a => a.id === authorId);

  // Auto-generate Slug on Title input
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[\s,\.\?\!\:\;\"\'\(\)]+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
      setSlug(generated || `news-${Date.now().toString().slice(-6)}`);
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  // Tag Add / Remove
  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagsInput.trim()) {
      e.preventDefault();
      const cleanTag = tagsInput.replace(/,/g, '').trim();
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagsInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFeaturedImage(reader.result as string);
          showToast('ছবি সফলভাবে যুক্ত হয়েছে!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Content Toolbar Textarea Insertions
  const insertContentTag = (openTag: string, closeTag: string, placeholder = 'এখানে টেক্সট লিখুন') => {
    const textarea = document.getElementById('news-content-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;
    const replacement = `${openTag}${selectedText}${closeTag}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + openTag.length, start + openTag.length + selectedText.length);
    }, 50);
  };

  const insertLinkPrompt = () => {
    const url = prompt('ওয়েব লিংক URL প্রদান করুন:', 'https://');
    if (url) {
      insertContentTag(`<a href="${url}" class="text-red-600 underline" target="_blank">`, '</a>', 'সংযুক্ত লিংক টেক্সট');
    }
  };

  const insertImagePrompt = () => {
    const url = prompt('ছবির সরাসরি Image URL প্রদান করুন:', 'https://images.unsplash.com/...');
    if (url) {
      const caption = prompt('ছবির ক্যাপশন লিখুন (ঐচ্ছিক):', '');
      const imgBlock = `\n<figure class="my-4"><img src="${url}" alt="${caption || 'চিত্র'}" class="w-full rounded-xl object-cover" />${caption ? `<figcaption class="text-xs text-slate-500 mt-1 text-center italic">${caption}</figcaption>` : ''}</figure>\n`;
      setContent(prev => prev + imgBlock);
    }
  };

  const insertYoutubePrompt = () => {
    const url = prompt('YouTube ভিডিও লিংক বা Embed ID প্রদান করুন:', 'https://www.youtube.com/watch?v=...');
    if (url) {
      let videoId = url;
      if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      const embedCode = `\n<div class="my-4 aspect-video rounded-xl overflow-hidden shadow-md"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>\n`;
      setContent(prev => prev + embedCode);
    }
  };

  const insertTableTemplate = () => {
    const tableCode = `\n<div class="overflow-x-auto my-4"><table class="w-full text-xs border border-slate-200"><thead class="bg-slate-100"><tr><th class="p-2 border">বিবরণ</th><th class="p-2 border">তথ্য / পরিসংখ্যান</th></tr></thead><tbody><tr><td class="p-2 border">শিরোনাম ১</td><td class="p-2 border">মান ১</td></tr><tr><td class="p-2 border">শিরোনাম ২</td><td class="p-2 border">মান ২</td></tr></tbody></table></div>\n`;
    setContent(prev => prev + tableCode);
  };

  // Submit Handler
  const handleSubmit = (targetStatus: NewsStatus = status) => {
    if (!title.trim()) {
      showToast('সংবাদের শিরোনাম আবশ্যক!', 'error');
      return;
    }
    if (!content.trim()) {
      showToast('সংবাদের মূল বিবরণ আবশ্যক!', 'error');
      return;
    }

    const categoryObj = categories.find(c => c.id === categoryId) || categories[0];
    const authorObj = authors.find(a => a.id === authorId) || authors[0];

    const newsData: NewsItem = {
      id: existingNews?.id || `news-${Date.now()}`,
      title: title.trim(),
      subTitle: subTitle.trim(),
      slug: slug.trim() || `news-${Date.now()}`,
      content: content.trim(),
      summary: summary.trim() || title.trim().slice(0, 160),
      featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?w=1200&auto=format&fit=crop&q=80',
      imageCaption: imageCaption.trim(),
      imageCredit: imageCredit.trim(),
      categoryId: categoryObj?.id || 'cat-khulna',
      subCategoryId: subCategoryId || undefined,
      categoryName: categoryObj?.name || 'খুলনা',
      authorId: authorObj?.id || 'author-1',
      authorName: authorObj?.banglaName || authorObj?.name || 'নিজস্ব প্রতিবেদক',
      authorPhoto: authorObj?.photo,
      status: targetStatus,
      isFeatured,
      isTopNews,
      isBreaking,
      isTrending,
      priority: existingNews?.priority || 1,
      viewCount: existingNews?.viewCount || (35000 + Math.floor(Math.random() * 42000)),
      likeCount: existingNews?.likeCount || (2600 + Math.floor(Math.random() * 3200)),
      shareCount: existingNews?.shareCount || (1150 + Math.floor(Math.random() * 1800)),
      tags: tags.length > 0 ? tags : [categoryObj?.name || 'খুলনা'],
      publishedAt: existingNews?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledAt: scheduledAt || undefined,
      seo: {
        seoTitle: seoTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || summary.trim() || title.trim(),
        focusKeywords: focusKeyword ? [focusKeyword.trim()] : tags,
        canonicalUrl: canonicalUrl.trim() || undefined
      },
      allowComments: false,
      isRealEngagement,
      district: district ? (district as any) : undefined,
      sourceName: sourceName.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      isAutoCollected,
      guid: existingNews?.guid
    };

    if (isEditing) {
      updateNews(newsData.id, newsData);
    } else {
      addNews(newsData);
      localStorage.removeItem('khulna_news_wip_draft');
    }

    navigate('/admin/news');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/news"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-500"
            title="সংবাদ তালিকায় ফিরুন"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? 'সংবাদ সম্পাদনা করুন' : 'নতুন সংবাদ তৈরি ও প্রকাশ'}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
              <span>{isEditing ? `আইডি: ${existingNews?.id}` : 'খুলনা নিউজ প্রফেশনাল এডিটর'}</span>
              {lastAutoSaved && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    স্বয়ংক্রিয় সংরক্ষণ: {lastAutoSaved}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            ড্রাফট সংরক্ষণ
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'আপডেট করুন' : 'সংবাদ প্রকাশ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Switch Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'editor'
              ? 'border-red-600 text-red-600 bg-white dark:bg-slate-900 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>এডিটর মোড</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'preview'
              ? 'border-red-600 text-red-600 bg-white dark:bg-slate-900 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>লাইভ প্রিভিউ</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'seo'
              ? 'border-red-600 text-red-600 bg-white dark:bg-slate-900 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>এসইও ও মেটাডাটা</span>
        </button>
      </div>

      {/* LIVE PREVIEW TAB */}
      {activeTab === 'preview' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded">
              {currentCategory?.name || 'খুলনা'}
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-3 leading-tight">
              {title || 'এখানে সংবাদের প্রধান শিরোনাম দৃশ্যমান হবে'}
            </h1>
            {subTitle && (
              <h2 className="text-sm font-semibold text-slate-500 mt-2">
                {subTitle}
              </h2>
            )}
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-3">
              <span>প্রতিবেদক: <strong className="text-slate-800 dark:text-slate-200">{currentAuthor?.banglaName || 'নিজস্ব প্রতিবেদক'}</strong></span>
              <span>•</span>
              <span>{formatBanglaDate(new Date().toISOString())}</span>
            </div>
          </div>

          {featuredImage && (
            <figure>
              <img src={featuredImage} alt={title} className="w-full max-h-96 object-cover rounded-xl" />
              {imageCaption && (
                <figcaption className="text-xs text-slate-500 mt-1.5 text-center italic">
                  {imageCaption} {imageCredit ? `(ছবি: ${imageCredit})` : ''}
                </figcaption>
              )}
            </figure>
          )}

          {summary && (
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-red-600 pl-3 py-1 bg-slate-50 dark:bg-slate-800/40 rounded-r-lg">
              {summary}
            </p>
          )}

          <div
            className="rich-text-content text-slate-800 dark:text-slate-200 space-y-4"
            dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-400 italic">সংবাদের কোনো বিবরণ লেখা হয়নি।</p>' }}
          />

          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">ট্যাগ:</span>
              {tags.map((t, idx) => (
                <span key={idx} className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEO TAB */}
      {activeTab === 'seo' && (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">গুগল সার্চ স্নsnippet প্রিভিউ</h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-left">
              <span className="text-xs text-slate-500 font-mono">https://khulnanews.com/news/{slug}</span>
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 hover:underline mt-0.5">
                {seoTitle || title || 'সংবাদ শিরোনাম | খুলনা নিউজ'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {metaDescription || summary || 'সংবাদের মেটা ডেসক্রিপশন গুগল সার্চে এমনভাবে দৃশ্যমান হবে...'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">এসইও টাইটেল (SEO Title)</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Google Search Title"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">ফোকাস কিওয়ার্ড (Focus Keyword)</label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="যেমন: খুলনা রেললাইন, মোংলা বন্দর"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">মেটা ডেসক্রিপশন (Meta Description - Max 160 Characters)</label>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="সার্চ ইঞ্জিনের জন্য সংক্ষিপ্ত সারসংক্ষেপ..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
            <span className="text-[10px] text-slate-400">{metaDescription.length} / ১৬০ অক্ষর</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">ক্যানোনিকাল URL (ঐচ্ছিক)</label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://khulnanews.com/news/canonical-slug"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
            />
          </div>
        </div>
      )}

      {/* MAIN EDITOR FORM */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Subtitle */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  সংবাদের প্রধান শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="আকর্ষণীয় ও তথ্যবহুল শিরোনাম লিখুন..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm md:text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  উপ-শিরোনাম (Sub Title / Shoulder)
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="উপ-শিরোনাম লিখুন (ঐচ্ছিক)..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  URL স্লাগ (Permanent Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="khulna-mongla-rail-track"
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-300"
                />
              </div>
            </div>

            {/* Rich Content Editor */}
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                সংবাদের মূল বিবরণ ও বডি <span className="text-red-500">*</span>
              </label>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => insertContentTag('<strong>', '</strong>', 'বোল্ড টেক্সট')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<em>', '</em>', 'ইটালিক টেক্সট')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<u>', '</u>', 'আন্ডারলাইন টেক্সট')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<s>', '</s>', 'কাটা টেক্সট')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={() => insertContentTag('<h2>', '</h2>', 'উপ-শিরোনাম H2')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<h3>', '</h3>', 'শিরোনাম H3')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<blockquote>', '</blockquote>', 'উদ্ধৃতি বা গুরুত্বপূর্ণ বক্তব্য')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={() => insertContentTag('<ul>\n  <li>', '</li>\n</ul>', 'তালিকা আইটেম')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertContentTag('<ol>\n  <li>', '</li>\n</ol>', 'ক্রমিক তালিকা')}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

                <button
                  type="button"
                  onClick={insertLinkPrompt}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Insert Hyperlink"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertImagePrompt}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Insert Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertYoutubePrompt}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Insert YouTube Video"
                >
                  <Youtube className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={insertTableTemplate}
                  className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors text-slate-700 dark:text-slate-300"
                  title="Insert Table"
                >
                  <Table className="w-4 h-4" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="news-content-textarea"
                rows={14}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="এখানে সম্পূর্ণ সংবাদের বিস্তারিত অনুচ্ছেদ লিখুন..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-sans"
              />

              {/* Summary / Lead */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত সারসংক্ষেপ (Lead / Summary)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="হোমপেজে কার্ডে প্রদর্শনের জন্য ২ লাইনের সারসংক্ষেপ..."
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Sidebar 1 Col: Metadata, Category, Image, Flags */}
          <div className="space-y-6">
            {/* Publishing & Category */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">প্রকাশনা ও বিভাগ</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">সংবাদ বিভাগ</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">প্রতিবেদক / লেখক</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  {authors.map(a => (
                    <option key={a.id} value={a.id}>{a.banglaName || a.name} ({a.designation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  জেলা (খুলনা বিভাগ - ১০টি জেলা)
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="খুলনা">খুলনা জেলা</option>
                  <option value="বাগেরহাট">বাগেরহাট জেলা</option>
                  <option value="সাতক্ষীরা">সাতক্ষীরা জেলা</option>
                  <option value="যশোর">যশোর জেলা</option>
                  <option value="নড়াইল">নড়াইল জেলা</option>
                  <option value="ঝিনাইদহ">ঝিনাইদহ জেলা</option>
                  <option value="মাগুরা">মাগুরা জেলা</option>
                  <option value="কুষ্টিয়া">কুষ্টিয়া জেলা</option>
                  <option value="চুয়াডাঙ্গা">চুয়াডাঙ্গা জেলা</option>
                  <option value="মেহেরপুর">মেহেরপুর জেলা</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সোর্স মাধ্যম (ঐচ্ছিক / অটো সোর্স)
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="যেমন: প্রথম আলো / বার্তা সংস্থা"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সোর্স ওয়েব লিংক (ঐচ্ছিক)
                </label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NewsStatus)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                >
                  <option value="published">প্রকাশিত (Published)</option>
                  <option value="draft">ড্রাফট (Draft)</option>
                  <option value="scheduled">শিডিউল প্রকাশ (Scheduled)</option>
                  <option value="archived">আর্কাইভ (Archived)</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">শিডিউল সময়</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ফিচার্ড ছবি</h3>

              {featuredImage && (
                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800">
                  <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেজ URL</label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">অথবা ফাইল আপলোড করুন</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ছবির ক্যাপশন</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="ছবির বর্ণনা..."
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ফটোগ্রাফার / ক্রেডিট</label>
                <input
                  type="text"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  placeholder="খুলনা নিউজ / রয়টার্স"
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Promotion Badges & Flags */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">গুরুত্ব ও হাইলাইট</h3>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="text-red-600 font-bold">🔴 ব্রেকিং নিউজ (টিকার ও টপ ব্যানার)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-amber-600 font-bold">⭐ প্রধান ফিচার্ড সংবাদ</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="text-blue-600 font-bold">🔥 ট্রেন্ডিং খবর</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={isRealEngagement}
                  onChange={(e) => setIsRealEngagement(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">বাস্তব এনগেজমেন্ট (ডেমো ভিউ বুস্টিং ছাড়া)</span>
              </label>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">ট্যাগ ও কিওয়ার্ড</h3>
              
              <div className="flex gap-1.5 flex-wrap">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="ট্যাগ লিখে Enter বা কমা দিন..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
