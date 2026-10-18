import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fadeIn">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 text-sm ${
        isSuccess
          ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          : isError
          ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
      }`}>
        <div className="shrink-0 mt-0.5">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-xs uppercase tracking-wider mb-0.5">
            {toast.title}
          </div>
          <div className="text-xs leading-relaxed text-slate-300">
            {toast.message}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
