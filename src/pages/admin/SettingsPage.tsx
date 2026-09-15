import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { SiteSettings } from '../../types';
import { 
  Settings, Save, Globe, Phone, Mail, MapPin, 
  Facebook, Youtube, Send, Twitter, Download, 
  Upload, RefreshCw, Shield, Database, CheckCircle2 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { siteSettings, updateSettings, exportBackup, importBackup, resetToDefault, showToast } = useNews();
  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo' | 'backup'>('general');

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('সকল সেটিংস সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!', 'success');
  };

  const handleExport = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khulna-news-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('সম্পূর্ণ ওয়েবসাইট ব্যাকআপ ডাউনলোড হয়েছে!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const content = ev.target?.result as string;
          const success = importBackup(content);
          if (success) {
            showToast('ব্যাকআপ সফলভাবে রিস্টোর করা হয়েছে!', 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            showToast('অবৈধ ব্যাকআপ ফাইল।', 'error');
          }
        } catch {
          showToast('ফাইল পার্স করতে ত্রুটি হয়েছে।', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল তথ্য রিসেট করে ডিফল্ট ডেমো ডাটায় ফিরিয়ে নিতে চান?')) {
      resetToDefault();
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            পোর্টাল সেটিংস ও ডাটাবেজ ব্যাকআপ
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সাইটের সাধারণ তথ্য, সোশ্যাল লিংক, এসইও কনফিগারেশন ও ব্যাকআপ ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'general', label: 'সাধারণ তথ্য', icon: Globe },
          { id: 'contact', label: 'যোগাযোগ ও ঠিকানা', icon: Phone },
          { id: 'social', label: 'সোশ্যাল মিডিয়া', icon: Facebook },
          { id: 'seo', label: 'ডিফল্ট এসইও', icon: Shield },
          { id: 'backup', label: 'ডাটা ব্যাকআপ ও রিস্টোর', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                active 
                  ? 'border-red-600 text-red-600 bg-white dark:bg-slate-900' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Form Container */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ওয়েবসাইটের বাংলা নাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.websiteName}
                  onChange={(e) => handleChange('websiteName', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইংরেজি ব্র্যান্ড নাম (English Brand Name)
                </label>
                <input
                  type="text"
                  value={formData.englishBrandName}
                  onChange={(e) => handleChange('englishBrandName', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ট্যাগলাইন (Tagline) *
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রধান সম্পাদক (Editor-in-Chief)
                </label>
                <input
                  type="text"
                  value={formData.editorName}
                  onChange={(e) => handleChange('editorName', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রকাশক (Publisher)
                </label>
                <input
                  type="text"
                  value={formData.publisherName}
                  onChange={(e) => handleChange('publisherName', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ফুটার পরিচিতি টেক্সট (Footer About Text)
              </label>
              <textarea
                rows={3}
                value={formData.footerAbout}
                onChange={(e) => handleChange('footerAbout', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                কপিরাইট টেক্সট (Copyright Text)
              </label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        )}

        {/* 2. CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ফোন নম্বর / হটলাইন (Phone)
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="01306721743"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  হোয়াটসঅ্যাপ নম্বর (WhatsApp)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="01907655994"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অফিসিয়াল ইমেইল (Email)
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="worldbusiness677@gmail.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                প্রধান কার্যালয়ের ঠিকানা (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="অফিস ঠিকানা (খালি থাকলে প্রদর্শিত হবে না)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* 3. SOCIAL TAB */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                ফেসবুক পেজ লিংক (Facebook URL)
              </label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-600" />
                ইউটিউব চ্যানেল লিংক (YouTube URL)
              </label>
              <input
                type="text"
                value={formData.youtubeUrl}
                onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-500" />
                টেলিগ্রাম চ্যানেল লিংক (Telegram URL)
              </label>
              <input
                type="text"
                value={formData.telegramUrl}
                onChange={(e) => handleChange('telegramUrl', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Twitter className="w-4 h-4 text-slate-900 dark:text-white" />
                X / Twitter প্রোফাইল লিংক
              </label>
              <input
                type="text"
                value={formData.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        )}

        {/* 4. SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডিফল্ট এসইও টাইটেল (Default SEO Title)
              </label>
              <input
                type="text"
                value={formData.defaultSeoTitle}
                onChange={(e) => handleChange('defaultSeoTitle', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডিফল্ট মেটা ডেসক্রিপশন (Default Meta Description)
              </label>
              <textarea
                rows={3}
                value={formData.defaultMetaDescription}
                onChange={(e) => handleChange('defaultMetaDescription', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডিফল্ট সোশ্যাল শেয়ারিং ইমেজ (OG / Twitter Image URL)
              </label>
              <input
                type="text"
                value={formData.defaultSocialImage}
                onChange={(e) => handleChange('defaultSocialImage', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>
        )}

        {/* 5. BACKUP TAB */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-red-600" />
                ডাটা এক্সপোর্ট (Export JSON Backup)
              </h3>
              <p className="text-xs text-slate-500">
                সকল প্রকাশিত সংবাদ, ক্যাটাগরি, লেখক, বিজ্ঞাপন স্লট এবং সাইট সেটিংসের একটি একক JSON ব্যাকআপ ফাইল ডাউনলোড করুন।
              </p>
              <button
                type="button"
                onClick={handleExport}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors mt-2"
              >
                <Download className="w-4 h-4" /> ব্যাকআপ ফাইল ডাউনলোড করুন
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                ডাটা রিস্টোর (Import / Restore JSON)
              </h3>
              <p className="text-xs text-slate-500">
                পূর্বে সংরক্ষিত JSON ফাইল নির্বাচন করে সম্পূর্ণ ডাটা পুনরায় লোড করুন।
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors mt-2">
                <Upload className="w-4 h-4" /> JSON ব্যাকআপ ফাইল সিলেক্ট করুন
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/40 space-y-2">
              <h3 className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                ডিফল্ট ডাটা রিসেট (Factory Reset)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                সকল কাস্টম পরিবর্তন মুছে ফেলে মূল ডেমো কনটেন্ট পুনরায় ফিরিয়ে আনুন।
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors mt-2"
              >
                রিসেট করুন
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
