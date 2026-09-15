import React, { useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { 
  Database, Download, Upload, RefreshCw, 
  CheckCircle2, AlertTriangle, ShieldCheck, FileJson 
} from 'lucide-react';

export const BackupPage: React.FC = () => {
  const { exportBackup, importBackup, resetToDefault, showToast, news, categories, media } = useNews();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khulna-news-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ডাটাবেজ ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const content = ev.target?.result as string;
          const success = importBackup(content);
          if (success) {
            showToast('ডাটাবেজ ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!', 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            showToast('অবৈধ বা ত্রুটিপূর্ণ ব্যাকআপ ফাইল।', 'error');
          }
        } catch {
          showToast('ফাইল প্রক্রিয়াকরণে ত্রুটি হয়েছে।', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিত যে সমস্ত কাস্টম সংবাদ ও সেটিংস মুছে ডিফল্ট ডেমো ডাটায় রিসেট করতে চান?')) {
      resetToDefault();
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-red-600" />
          ডাটাবেজ ব্যাকআপ ও রিস্টোর
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          ওয়েবসাইটের সমস্ত সংবাদ, ক্যাটাগরি, মিডিয়া ও সেটিংস নিরাপদে ব্যাকআপ এবং সংরক্ষণ করুন
        </p>
      </div>

      {/* Backup Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              সম্পূর্ণ ওয়েবসাইট ডাটা ডাউনলোড করুন (Export JSON)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              একটি ক্লিকে সমস্ত সংবাদ ({news.length} টি), ক্যাটাগরি ({categories.length} টি), মিডিয়া ফাইল ({media.length} টি), বিজ্ঞাপন স্লট ও সাইট সেটিংস সমন্বিত একটি নিরাপদ JSON ফাইল ডাউনলোড হবে।
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadBackup}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <FileJson className="w-4 h-4" />
          <span>সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড করুন</span>
        </button>
      </div>

      {/* Restore Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              ব্যাকআপ ফাইল থেকে রিস্টোর করুন (Import JSON)
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              পূর্বে ডাউনলোডকৃত JSON ব্যাকআপ ফাইল নির্বাচন করে মুহূর্তেই আপনার সমস্ত সংবাদ ও সেটিংস পূর্বাবস্থায় ফিরিয়ে আনুন।
            </p>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>JSON ব্যাকআপ ফাইল নির্বাচন ও রিস্টোর</span>
        </button>
      </div>

      {/* Reset to Factory Defaults */}
      <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-2xl border border-red-200 dark:border-red-900/40 shadow-xs space-y-3">
        <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold">ফ্যাক্টরি রিসেট ও ডিফল্ট ডাটা</h2>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1">
              এটি ব্যবহারের মাধ্যমে কাস্টম পরিবর্তনগুলো মুছে খুলনা নিউজের ডিফল্ট সংবাদ কাঠামোতে পোর্টালটি ফিরে যাবে।
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          ডিফল্ট ডাটাতে রিসেট করুন
        </button>
      </div>
    </div>
  );
};
