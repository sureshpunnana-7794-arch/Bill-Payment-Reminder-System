import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  MessageSquare,
  BellRing,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, getUrgencyInfo } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const UrgentReminderBanner = ({
  bills,
  onPayBill,
  onOpenReminder,
  onTestWhatsApp
}) => {
  // Find all unpaid urgent bills (overdue, due today, due tomorrow, due within 3 days)
  const urgentBills = bills.filter((b) => {
    if (b.isPaid) return false;
    const urgency = getUrgencyInfo(b.dueDate, b.isPaid);
    return urgency.isUrgent;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  if (urgentBills.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-emerald-950/30 border border-emerald-500/20 p-4 sm:p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                All bills are up to date!
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  Zero Overdue
                </span>
              </div>
              <p className="text-xs text-slate-400">
                No urgent reminders pending for your connected phone number. Enjoy peace of mind.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Smart auto-monitoring active</span>
          </div>
        </div>
      </div>
    );
  }

  // Active highlighted bill
  const currentBill = urgentBills[currentIndex % urgentBills.length];
  const urgency = getUrgencyInfo(currentBill.dueDate, currentBill.isPaid);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-amber-950/30 border border-rose-500/30 p-4 sm:p-5 mb-8 shadow-xl shadow-rose-950/20">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-rose-500/10 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Urgency Alert Content */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Urgent Bill Reminder
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${urgency.badgeClass}`}>
                {urgency.label}
              </span>
              {urgentBills.length > 1 && (
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                  {currentIndex + 1} of {urgentBills.length} urgent bills
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{currentBill.providerName}</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-rose-300 font-mono text-base font-extrabold">
                {formatCurrency(currentBill.amount)}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              Consumer ID: <span className="font-mono text-slate-300">{currentBill.consumerId}</span> &bull;{' '}
              {currentBill.lateFee ? `Avoid ₹${currentBill.lateFee} penalty fee by paying now.` : 'Pay now to prevent service interruption.'}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end lg:self-center">
          {urgentBills.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % urgentBills.length)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Next urgent bill"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onTestWhatsApp(currentBill)}
            className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-medium border border-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
            title="Send reminder to WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Alert</span>
          </button>

          <button
            onClick={() => onOpenReminder(currentBill)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Reminder Settings</span>
          </button>

          <button
            onClick={() => onPayBill(currentBill)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Pay {formatCurrency(currentBill.amount)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
