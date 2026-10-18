import React from 'react';
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { formatCurrency, getUrgencyInfo } from '../utils/helpers';

export const StatsOverview = ({ bills = [], currentPhone, onOpenPhoneModal }) => {
  const unpaidBills = bills.filter((b) => !b.isPaid);
  const paidBills = bills.filter((b) => b.isPaid);

  const totalUnpaidAmount = unpaidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalPaidAmount = paidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalLateFeesSaved = paidBills.reduce((sum, b) => sum + Number(b.lateFee || 100), 0);
  const urgentCount = unpaidBills.filter((b) => getUrgencyInfo(b.dueDate, b.isPaid).isUrgent).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
      {/* Metric 1: Pending Balance */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
          <span>Total Pending Amount</span>
          <Wallet className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
          {formatCurrency(totalUnpaidAmount)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
          <span className="font-semibold text-rose-400">{unpaidBills.length}</span> unpaid bill{unpaidBills.length !== 1 ? 's' : ''}
          {urgentCount > 0 && (
            <span className="text-[11px] text-rose-400 font-bold ml-auto flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {urgentCount} urgent
            </span>
          )}
        </div>
      </div>

      {/* Metric 2: Cleared This Month */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
          <span>Settled Bills</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-extrabold text-emerald-400 tracking-tight font-mono">
          {formatCurrency(totalPaidAmount)}
        </div>
        <div className="mt-2 text-xs text-slate-400">
          <span className="font-semibold text-emerald-400">{paidBills.length}</span> bill{paidBills.length !== 1 ? 's' : ''} marked paid
        </div>
      </div>

      {/* Metric 3: Penalties Shielded */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
          <span>Late Fees Avoided</span>
          <TrendingDown className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-extrabold text-cyan-400 tracking-tight font-mono">
          {formatCurrency(totalLateFeesSaved)}
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Proactive reminders active</span>
        </div>
      </div>

      {/* Metric 4: Connected Phone */}
      <div 
        onClick={onOpenPhoneModal}
        className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-lg relative overflow-hidden cursor-pointer hover:border-indigo-500/60 transition group"
      >
        <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold mb-2">
          <span>Linked Mobile Number</span>
          <Smartphone className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="text-lg font-bold text-white tracking-tight font-mono truncate">
          {currentPhone?.formatted || currentPhone?.phone || 'Connect Number'}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-indigo-400 font-semibold group-hover:text-indigo-300 transition">
          <span>{currentPhone?.name || 'Switch Profile'}</span>
          <span className="text-[10px] ml-auto underline">Change</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
