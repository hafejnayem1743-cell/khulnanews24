import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { NewsCard } from '../../components/common/NewsCard';
import { SeoHead } from '../../components/common/SeoHead';
import { User, Mail, Facebook, Twitter, Award, ChevronRight } from 'lucide-react';

export const AuthorPage: React.FC = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const { authors, news } = useNews();

  const author = authors.find(a => a.id === authorId);

  const authorNews = news
    .filter(n => n.authorId === authorId && n.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (!author) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">লেখক প্রোফাইল পাওয়া যায়নি</h2>
        <Link to="/" className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold">প্রচ্ছদে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SeoHead
        title={`${author.banglaName} - লেখক ও সাংবাদিক প্রোফাইল`}
        description={author.bio}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-red-600">প্রচ্ছদ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>লেখক ও প্রতিনিধি</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-red-600 font-bold">{author.banglaName}</span>
        </div>

        {/* Author Profile Header Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
          <img
            src={author.photo}
            alt={author.banglaName}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-red-600 shadow-md shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              {author.banglaName}
            </h1>
            <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
              {author.designation}
            </p>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-3xl">
              {author.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              {author.email && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-red-500" /> {author.email}
                </span>
              )}
              {author.socialLinks?.facebook && (
                <a href={author.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold flex items-center gap-1">
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {author.socialLinks?.twitter && (
                <a href={author.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-sky-500 font-semibold flex items-center gap-1">
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Articles by this Author */}
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-red-600 pl-3">
          {author.banglaName}-এর প্রকাশিত সকল প্রতিবেদন ({authorNews.length})
        </h2>

        {authorNews.length === 0 ? (
          <p className="text-slate-500 text-sm">এই প্রতিবেদকের কোনো নিবন্ধ পাওয়া যায়নি।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorNews.map(item => (
              <NewsCard key={item.id} news={item} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
