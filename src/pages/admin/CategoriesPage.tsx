import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Category } from '../../types';
import { 
  FolderTree, Plus, Edit, Trash2, Check, 
  ArrowUpDown, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, showToast } = useNews();

  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [showInNav, setShowInNav] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEnglishName('');
    setSlug('');
    setDescription('');
    setShowInNav(true);
    setEditingId(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId && !slug) {
      setSlug(val.toLowerCase().replace(/\s+/g, '-').slice(0, 30));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const existing = categories.find(c => c.id === editingId);
      if (existing) {
        updateCategory({
          ...existing,
          name: name.trim(),
          englishName: englishName.trim() || name.trim(),
          slug: slug.trim() || existing.slug,
          description: description.trim() || undefined,
          showInNav
        });
        showToast('ক্যাটাগরি হালনাগাদ করা হয়েছে!', 'success');
      }
    } else {
      const newCat: Category = {
        id: `cat-${slug.trim() || Date.now()}`,
        name: name.trim(),
        englishName: englishName.trim() || name.trim(),
        slug: slug.trim() || `cat-${Date.now()}`,
        description: description.trim() || undefined,
        order: categories.length + 1,
        showInNav,
        showInHome: true
      };
      addCategory(newCat);
      showToast('নতুন ক্যাটাগরি তৈরি হয়েছে!', 'success');
    }

    resetForm();
  };

  const handleEditClick = (c: Category) => {
    setEditingId(c.id);
    setName(c.name);
    setEnglishName(c.englishName);
    setSlug(c.slug);
    setDescription(c.description || '');
    setShowInNav(c.showInNav);
  };

  const handleToggleNav = (c: Category) => {
    updateCategory({ ...c, showInNav: !c.showInNav });
    showToast(c.showInNav ? 'নেভিগেশন বার থেকে সরানো হয়েছে' : 'নেভিগেশন বারে যুক্ত হয়েছে', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">ক্যাটাগরি ও বিভাগ পরিচালনা</h1>
        <p className="text-xs text-slate-500 mt-0.5">পোর্টালের বিভিন্ন সংবাদ বিভাগ তৈরি, সম্পাদন ও ক্রমানুসারে সাজান</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Add / Edit Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-red-600" />
            {editingId ? 'ক্যাটাগরি সম্পাদন করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                বিভাগের বাংলা নাম *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="যেমন: রাজনীতি, খেলাধুলা"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ইংরেজি নাম (English Name)
              </label>
              <input
                type="text"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="e.g. Politics, Sports"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL স্লাগ (Slug)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="politics, sports"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                সংক্ষিপ্ত বিবরণ (Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ক্যাটাগরির সংক্ষিপ্ত উদ্দেশ্য..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={showInNav}
                onChange={(e) => setShowInNav(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                হেডার মেনুবারে সরাসরি দেখান (Show in Nav)
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                {editingId ? 'হালনাগাদ সংরক্ষণ' : 'ক্যাটাগরি যুক্ত করুন'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column (7 cols): Category List Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">বর্তমান বিভাগসমূহ ({categories.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">নাম</th>
                  <th className="p-3">স্লাগ</th>
                  <th className="p-3 text-center">মেনুবার</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {c.name}
                      <span className="text-[10px] text-slate-400 block font-normal">{c.englishName}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">
                      {c.slug}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleNav(c)}
                        className={`p-1 rounded-md text-xs font-semibold ${
                          c.showInNav ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                        }`}
                        title={c.showInNav ? 'নেভিগেশনে দৃশ্যমান' : 'নেভিগেশনে লুকানো'}
                      >
                        {c.showInNav ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(c)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`আপনি কি "${c.name}" বিভাগটি মুছে ফেলতে চান?`)) {
                              deleteCategory(c.id);
                            }
                          }}
                          className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
