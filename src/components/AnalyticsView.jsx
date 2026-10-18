import React, { useMemo } from 'react';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { CategoryBadge } from './CategoryBadge';
import { CategoryIcon } from './CategoryIcon';

export const AnalyticsView = ({ bills = [] }) => {
  const analytics = useMemo(() => {
    const totalAmount = bills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const paidBills = bills.filter((b) => b.isPaid);
    const unpaidBills = bills.filter((b) => !b.isPaid);
    const totalPaid = paidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const totalUnpaid = unpaidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

    // Group by category
    const categoryMap = {};
    bills.forEach((b) => {
      const cat = b.category || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, total: 0, count: 0, paid: 0, unpaid: 0 };
      }
      categoryMap[cat].total += Number(b.amount || 0);
      categoryMap[cat].count += 1;
      if (b.isPaid) {
        categoryMap[cat].paid += Number(b.amount || 0);
      } else {
        categoryMap[cat].unpaid += Number(b.amount || 0);
      }
    });

    const categoryList = Object.values(categoryMap).sort((a, b) => b.total - a.total);

    const complianceScore = bills.length > 0
      ? Math.round((paidBills.length / bills.length) * 100)
      : 100;

    return {
      totalAmount,
      totalPaid,
      totalUnpaid,
      complianceScore,
      categoryList,
      totalBills: bills.length,
      paidCount: paidBills.length,
      unpaidCount: unpaidBills.length
    };
  }, [bills]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Spend Analytics & Compliance</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">Utility Bill Spending Insights</h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time breakdown of recurring commitments, category expenses, and payment compliance.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Payment Health Score</div>
              <div className="text-xl font-extrabold text-white">{analytics.complianceScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Expenses by Category</span>
            <span className="text-xs font-normal text-slate-400">Total: {formatCurrency(analytics.totalAmount)}</span>
          </h3>

          <div className="space-y-4">
            {analytics.categoryList.map((item) => {
              const percentage = analytics.totalAmount > 0
                ? Math.round((item.total / analytics.totalAmount) * 100)
                : 0;

              return (
                <div key={item.category} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                        <CategoryIcon category={item.category} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{item.category}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({item.count} bill{item.count !== 1 ? 's' : ''})</span>
                        </div>
                        <CategoryBadge category={item.category} size="sm" className="mt-0.5" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white font-mono">{formatCurrency(item.total)}</div>
                      <div className="text-[11px] text-slate-400">{percentage}% of total</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Paid vs Pending</span>
              <PieChart className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                </span>
                <span className="font-bold font-mono text-white">{formatCurrency(analytics.totalPaid)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Pending
                </span>
                <span className="font-bold font-mono text-white">{formatCurrency(analytics.totalUnpaid)}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Automated Savings</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              By monitoring due dates across phone notifications, users save an average of ₹500 - ₹1,200 monthly in late penalty fees and service reconnection charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
