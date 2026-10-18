import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-slideUp text-slate-100">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
        toast.type === 'error'
          ? 'bg-rose-500/20 text-rose-400'
          : toast.type === 'info'
          ? 'bg-indigo-500/20 text-indigo-400'
          : 'bg-emerald-500/20 text-emerald-400'
      }`}>
        {toast.type === 'error' ? (
          <AlertCircle className="w-4 h-4" />
        ) : toast.type === 'info' ? (
          <Info className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 pr-2">
        <div className="text-xs font-bold text-white mb-0.5">{toast.title || 'Notification'}</div>
        <div className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</div>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
