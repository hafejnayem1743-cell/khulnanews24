import React from 'react';
import { useNews } from '../../context/NewsContext';
import { formatBanglaDate } from '../../services/seo';
import { Trash2, RotateCcw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TrashPage: React.FC = () => {
  const { news, restoreFromTrash, permanentDeleteNews, showToast } = useNews();
  const trashItems = news.filter(n => n.status === 'trash');

  const handleEmptyTrash = () => {
    if (trashItems.length === 0) return;
    if (window.confirm('আপনি কি নিশ্চিত যে ট্র্যাশের সমস্ত সংবাদ স্থায়ীভাবে মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না!')) {
      trashItems.forEach(item => permanentDeleteNews(item.id));
      showToast('ট্র্যাশ খালি করা হয়েছে!', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-600" />
            মুছে ফেলা সংবাদ (Trash Bin)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ট্র্যাশে থাকা সংবাদ পুনরুদ্ধার করুন অথবা স্থায়ীভাবে ডিলিট করুন
          </p>
        </div>

        {trashItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>ট্র্যাশ সম্পূর্ণ খালি করুন</span>
          </button>
        )}
      </div>

      {trashItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-xs">
          <Trash2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">ট্র্যাশ বিন বর্তমানে খালি</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            কোনো সংবাদ মুছে ফেলা হলে তা এখানে জমা হবে। আপনি চাইলে তা রিস্টোর করতে পারেন।
          </p>
          <Link
            to="/admin/news"
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সংবাদ তালিকায় ফিরুন</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {trashItems.map(item => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-16 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {item.categoryName} • সর্বশেষ আপডেট: {formatBanglaDate(item.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => restoreFromTrash(item.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="ড্রাফট হিসেবে পুনরুদ্ধার"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরুদ্ধার</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('আপনি কি নিশ্চিত যে এই সংবাদটি চিরতরে মুছে ফেলতে চান?')) {
                        permanentDeleteNews(item.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="স্থায়ীভাবে মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>স্থায়ী মুছুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
