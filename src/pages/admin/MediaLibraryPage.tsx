import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { MediaItem } from '../../types';
import { 
  Image as ImageIcon, Upload, Copy, Check, 
  Trash2, Plus, Search, ExternalLink 
} from 'lucide-react';

export const MediaLibraryPage: React.FC = () => {
  const { media, addMediaItem, deleteMediaItem, showToast } = useNews();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const newMedia: MediaItem = {
            id: `med-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            altText: file.name.replace(/\.[^/.]+$/, ''),
            url: reader.result as string,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            uploadedAt: new Date().toISOString(),
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          };
          addMediaItem(newMedia);
          showToast('ছবি সফলভাবে মিডিয়া গ্যালারিতে যুক্ত হয়েছে!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newMedia: MediaItem = {
      id: `med-${Date.now()}`,
      title: newImageCaption.trim() || 'অনলাইন ফটো',
      altText: newImageCaption.trim() || 'অনলাইন ফটো',
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || 'অনলাইন ফটো',
      uploadedAt: new Date().toISOString()
    };
    addMediaItem(newMedia);
    setNewImageUrl('');
    setNewImageCaption('');
    showToast('ছবির লিংক সফলভাবে যুক্ত হয়েছে!', 'success');
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('ছবির লিংক কপি করা হয়েছে!', 'info');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredMedia = media.filter(m => 
    (m.caption || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-red-600" />
            মিডিয়া গ্যালারি ও ফটো লাইব্রেরি
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            সংবাদের জন্য ব্যবহৃত ছবি আপলোড ও সরাসরি লিংক কপি করুন
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>ডিভাইস থেকে ছবি আপলোড</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Add External URL Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <form onSubmit={handleAddUrl} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="ছবির অনলাইন URL দিন (e.g. https://images.unsplash.com/...)"
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="text"
            value={newImageCaption}
            onChange={(e) => setNewImageCaption(e.target.value)}
            placeholder="ছবির বিবরণ / ক্যাপশন"
            className="sm:w-60 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white hover:bg-red-600 dark:hover:bg-red-600 font-bold text-xs rounded-xl transition-colors"
          >
            URL যুক্ত করুন
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ক্যাপশন দিয়ে ছবি খুঁজুন..."
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredMedia.map(m => (
          <div key={m.id} className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="aspect-[16/11] bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
              <img src={m.url} alt={m.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>

            <div className="p-3">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {m.caption || 'ছবি'}
              </p>
              {m.fileSize && <span className="text-[10px] text-slate-400 block">{m.fileSize}</span>}

              <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleCopy(m.url)}
                  className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="Copy Link"
                >
                  {copiedUrl === m.url ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === m.url ? 'কপি হয়েছে' : 'লিংক নিন'}</span>
                </button>

                <button
                  onClick={() => deleteMediaItem(m.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
