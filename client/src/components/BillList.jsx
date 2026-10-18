import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Inbox
} from 'lucide-react';
import { BillCard } from './BillCard';
import { CATEGORIES } from '../data/mockBills';
import { getUrgencyInfo } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const BillList = ({
  bills,
  onPay,
  onOpenReminder,
  onToggleAutoRemind,
  onDelete,
  onTogglePaidStatus,
  onViewReceipt,
  onTestWhatsApp,
  onOpenAddModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'urgent' | 'overdue' | 'upcoming' | 'paid'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('due-asc'); // 'due-asc' | 'due-desc' | 'amount-desc' | 'amount-asc'

  // Counts for tabs
  const counts = useMemo(() => {
    let urgent = 0;
    let overdue = 0;
    let upcoming = 0;
    let paid = 0;

    bills.forEach((b) => {
      if (b.isPaid) {
        paid++;
      } else {
        const u = getUrgencyInfo(b.dueDate, b.isPaid);
        if (u.status === 'overdue') overdue++;
        if (u.isUrgent) urgent++;
        if (u.status === 'upcoming') upcoming++;
      }
    });

    return { all: bills.length, urgent, overdue, upcoming, paid };
  }, [bills]);

  // Filter and sort bills
  const filteredBills = useMemo(() => {
    return bills
      .filter((bill) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchProvider = bill.providerName?.toLowerCase().includes(q);
          const matchConsumer = bill.consumerId?.toLowerCase().includes(q);
          const matchCategory = bill.category?.toLowerCase().includes(q);
          const matchNickname = bill.nickname?.toLowerCase().includes(q);
          if (!matchProvider && !matchConsumer && !matchCategory && !matchNickname) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && bill.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedFilter === 'paid') return bill.isPaid;
        if (selectedFilter === 'overdue') {
          return !bill.isPaid && getUrgencyInfo(bill.dueDate, bill.isPaid).status === 'overdue';
        }
        if (selectedFilter === 'urgent') {
          return !bill.isPaid && getUrgencyInfo(bill.dueDate, bill.isPaid).isUrgent;
        }
        if (selectedFilter === 'upcoming') {
          return !bill.isPaid && getUrgencyInfo(bill.dueDate, bill.isPaid).status === 'upcoming';
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due-asc') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'due-desc') {
          return new Date(b.dueDate) - new Date(a.dueDate);
        }
        if (sortBy === 'amount-desc') {
          return Number(b.amount) - Number(a.amount);
        }
        if (sortBy === 'amount-asc') {
          return Number(a.amount) - Number(b.amount);
        }
        return 0;
      });
  }, [bills, searchQuery, selectedCategory, selectedFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        {/* Row 1: Search & Sort & Add Bill button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by provider, consumer ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-48">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-8 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
              >
                <option value="due-asc">Due Date (Earliest First)</option>
                <option value="due-desc">Due Date (Latest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
              </select>
            </div>

            {/* Add Bill Button */}
            <button
              onClick={onOpenAddModal}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bill</span>
            </button>
          </div>
        </div>

        {/* Row 2: Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>All Bills</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'urgent'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-800/60 text-rose-300 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Due Soon</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 font-mono">
              {counts.urgent}
            </span>
          </button>

          {counts.overdue > 0 && (
            <button
              onClick={() => setSelectedFilter('overdue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === 'overdue'
                  ? 'bg-rose-700 text-white shadow-md shadow-rose-700/30'
                  : 'bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-900/40'
              }`}
            >
              <span>Overdue</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 font-mono">
                {counts.overdue}
              </span>
            </button>
          )}

          <button
            onClick={() => setSelectedFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3 h-3 text-indigo-400" />
            <span>Upcoming</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {counts.upcoming}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'paid'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-800/60 text-emerald-400 hover:bg-slate-800'
            }`}
          >
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Paid</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 font-mono">
              {counts.paid}
            </span>
          </button>
        </div>

        {/* Row 3: Category filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-bold shadow-sm'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.id !== 'all' && <CategoryIcon category={cat.id} className="w-3.5 h-3.5" />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bills Grid / Empty state */}
      {filteredBills.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Bills Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery
              ? `No bills matching "${searchQuery}". Try a different keyword or reset filters.`
              : 'There are no bills under this category or status tab. You can link a new bill to this number.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {(searchQuery || selectedCategory !== 'all' || selectedFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedFilter('all');
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={onOpenAddModal}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Link New Bill</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onPay={onPay}
              onOpenReminder={onOpenReminder}
              onToggleAutoRemind={onToggleAutoRemind}
              onDelete={onDelete}
              onTogglePaidStatus={onTogglePaidStatus}
              onViewReceipt={onViewReceipt}
              onTestWhatsApp={onTestWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
};
