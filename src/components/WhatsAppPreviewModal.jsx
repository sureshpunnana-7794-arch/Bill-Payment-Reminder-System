import React from 'react';
import { X, Send, CheckCheck, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CategoryBadge } from './CategoryBadge';

export const WhatsAppPreviewModal = ({
  isOpen,
  onClose,
  bill,
  phone = '+91 98765 43210',
  onPayNow
}) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 border border-emerald-400/40 flex items-center justify-center font-bold text-white shadow">
              PP
            </div>
            <div>
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>PayPulse Verified Alerts</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>Official Business Account</span>
                <span>&bull;</span>
                <span>{phone}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-emerald-700/50 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 bg-[#0b141a] min-h-[280px] flex flex-col justify-end space-y-3">
          <div className="text-center">
            <span className="text-[10px] bg-[#182229] text-slate-400 px-3 py-1 rounded-full uppercase tracking-wider">
              Today &bull; End-to-end encrypted
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-none p-4 max-w-[90%] border border-slate-800 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-400">⚡ Bill Payment Alert</span>
              <CategoryBadge category={bill.category} size="sm" />
            </div>

            <p className="text-xs leading-relaxed text-slate-200">
              Hi there, your <span className="font-bold text-white">{bill.providerName}</span> bill of{' '}
              <span className="font-bold text-emerald-300 font-mono">{formatCurrency(bill.amount)}</span> is scheduled for payment.
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <div><span className="text-slate-400">Account No:</span> <span className="font-mono text-white">{bill.consumerId}</span></div>
              <div><span className="text-slate-400">Due Date:</span> <span className="text-white font-medium">{formatDate(bill.dueDate)}</span></div>
              <div><span className="text-slate-400">Late Fee:</span> <span className="text-rose-400">{formatCurrency(bill.lateFee || 100)}</span></div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>Instant BBPS settlement</span>
              <span className="flex items-center gap-1 text-sky-400">
                10:30 AM <CheckCheck className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={() => onPayNow(bill)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
          >
            <span>Pay Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreviewModal;
