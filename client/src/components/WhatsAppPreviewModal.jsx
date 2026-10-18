import React from 'react';
import {
  MessageSquare,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  X,
  CreditCard,
  Share2,
  Bell
} from 'lucide-react';
import { formatCurrency, formatDate, getUrgencyInfo } from '../utils/helpers';

export const WhatsAppPreviewModal = ({
  isOpen,
  onClose,
  bill,
  phone,
  onPayNow
}) => {
  if (!isOpen || !bill) return null;

  const urgency = getUrgencyInfo(bill.dueDate, bill.isPaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#0b141a] border border-[#202c33] rounded-3xl shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp App Bar */}
        <div className="bg-[#202c33] p-3 px-4 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow">
                PP
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#202c33]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#e9edef] flex items-center gap-1.5">
                <span>PayPulse Reminder Alerts</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  VERIFIED
                </span>
              </div>
              <div className="text-xs text-[#8696a0]">
                Delivered to {phone || '+91 98765 43210'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8696a0] hover:text-[#e9edef] rounded-full hover:bg-[#111b21] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] bg-[size:16px_16px] bg-[#0b141a] min-h-[320px] flex flex-col justify-end">
          {/* Timestamp Pill */}
          <div className="text-center my-3">
            <span className="text-[11px] bg-[#182229] text-[#8696a0] px-3 py-1 rounded-lg shadow-sm">
              TODAY
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="bg-[#202c33] rounded-2xl rounded-tl-sm p-3.5 shadow-md max-w-[92%] border border-[#2a3942] relative animate-slideUp">
            {/* Header tag */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>BILL PAYMENT REMINDER</span>
            </div>

            {/* Message Body */}
            <div className="text-xs text-[#d1d7db] space-y-2 leading-relaxed">
              <p>
                Hello! This is an automated reminder for your connected mobile number{' '}
                <strong className="text-white">{phone}</strong>.
              </p>
              
              <div className="bg-[#111b21] p-3 rounded-xl border border-[#2a3942] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#8696a0]">Provider:</span>
                  <span className="font-semibold text-white">{bill.providerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8696a0]">Consumer ID:</span>
                  <span className="font-mono text-white">{bill.consumerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8696a0]">Amount Due:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(bill.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8696a0]">Due Date:</span>
                  <span className="font-semibold text-amber-300">{formatDate(bill.dueDate)} ({urgency.label})</span>
                </div>
              </div>

              {bill.lateFee ? (
                <p className="text-[11px] text-amber-400">
                  ⚠️ Pay before 11:59 PM to save ₹{bill.lateFee} in penalty late fee charges.
                </p>
              ) : null}
            </div>

            {/* Quick Action Button Inside Bubble */}
            <div className="mt-3 pt-2.5 border-t border-[#2a3942] flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onPayNow(bill);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-700/30"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay {formatCurrency(bill.amount)} Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Timestamp and Blue Ticks */}
            <div className="flex items-center justify-end gap-1 mt-1.5 text-[10px] text-[#8696a0]">
              <span>Just now</span>
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
            </div>
          </div>
        </div>

        {/* WhatsApp Input Simulation Footer */}
        <div className="p-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2 text-xs text-[#8696a0]">
          <div className="flex-1 bg-[#2a3942] text-[#d1d7db] px-4 py-2 rounded-full">
            Simulated WhatsApp Notification Engine
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
