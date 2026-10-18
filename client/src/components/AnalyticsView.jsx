import React, { useMemo } from 'react';
import {
  PieChart,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { CATEGORIES } from '../data/mockBills';
import { CategoryIcon } from './CategoryIcon';

export const AnalyticsView = ({ bills }) => {
  // Aggregate expenses by category
  const categoryStats = useMemo(() => {
    const map = {};
    let grandTotal = 0;

    bills.forEach((b) => {
      const amt = Number(b.amount || 0);
      grandTotal += amt;
      if (!map[b.category]) {
        map[b.category] = { total: 0, count: 0 };
      }
      map[b.category].total += amt;
      map[b.category].count += 1;
    });

    const list = Object.keys(map).map((cat) => {
      const catMeta = CATEGORIES.find((c) => c.id === cat) || {
        name: cat,
        color: 'from-slate-500 to-slate-600'
      };
      const total = map[cat].total;
      const pct = grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0;
      return {
        category: cat,
        name: catMeta.name,
        total,
        count: map[cat].count,
        percent: pct,
        color: catMeta.color
      };
    });

    return list.sort((a, b) => b.total - a.total);
  }, [bills]);

  const grandTotal = useMemo(() => {
    return bills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
  }, [bills]);

  const totalLateFeeSaved = useMemo(() => {
    return bills.filter((b) => b.isPaid).reduce((acc, b) => acc + Number(b.lateFee || 100), 0);
  }, [bills]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Category Expense Breakdown */}
      <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Utility Spend Breakdown</h3>
              <p className="text-xs text-slate-400">Total monthly commitments: {formatCurrency(grandTotal)}</p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {bills.length} Linked Bills
          </span>
        </div>

        {/* Category Progress Bars */}
        <div className="space-y-3.5">
          {categoryStats.map((item) => (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                    <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">({item.count})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-white font-bold">{formatCurrency(item.total)}</span>
                  <span className="text-indigo-400 font-mono font-medium w-9 text-right">{item.percent}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${item.color || 'from-indigo-500 to-purple-500'} transition-all duration-500`}
                  style={{ width: `${Math.max(item.percent, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Health & Late Fee Shield */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Reminder Protection Score</span>
          </div>

          <div className="my-4 p-4 rounded-xl bg-slate-950/60 border border-indigo-500/20 text-center">
            <div className="text-3xl font-extrabold text-white font-mono">98.5%</div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">On-Time Payment Rating</div>
            <p className="text-[11px] text-slate-400 mt-2">
              Automated reminders connected to your mobile keep penalties at zero.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
              <span className="text-slate-400">Late Fees Saved:</span>
              <span className="font-mono font-bold text-emerald-400">+{formatCurrency(totalLateFeeSaved)}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60">
              <span className="text-slate-400">Next Upcoming Due:</span>
              <span className="font-semibold text-amber-300">BESCOM Electricity</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            Zero Penalty Guarantee
          </span>
          <span>BBPS Network</span>
        </div>
      </div>
    </div>
  );
};
