import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Author } from '../../types';
import { 
  Users, PlusCircle, Edit, Trash2, Mail, 
  ExternalLink, UserCheck, Shield, Check, X, Phone
} from 'lucide-react';

export const AuthorsPage: React.FC = () => {
  const { authors, saveAuthorsList, news, showToast } = useNews();
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [email, setEmail] = useState('');

  const openNewModal = () => {
    setEditingAuthor(null);
    setName('');
    setBanglaName('');
    setDesignation('স্টাফ রিপোর্টার');
    setBio('');
    setPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
    setEmail('');
    setIsModalOpen(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor(author);
    setName(author.name);
    setBanglaName(author.banglaName || author.name);
    setDesignation(author.designation || '');
    setBio(author.bio || '');
    setPhoto(author.photo || '');
    setEmail(author.email || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banglaName.trim()) {
      showToast('রিপোর্টারের নাম আবশ্যক!', 'error');
      return;
    }

    if (editingAuthor) {
      const updatedList = authors.map(a => 
        a.id === editingAuthor.id 
          ? { ...a, name: name || banglaName, banglaName, designation, bio, photo, email }
          : a
      );
      saveAuthorsList(updatedList);
      showToast('রিপোর্টারের তথ্য সফলভাবে আপডেট হয়েছে।', 'success');
    } else {
      const newAuthor: Author = {
        id: `author-${Date.now()}`,
        name: name || banglaName,
        banglaName,
        designation: designation || 'প্রতিবেদক',
        bio: bio || '',
        photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        email
      };
      saveAuthorsList([...authors, newAuthor]);
      showToast('নতুন রিপোর্টার সফলভাবে যুক্ত হয়েছে।', 'success');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (authors.length <= 1) {
      showToast('কমপক্ষে একজন রিপোর্টার অবশ্যই থাকতে হবে!', 'error');
      return;
    }
    if (window.confirm('আপনি কি নিশ্চিত যে এই রিপোর্টারকে অপসারণ করতে চান?')) {
      const updatedList = authors.filter(a => a.id !== id);
      saveAuthorsList(updatedList);
      showToast('রিপোর্টার অপসারিত হয়েছে।', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            প্রতিবেদক ও লেখক ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পোর্টালের সম্পাদকীয় প্যানেল, সিনিয়র সাংবাদিক ও জেলা প্রতিনিধিদের প্রোফাইল পরিচালনা করুন
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন রিপোর্টার যুক্ত করুন</span>
        </button>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {authors.map(author => {
          const authorNewsCount = news.filter(n => n.authorId === author.id).length;

          return (
            <div
              key={author.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={author.photo}
                    alt={author.banglaName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-red-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {author.banglaName}
                    </h3>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                      {author.designation}
                    </p>
                    {author.email && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span>{author.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {author.bio && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  মোট সংবাদ: <strong className="text-slate-900 dark:text-white">{authorNewsCount}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(author)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                    title="সম্পাদনা"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="অপসারণ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingAuthor ? 'রিপোর্টারের তথ্য সম্পাদনা' : 'নতুন রিপোর্টার যোগ করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বাংলা নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={banglaName}
                  onChange={(e) => setBanglaName(e.target.value)}
                  placeholder="যেমন: তারিকুল ইসলাম"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পদবী / ডেসিগনেশন
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="সিনিয়র রিপোর্টার"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল ঠিকানা
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reporter@khulnanews.com"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রোফাইল ছবির URL
                </label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  সংক্ষিপ্ত জীবনবৃত্তান্ত (Bio)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="সাংবাদিকতার অভিজ্ঞতা ও বিশেষ ক্ষেত্র..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
