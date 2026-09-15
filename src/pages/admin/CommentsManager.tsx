import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../../context/NewsContext';
import { 
  MessageSquareOff, ShieldCheck, ArrowLeft, Trash2, CheckCircle2 
} from 'lucide-react';

export const CommentsManager: React.FC = () => {
  const { comments, updateCommentsList, showToast } = useNews();

  const handleClearAll = () => {
    if (window.confirm('আপনি কি পূর্বের সংরক্ষিত সব মন্তব্য মুছে ফেলতে চান?')) {
      updateCommentsList([]);
      showToast('সকল মন্তব্য সফলভাবে মুছে ফেলা হয়েছে!', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Notice Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 shadow-xs text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
          <MessageSquareOff className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            পাঠক মন্তব্য অপশন সম্পূর্ণ নিষ্ক্রিয় রয়েছে
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
            সম্পাদকীয় নীতিমালা ও মোবাইল-ফার্স্ট অভিজ্ঞতা নিশ্চিত করতে সমগ্র খুলনা নিউজ ২৪ পোর্টাল থেকে পাবলিক মন্তব্য ফর্ম এবং তালিকা বন্ধ রাখা হয়েছে।
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-900">
          <ShieldCheck className="w-4 h-4" />
          <span>পাবলিক ওয়েবসাইটে মন্তব্য মডিউল বন্ধ রয়েছে</span>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/admin"
            className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            ড্যাশবোর্ডে ফিরে যান
          </Link>

          {comments.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              পূর্বের সংরক্ষিত {comments.length}টি মন্তব্য মুছে ফেলুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
