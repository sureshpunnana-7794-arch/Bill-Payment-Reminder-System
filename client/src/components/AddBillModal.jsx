import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle2,
  Bell,
  MessageSquare,
  X,
  Sparkles,
  Tag
} from 'lucide-react';
import { CATEGORIES, POPULAR_PROVIDERS } from '../data/mockBills';
import { CategoryIcon } from './CategoryIcon';

export const AddBillModal = ({
  isOpen,
  onClose,
  connectedPhone,
  onAddBill
}) => {
  if (!isOpen) return null;

  const defaultCategory = 'Electricity';
  const [category, setCategory] = useState(defaultCategory);
  const [providerName, setProviderName] = useState(POPULAR_PROVIDERS[defaultCategory][0] || '');
  const [consumerId, setConsumerId] = useState('');
  const [nickname, setNickname] = useState('');
  const [amount, setAmount] = useState('');
  
  // Default due date: 7 days from today
  const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };
  
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [lateFee, setLateFee] = useState('100');
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    push: true
  });
  const [error, setError] = useState('');

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    if (POPULAR_PROVIDERS[catId] && POPULAR_PROVIDERS[catId].length > 0) {
      setProviderName(POPULAR_PROVIDERS[catId][0]);
    } else {
      setProviderName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!providerName.trim()) {
      setError('Please specify the bill provider');
      return;
    }
    if (!consumerId.trim()) {
      setError('Please specify Consumer/Account number');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid bill amount');
      return;
    }
    if (!dueDate) {
      setError('Please choose a due date');
      return;
    }

    const newBill = {
      id: `bill-${Date.now()}`,
      category,
      providerName: providerName.trim(),
      consumerId: consumerId.trim(),
      nickname: nickname.trim() || `${category} Bill`,
      amount: Number(amount),
      dueDate,
      isPaid: false,
      autoRemind: true,
      reminderChannels: channels,
      lateFee: lateFee ? Number(lateFee) : 0,
      linkedPhone: connectedPhone?.phone || '9876543210',
      billingPeriod: 'Current Cycle'
    };

    onAddBill(newBill);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Link New Bill</h3>
              <p className="text-xs text-slate-400">
                Connected to <span className="font-mono text-indigo-300 font-semibold">{connectedPhone?.formatted || connectedPhone?.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Utility / Bill Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <CategoryIcon category={cat.id} className="w-4 h-4" />
                    <span className="text-[11px] font-medium truncate w-full text-center">{cat.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Selection & Suggestions */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Service Provider
            </label>
            <input
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="e.g. BESCOM, Tata Power, Airtel, HDFC..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {POPULAR_PROVIDERS[category] && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
                <span className="text-[10px] text-slate-500 flex-shrink-0">Suggestions:</span>
                {POPULAR_PROVIDERS[category].map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setProviderName(prov)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap cursor-pointer"
                  >
                    {prov}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Consumer ID & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Consumer / Account ID *
              </label>
              <input
                type="text"
                value={consumerId}
                onChange={(e) => setConsumerId(e.target.value)}
                placeholder="e.g. CA-9482103"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nickname / Label (Optional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Master Bedroom Meter"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Bill Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2450"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Late fee */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Estimated Penalty Fee if Overdue (₹)
            </label>
            <input
              type="number"
              value={lateFee}
              onChange={(e) => setLateFee(e.target.value)}
              placeholder="100"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Reminder Channel Defaults */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enable Reminders For This Bill</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>SMS Alert</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={channels.push}
                  onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Browser Push</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Connect & Save Bill to Number</span>
          </button>
        </form>
      </div>
    </div>
  );
};
