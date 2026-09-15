import React from 'react';
import { useNews } from '../../context/NewsContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNews();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />
        };

        const bgStyles = {
          success: 'bg-white dark:bg-slate-900 border-emerald-500/30 shadow-emerald-500/10',
          error: 'bg-white dark:bg-slate-900 border-red-500/30 shadow-red-500/10',
          warning: 'bg-white dark:bg-slate-900 border-amber-500/30 shadow-amber-500/10',
          info: 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-blue-500/10'
        };

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
