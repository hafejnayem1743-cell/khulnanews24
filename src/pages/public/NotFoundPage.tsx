import React from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '../../components/common/SeoHead';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SeoHead title="৪০৪ - পৃষ্ঠাটি খুঁজে পাওয়া যায়নি" />

      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/60 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
          <HelpCircle className="w-10 h-10" />
        </div>

        <h1 className="text-5xl font-black text-red-600 mb-2">৪০৪</h1>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
          দুঃখিত! খবরটি খুঁজে পাওয়া যায়নি।
        </h2>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          আপনি যে পাতা বা প্রতিবেদনটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটিতে কোনো ত্রুটি রয়েছে।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Home className="w-4 h-4" />
            প্রচ্ছদে ফিরে যান
          </Link>
          <Link
            to="/latest"
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            সর্বশেষ খবর
          </Link>
        </div>
      </div>
    </div>
  );
};
