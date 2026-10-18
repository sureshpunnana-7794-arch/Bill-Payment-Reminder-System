import React from 'react';
import { AlertTriangle, Clock, ArrowRight, MessageSquare, Bell } from 'lucide-react';
import { formatCurrency, formatDate, getUrgencyInfo } from '../utils/helpers';
import { CategoryBadge } from './CategoryBadge';

export const UrgentReminderBanner = ({
  bills = [],
  onPayBill,
  onOpenReminder,
  onTestWhatsApp
}) => {
  // Find unpaid urgent bills (overdue, due today, or due in <= 3 days)
  const urgentBills = bills.filter((b) => {
    if (b.isPaid) return false;
    const urgency = getUrgencyInfo(b.dueDate, b.isPaid);
    return urgency.isUrgent;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (urgentBills.length === 0) return null;

  const primaryBill = urgentBills[0];
  const urgency = getUrgencyInfo(primaryBill.dueDate, primaryBill.isPaid);

  return (
    <div className="mb-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-amber-950/60 border border-rose-500/30 p-4 sm:p-5 shadow-xl relative overflow-hidden animate-fadeIn">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Action Required ({urgentBills.length} Bill{urgentBills.length > 1 ? 's' : ''} Urgent)
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${urgency.badgeClass}`}>
                {urgency.label}
              </span>
              <CategoryBadge category={primaryBill.category} size="sm" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              {primaryBill.providerName} payment of <span className="text-rose-300 font-mono font-extrabold">{formatCurrency(primaryBill.amount)}</span> is pending
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Due on {formatDate(primaryBill.dueDate)}. Avoid late penalties ({formatCurrency(primaryBill.lateFee || 100)}) by clearing now.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          {onTestWhatsApp && (
            <button
              onClick={() => onTestWhatsApp(primaryBill)}
              className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Test WhatsApp notification"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}

          {onOpenReminder && (
            <button
              onClick={() => onOpenReminder(primaryBill)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Configure reminder channels"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Remind</span>
            </button>
          )}

          <button
            onClick={() => onPayBill(primaryBill)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            <span>Pay {formatCurrency(primaryBill.amount)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UrgentReminderBanner;
