import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Bell,
  BellOff,
  CreditCard,
  MessageSquare,
  Smartphone,
  Send,
  MoreVertical,
  Trash2,
  FileText,
  CalendarPlus,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatDate, getUrgencyInfo } from '../utils/helpers';
import { downloadBillCalendarReminder } from '../utils/calendar';
import { CategoryIcon } from './CategoryIcon';

export const BillCard = ({
  bill,
  onPay,
  onOpenReminder,
  onToggleAutoRemind,
  onDelete,
  onTogglePaidStatus,
  onViewReceipt,
  onTestWhatsApp
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const urgency = getUrgencyInfo(bill.dueDate, bill.isPaid);

  const handleCopyConsumerId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(bill.consumerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-2xl bg-slate-900/90 border transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden group ${
      bill.isPaid
        ? 'border-emerald-500/30 hover:border-emerald-500/50'
        : urgency.isUrgent
        ? 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20'
        : 'border-slate-800 hover:border-indigo-500/40'
    }`}>
      {/* Top accent line */}
      <div className={`h-1 w-full ${
        bill.isPaid
          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
          : urgency.status === 'overdue' || urgency.status === 'today'
          ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600'
          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400'
      }`} />

      {/* Card Content */}
      <div className="p-5">
        {/* Header: Category + Provider + Status Pill */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              bill.isPaid
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
            }`}>
              <CategoryIcon category={bill.category} className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {bill.category}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight line-clamp-1" title={bill.providerName}>
                {bill.providerName}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${urgency.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${urgency.dotClass}`} />
              {urgency.label}
            </span>

            {/* Context Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div 
                  className="absolute right-0 top-8 z-30 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 text-xs text-slate-200"
                  onClick={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => onTogglePaidStatus(bill.id)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}</span>
                  </button>
                  <button
                    onClick={() => downloadBillCalendarReminder(bill)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-700 flex items-center gap-2"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export to Calendar (.ics)</span>
                  </button>
                  {bill.isPaid && (
                    <button
                      onClick={() => onViewReceipt(bill)}
                      className="w-full px-3 py-2 text-left hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Receipt</span>
                    </button>
                  )}
                  <div className="border-t border-slate-700 my-1" />
                  <button
                    onClick={() => onDelete(bill.id)}
                    className="w-full px-3 py-2 text-left hover:bg-rose-500/20 text-rose-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Bill</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consumer ID */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/80">
          <span className="text-slate-500">ID:</span>
          <span className="font-mono text-slate-300 font-medium select-all">{bill.consumerId}</span>
          <button
            onClick={handleCopyConsumerId}
            className="ml-auto text-slate-500 hover:text-slate-300 transition"
            title="Copy ID"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Amount & Due Date */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xs text-slate-400 mb-0.5">Amount Due</div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatCurrency(bill.amount)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 mb-0.5 flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3" />
              <span>Due Date</span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {formatDate(bill.dueDate)}
            </div>
          </div>
        </div>

        {/* Late Fee Notice or Paid Note */}
        {bill.isPaid ? (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Paid on {formatDate(bill.paidAt || bill.dueDate)}</span>
            </div>
            <button
              onClick={() => onViewReceipt(bill)}
              className="text-emerald-400 underline hover:text-emerald-300 font-medium cursor-pointer"
            >
              Receipt
            </button>
          </div>
        ) : bill.lateFee ? (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Late payment fee: <strong className="font-mono">₹{bill.lateFee}</strong> if missed</span>
          </div>
        ) : null}

        {/* Reminder Settings Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleAutoRemind(bill.id)}
              className={`p-1.5 rounded-lg border transition ${
                bill.autoRemind
                  ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={bill.autoRemind ? 'Reminders are Active' : 'Reminders are Paused'}
            >
              {bill.autoRemind ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            </button>

            {/* Channels indicators */}
            <div className="flex items-center gap-1 ml-1 text-slate-400">
              <span 
                className={`p-1 rounded-md text-[10px] ${bill.reminderChannels?.whatsapp ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-600'}`}
                title="WhatsApp Alert"
              >
                <MessageSquare className="w-3 h-3 inline" />
              </span>
              <span 
                className={`p-1 rounded-md text-[10px] ${bill.reminderChannels?.sms ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600'}`}
                title="SMS Alert"
              >
                <Smartphone className="w-3 h-3 inline" />
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenReminder(bill)}
            className="text-xs text-slate-400 hover:text-indigo-400 transition flex items-center gap-1 font-medium cursor-pointer"
          >
            <span>Alert Options</span>
            <Clock className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2">
        {!bill.isPaid ? (
          <>
            <button
              onClick={() => onTestWhatsApp(bill)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700 flex items-center justify-center transition cursor-pointer"
              title="Send reminder to WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPay(bill)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay {formatCurrency(bill.amount)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onViewReceipt(bill)}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Bill Cleared &bull; View Receipt</span>
          </button>
        )}
      </div>
    </div>
  );
};
