import React from 'react';
import {
  Smartphone,
  Bell,
  Plus,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  RefreshCw
} from 'lucide-react';

export const Header = ({
  currentPhone,
  unreadCount,
  onOpenPhoneModal,
  onOpenAddModal,
  onOpenNotifications,
  currentView,
  setCurrentView
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">
                  Pay<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Pulse</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  SMART REMINDER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Phone-Connected Utility & Bill Payment Tracker
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Bills vs Analytics) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
            <button
              onClick={() => setCurrentView('bills')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'bills'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bills & Reminders</span>
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Spend Analytics</span>
            </button>
          </nav>

          {/* Right Action Suite */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Connected Number Pill */}
            <button
              onClick={onOpenPhoneModal}
              className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-indigo-500/50 transition cursor-pointer text-left shadow-sm"
              title="Click to change or connect number"
            >
              <div className="relative">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] text-slate-400 font-semibold uppercase leading-tight flex items-center gap-1">
                  <span>Linked Number</span>
                </div>
                <div className="text-xs font-bold text-white font-mono leading-tight">
                  {currentPhone?.formatted || currentPhone?.phone || 'Connect'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="View reminders and alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-md shadow-rose-500/40">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Link Bill Primary Button */}
            <button
              onClick={onOpenAddModal}
              className="py-2 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Link Bill</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-center gap-2 py-2 border-t border-slate-900">
          <button
            onClick={() => setCurrentView('bills')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              currentView === 'bills'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bills & Reminders</span>
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              currentView === 'analytics'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>
      </div>
    </header>
  );
};
