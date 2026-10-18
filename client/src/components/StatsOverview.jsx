import React from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  BellRing,
  ArrowUpRight,
  TrendingDown,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency, getUrgencyInfo } from '../utils/helpers';

export const StatsOverview = ({ bills, currentPhone, onOpenPhoneModal }) => {
  const unpaidBills = bills.filter((b) => !b.isPaid);
  const paidBills = bills.filter((b) => b.isPaid);

  const totalDue = unpaidBills.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPaid = paidBills.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const urgentCount = unpaidBills.filter((b) => {
    const urgency = getUrgencyInfo(b.dueDate, b.isPaid);
    return urgency.isUrgent;
  }).length;

  const autoRemindActiveCount = bills.filter((b) => b.autoRemind).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Due Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition shadow-lg group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition duration-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pending Due</span>
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mb-1">
          {formatCurrency(totalDue)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <span>{unpaidBills.length} unpaid bill{unpaidBills.length !== 1 ? 's' : ''}</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-400">{urgentCount} critical</span>
        </div>
      </div>

      {/* Urgent Reminders Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition shadow-lg group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition duration-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Within 3 Days</span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mb-1">
          {urgentCount} <span className="text-sm font-normal text-slate-400">Bills</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
          {urgentCount > 0 ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Requires immediate payment</span>
            </>
          ) : (
            <span className="text-emerald-400">All clear for next 3 days</span>
          )}
        </div>
      </div>

      {/* Paid This Month Card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition shadow-lg group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition duration-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid Bills</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono mb-1">
          {formatCurrency(totalPaid)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span>{paidBills.length} cleared successfully</span>
        </div>
      </div>

      {/* Connected Number & Reminder Engine Status */}
      <div 
        onClick={onOpenPhoneModal}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-indigo-500/30 p-5 hover:border-indigo-400/60 transition shadow-lg group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/15 rounded-bl-full pointer-events-none group-hover:scale-110 transition duration-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Connected Number</span>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg font-bold text-white tracking-tight font-mono mb-1 flex items-center gap-2">
          <span>{currentPhone?.formatted || currentPhone?.phone || 'Not Connected'}</span>
          <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Sync</span>
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-indigo-300">{autoRemindActiveCount} Auto-reminders</span>
        </div>
      </div>
    </div>
  );
};
