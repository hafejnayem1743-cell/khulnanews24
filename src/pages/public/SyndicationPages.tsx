import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { generateRssFeedXml, generateSitemapXml, generateRobotsTxt } from '../../services/seo';
import { SeoHead } from '../../components/common/SeoHead';
import { Copy, Download, Check, ArrowLeft, Rss, Globe } from 'lucide-react';

export const SyndicationPages: React.FC = () => {
  const location = useLocation();
  const { news, categories, siteSettings, showToast } = useNews();
  const [copied, setCopied] = useState(false);

  const isRss = location.pathname.includes('rss');
  const isSitemap = location.pathname.includes('sitemap');

  let content = '';
  let title = '';
  let filename = '';
  let mimeType = 'text/xml';

  if (isRss) {
    content = generateRssFeedXml(news, siteSettings);
    title = 'RSS 2.0 Feed';
    filename = 'rss.xml';
  } else if (isSitemap) {
    content = generateSitemapXml(news, categories);
    title = 'XML Sitemap';
    filename = 'sitemap.xml';
  } else {
    content = generateRobotsTxt();
    title = 'robots.txt';
    filename = 'robots.txt';
    mimeType = 'text/plain';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    showToast(`${title} কপি করা হয়েছে!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${filename} ডাউনলোড শুরু হয়েছে!`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">
      <SeoHead title={title} />

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600">
              {isRss ? <Rss className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
              <p className="text-xs text-slate-500 font-mono">/{filename}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'কপি হয়েছে' : 'কপি করুন'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              ফাইল ডাউনলোড
            </button>
            <Link
              to="/"
              className="px-3 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-[600px] leading-relaxed select-all">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
};
