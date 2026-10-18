import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  List,
  ShieldCheck,
  CreditCard,
  Bell,
  MessageSquare,
  Check,
  Trash2,
  FileText,
  CalendarDays
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getUrgencyInfo,
  calculateMonthlyDue,
  isDateInMonth
} from '../utils/helpers';
import { CATEGORIES } from '../data/mockBills';
import { CategoryIcon } from './CategoryIcon';
import { BillCard } from './BillCard';
import { AddBillForm } from './AddBillForm';

export const Dashboard = ({
  bills,
  onPay,
  onOpenReminder,
  onToggleAutoRemind,
  onDelete,
  onTogglePaidStatus,
  onViewReceipt,
  onTestWhatsApp,
  onOpenAddModal,
  onAddBill,
  connectedPhone
}) => {
  const currentDate = useMemo(() => new Date(), []);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigation for active month selection
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('current-month'); // 'current-month' | 'all' | 'pending' | 'paid' | 'urgent'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [showAddForm, setShowAddForm] = useState(false);

  // Is viewing real current month?
  const isSelectedCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth;

  // Monthly metrics for selected month
  const monthlyStats = useMemo(() => {
    return calculateMonthlyDue(bills, selectedYear, selectedMonth);
  }, [bills, selectedYear, selectedMonth]);

  // Overall metrics across all saved bills
  const allTimeStats = useMemo(() => {
    const totalBills = bills.length;
    const allUnpaid = bills.filter((b) => !b.isPaid);
    const allPaid = bills.filter((b) => b.isPaid);
    const totalUnpaidAmount = allUnpaid.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const totalPaidAmount = allPaid.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    const urgentCount = allUnpaid.filter((b) => getUrgencyInfo(b.dueDate, b.isPaid).isUrgent).length;

    return {
      totalBills,
      allUnpaidCount: allUnpaid.length,
      allPaidCount: allPaid.length,
      totalUnpaidAmount,
      totalPaidAmount,
      urgentCount
    };
  }, [bills]);

  // Navigation handlers for month switching
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const handleResetToCurrentMonth = () => {
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setActiveTab('current-month');
  };

  // Filtered bills list
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      // Month constraint based on activeTab
      if (activeTab === 'current-month') {
        if (!isDateInMonth(bill.dueDate, selectedYear, selectedMonth)) {
          return false;
        }
      }

      // Status filters
      if (activeTab === 'pending') {
        if (bill.isPaid) return false;
      } else if (activeTab === 'paid') {
        if (!bill.isPaid) return false;
      } else if (activeTab === 'urgent') {
        if (bill.isPaid) return false;
        const urgency = getUrgencyInfo(bill.dueDate, bill.isPaid);
        if (!urgency.isUrgent) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && bill.category !== selectedCategory) {
        return false;
      }

      // Text search
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

      return true;
    }).sort((a, b) => {
      // Unpaid first, then sorted by due date
      if (a.isPaid !== b.isPaid) {
        return a.isPaid ? 1 : -1;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [bills, activeTab, selectedYear, selectedMonth, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Month Navigation & Hero Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Title & Month Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Monthly Bill Overview
              </span>
              {isSelectedCurrentMonth ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Current Month
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Archived / Future View
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Monthly Bill Due Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tracking scheduled utility bills and calculating obligations for{' '}
              <span className="text-slate-200 font-medium">{monthlyStats.monthLabel}</span>
            </p>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start md:self-auto">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Previous Month"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1 text-center min-w-[140px]">
              <span className="text-xs font-bold text-white block">
                {monthlyStats.monthLabel}
              </span>
              <span className="text-[10px] text-slate-400 tabular-nums">
                {monthlyStats.totalBillsCount} bill{monthlyStats.totalBillsCount !== 1 ? 's' : ''} scheduled
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Next Month"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isSelectedCurrentMonth && (
              <button
                onClick={handleResetToCurrentMonth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 transition cursor-pointer ml-1"
                title="Return to Current Month"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Today</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* 1. Total Amount Due for Month (PRIMARY CALCULATION) */}
          <div className="rounded-2xl bg-slate-950/70 border border-rose-500/30 p-5 relative overflow-hidden group hover:border-rose-500/50 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-rose-400" />
                Total Due This Month
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {monthlyStats.unpaidCount} Pending
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums mb-1 text-rose-400">
              {formatCurrency(monthlyStats.totalAmountDue)}
            </div>
            <p className="text-xs text-slate-400">
              {monthlyStats.unpaidCount > 0 ? (
                <span>
                  Excludes {monthlyStats.paidCount} paid bill{monthlyStats.paidCount !== 1 ? 's' : ''} ({formatCurrency(monthlyStats.totalAmountPaid)})
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All bills cleared! ₹0 remaining due.
                </span>
              )}
            </p>
          </div>

          {/* 2. Amount Paid for Month */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Settled This Month
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {monthlyStats.paidCount} Paid
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums mb-1 text-emerald-400">
              {formatCurrency(monthlyStats.totalAmountPaid)}
            </div>
            <p className="text-xs text-slate-400">
              {monthlyStats.totalCommitment > 0 ? (
                <span>{monthlyStats.percentagePaid}% of monthly commitments settled</span>
              ) : (
                <span>No recorded payments for this month</span>
              )}
            </p>
          </div>

          {/* 3. Total Monthly Commitment (Due + Paid) */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Total Monthly Commitment
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {monthlyStats.totalBillsCount} Bills
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums mb-1 text-indigo-300">
              {formatCurrency(monthlyStats.totalCommitment)}
            </div>
            <p className="text-xs text-slate-400">
              Total scheduled expenses for {monthlyStats.monthLabel}
            </p>
          </div>

          {/* 4. Overall All-Time Portfolio Snapshot */}
          <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                All Saved Bills
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {allTimeStats.totalBills} Total
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono tabular-nums mb-1 text-slate-100">
              {formatCurrency(allTimeStats.totalUnpaidAmount)}
            </div>
            <p className="text-xs text-slate-400">
              All-time pending across {allTimeStats.allUnpaidCount} active bill{allTimeStats.allUnpaidCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Monthly Settlement Progress Bar */}
        {monthlyStats.totalCommitment > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">
                  {monthlyStats.monthLabel} Settlement Progress:
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {monthlyStats.percentagePaid}% Cleared
                </span>
              </div>
              <div className="text-slate-400 text-xs font-mono">
                {formatCurrency(monthlyStats.totalAmountPaid)} of {formatCurrency(monthlyStats.totalCommitment)}
              </div>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700 rounded-full"
                style={{ width: `${monthlyStats.percentagePaid}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Calculation Clarification Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Active Rule:</strong> Total amount due excludes all bills marked as <span className="text-emerald-400 font-semibold">Paid</span>. Toggle any bill to mark it Paid or Pending to update totals in real time.
          </span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] whitespace-nowrap pl-5 sm:pl-0">
          {monthlyStats.paidCount} bill{monthlyStats.paidCount !== 1 ? 's' : ''} currently excluded ({formatCurrency(monthlyStats.totalAmountPaid)})
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl scrollbar-none">
          <button
            onClick={() => setActiveTab('current-month')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'current-month'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>This Month ({monthlyStats.totalBillsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>All Saved Bills ({bills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Unpaid Due ({allTimeStats.allUnpaidCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'urgent'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Urgent ({allTimeStats.urgentCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('paid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'paid'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paid ({allTimeStats.allPaidCount})</span>
          </button>
        </div>

        {/* Right side: Search, Category, View Mode & Add Bill */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search provider, bill..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table Ledger View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Bill Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition cursor-pointer whitespace-nowrap shrink-0 ${
              showAddForm
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            <Plus className={`w-4 h-4 transition-transform ${showAddForm ? 'rotate-45' : ''}`} />
            <span>{showAddForm ? 'Close Form' : 'Add Bill'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Add Bill Form (name, due date, amount & saves to localStorage) */}
      {showAddForm && (
        <div className="animate-fadeIn">
          <AddBillForm
            isInline={true}
            connectedPhone={connectedPhone}
            onAddBill={(newBill) => {
              onAddBill?.(newBill);
              setShowAddForm(false);
            }}
            onClose={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Main Bills Presentation: Grid or High-Density Table */}
      {filteredBills.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No Bills Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {activeTab === 'current-month'
              ? `There are no scheduled bills for ${monthlyStats.monthLabel}. You can switch months or add a new utility bill.`
              : 'No saved bills match your current search and filter criteria.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {activeTab === 'current-month' && (
              <button
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                View All Saved Bills ({bills.length})
              </button>
            )}
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Bill</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
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
      ) : (
        /* High-Density SaaS Ledger Table View */
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center">Paid / Pending</th>
                  <th className="py-3.5 px-4">Provider & Service</th>
                  <th className="py-3.5 px-4">Consumer / Account</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Urgency</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBills.map((bill) => {
                  const urgency = getUrgencyInfo(bill.dueDate, bill.isPaid);
                  const isCurrentMonthBill = isDateInMonth(bill.dueDate, selectedYear, selectedMonth);

                  return (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* Interactive Paid / Pending Checkbox Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onTogglePaidStatus(bill.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer select-none ${
                            bill.isPaid
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                          }`}
                          title={bill.isPaid ? 'Click to mark as Pending (adds back to Total Due)' : 'Click to mark as Paid (excludes from Total Due)'}
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                            bill.isPaid
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'border-slate-600 bg-slate-900/80'
                          }`}>
                            {bill.isPaid && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{bill.isPaid ? 'Paid' : 'Pending'}</span>
                        </button>
                      </td>

                      {/* Provider & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            bill.isPaid
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                          }`}>
                            <CategoryIcon category={bill.category} className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{bill.providerName}</span>
                              {isCurrentMonthBill && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                                  This Month
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <span>{bill.category}</span>
                              {bill.nickname && (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-slate-300">{bill.nickname}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Consumer ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {bill.consumerId}
                      </td>

                      {/* Due Date & Remaining */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">
                          {formatDate(bill.dueDate)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {urgency.label}
                        </div>
                      </td>

                      {/* Amount (Tabular Numerals) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`font-mono text-sm font-bold tabular-nums transition ${
                          bill.isPaid ? 'text-slate-500 line-through' : 'text-white'
                        }`}>
                          {formatCurrency(bill.amount)}
                        </div>
                        {bill.isPaid ? (
                          <div className="text-[10px] text-emerald-400 font-medium">
                            Excluded from total
                          </div>
                        ) : bill.lateFee > 0 ? (
                          <div className="text-[10px] text-rose-400">
                            +{formatCurrency(bill.lateFee)} late fee
                          </div>
                        ) : null}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${urgency.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${urgency.dotClass}`} />
                          <span>{urgency.label}</span>
                        </span>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {bill.isPaid ? (
                            <button
                              onClick={() => onViewReceipt(bill)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              title="View BBPS Receipt"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Receipt</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onPay(bill)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer"
                              title="Instant Pay"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay</span>
                            </button>
                          )}

                          <button
                            onClick={() => onOpenReminder(bill)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            title="Reminder Settings"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onTestWhatsApp(bill)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 transition cursor-pointer"
                            title="Preview WhatsApp Notification"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onTogglePaidStatus(bill.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                            title={bill.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDelete(bill.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Delete Bill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
