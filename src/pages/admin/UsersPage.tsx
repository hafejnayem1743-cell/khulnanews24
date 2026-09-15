import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { AuthService, StoredUserCredential } from '../../services/auth';
import { 
  UserCheck, Shield, KeyRound, PlusCircle, Trash2, 
  Lock, Mail, CheckCircle2, AlertCircle, X, UserCog
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { currentUser, showToast } = useNews();
  const [users, setUsers] = useState<StoredUserCredential[]>([]);
  
  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // New User Modal
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'super_admin' | 'editor' | 'reporter'>('editor');
  const [newUserPassword, setNewUserPassword] = useState('');

  useEffect(() => {
    setUsers(AuthService.getStoredUsers());
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newPassword.length < 6) {
      showToast('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মেলেনি!', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await AuthService.updatePassword(currentUser.id, oldPassword, newPassword);
      if (res.success) {
        showToast(res.message, 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('পাসওয়ার্ড পরিবর্তনের সময় ত্রুটি হয়েছে।', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newUsername.trim() || !newUserPassword.trim()) {
      showToast('সকল তথ্য পূরণ করুন!', 'error');
      return;
    }

    const res = await AuthService.createAdminUser({
      name: newName.trim() || newUsername.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      password: newUserPassword.trim()
    });

    if (res.success) {
      showToast(res.message, 'success');
      setUsers(AuthService.getStoredUsers());
      setIsNewUserModalOpen(false);
      setNewName('');
      setNewUsername('');
      setNewEmail('');
      setNewUserPassword('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই অ্যাডমিন অ্যাকাউন্টটি অপসারণ করতে চান?')) {
      const res = AuthService.deleteAdminUser(userId);
      if (res.success) {
        showToast(res.message, 'info');
        setUsers(AuthService.getStoredUsers());
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="w-6 h-6 text-red-600" />
            অ্যাডমিন ও ইউজার সিকিউরিটি
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            অ্যাডমিন পাসওয়ার্ড পরিবর্তন, রোল পারমিশন ও এক্সেস কন্ট্রোল
          </p>
        </div>

        {currentUser?.role === 'super_admin' && (
          <button
            onClick={() => setIsNewUserModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন অ্যাডমিন অ্যাকাউন্ট</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Change Password */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <KeyRound className="w-4 h-4 text-red-600" />
              <span>পাসওয়ার্ড পরিবর্তন করুন</span>
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বর্তমান পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="নতুন শক্তিশালী পাসওয়ার্ড"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
              >
                {passwordLoading ? 'সংরক্ষণ হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: User Accounts List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span>নিবন্ধিত অ্যাডমিন অ্যাকাউন্ট তালিকা</span>
              </h2>
              <span className="text-xs font-bold text-slate-500">{users.length} টি অ্যাকাউন্ট</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                        {currentUser?.id === u.id && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            আপনি (Active)
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{u.email} • @{u.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                      {u.role === 'super_admin' ? 'সুপার অ্যাডমিন' : u.role === 'editor' ? 'সম্পাদক' : 'প্রতিবেদক'}
                    </span>

                    {currentUser?.role === 'super_admin' && currentUser.id !== u.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="অ্যাকাউন্ট অপসারন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New User Modal */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                নতুন অ্যাডমিন অ্যাকাউন্ট তৈরি
              </h3>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পুরো নাম</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="তারিকুল ইসলাম"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইউজারনেম</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="tarikul"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="tarikul@khulnanews.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">অ্যাক্সেস রোল</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="super_admin">Super Admin (সর্বোচ্চ ক্ষমতা)</option>
                  <option value="editor">Editor (সংবাদ প্রকাশ ও সম্পাদনা)</option>
                  <option value="reporter">Reporter (শুধুমাত্র ড্রাফট তৈরি)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
