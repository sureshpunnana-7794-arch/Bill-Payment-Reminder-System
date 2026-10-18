import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { CATEGORIES } from '../data/mockBills';

// Utility helper to persist newly added bill to multiple localStorage keys
export const saveBillToLocalStorage = (newBill, phone = '9876543210') => {
  try {
    // 1. Save to generic 'saved_bills'
    const rawGeneric = localStorage.getItem('saved_bills');
    const genericList = rawGeneric ? JSON.parse(rawGeneric) : [];
    localStorage.setItem('saved_bills', JSON.stringify([newBill, ...genericList]));

    // 2. Save to app phone-scoped key
    const phoneKey = `paypulse_bills_${phone}`;
    const rawPhone = localStorage.getItem(phoneKey);
    const phoneList = rawPhone ? JSON.parse(rawPhone) : [];
    localStorage.setItem(phoneKey, JSON.stringify([newBill, ...phoneList]));

    // 3. Save to app root 'paypulse_bills'
    localStorage.setItem('paypulse_bills', JSON.stringify([newBill, ...phoneList]));
  } catch (err) {
    console.error('Failed to save bill to localStorage:', err);
  }
};

export const AddBillForm = ({
  onAddBill,
  onClose,
  connectedPhone,
  className = '',
  isInline = false
}) => {
  // Form fields: Bill Name, Due Date, and Amount (as requested)
  const [billName, setBillName] = useState('');
  
  // Default due date: 7 days from now
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  const [dueDate, setDueDate] = useState(getDefaultDueDate());
  const [amount, setAmount] = useState('');
  
  // Optional helpful fields with intelligent defaults
  const [category, setCategory] = useState('Electricity');
  const [consumerId, setConsumerId] = useState('');
  const [lateFee, setLateFee] = useState('100');

  // UI state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-detect category based on name keywords if user hasn't changed it
  const handleNameChange = (e) => {
    const val = e.target.value;
    setBillName(val);
    if (errors.billName) {
      setErrors((prev) => ({ ...prev, billName: '' }));
    }

    const lower = val.toLowerCase();
    if (lower.includes('wifi') || lower.includes('broadband') || lower.includes('fiber') || lower.includes('internet')) {
      setCategory('Broadband');
    } else if (lower.includes('electr') || lower.includes('power') || lower.includes('bescom')) {
      setCategory('Electricity');
    } else if (lower.includes('card') || lower.includes('credit') || lower.includes('hdfc') || lower.includes('sbi')) {
      setCategory('CreditCard');
    } else if (lower.includes('water') || lower.includes('jal') || lower.includes('utility')) {
      setCategory('Water');
    } else if (lower.includes('gas') || lower.includes('lpg') || lower.includes('indane') || lower.includes('cylinder')) {
      setCategory('PipedGas');
    } else if (lower.includes('mobile') || lower.includes('phone') || lower.includes('airtel') || lower.includes('jio')) {
      setCategory('Mobile');
    } else if (lower.includes('rent') || lower.includes('house') || lower.includes('flat')) {
      setCategory('Rent');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!billName.trim()) {
      newErrors.billName = 'Bill name is required (e.g. BESCOM Electricity, Airtel Fiber)';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const generatedId = `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const phone = connectedPhone?.phone || '9876543210';

    const newBill = {
      id: `bill-${Date.now()}`,
      providerName: billName.trim(),
      nickname: billName.trim(),
      category: category || 'Electricity',
      consumerId: consumerId.trim() || generatedId,
      amount: parseFloat(Number(amount).toFixed(2)),
      dueDate,
      isPaid: false,
      autoRemind: true,
      reminderChannels: { whatsapp: true, sms: true, push: true },
      lateFee: lateFee ? Number(lateFee) : 0,
      billingPeriod: 'Current Cycle',
      linkedPhone: phone,
      createdAt: new Date().toISOString()
    };

    // 1. Direct persistence to localStorage
    saveBillToLocalStorage(newBill, phone);

    // 2. Notify parent state handler if provided
    if (typeof onAddBill === 'function') {
      onAddBill(newBill);
    }

    // 3. User feedback
    setIsSubmitting(false);
    setSuccessMessage(`"${newBill.providerName}" saved to localStorage successfully!`);

    // Reset fields
    setBillName('');
    setAmount('');
    setConsumerId('');
    setDueDate(getDefaultDueDate());

    // Optional close callback after short delay if in modal
    if (typeof onClose === 'function' && !isInline) {
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
  };

  return (
    <div className={`rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <span>Add New Bill</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Specify the bill name, due date, and amount. Saves directly to browser localStorage.
          </p>
        </div>

        {connectedPhone?.formatted && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{connectedPhone.formatted}</span>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field 1: Bill Name (Required) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Bill Name <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={billName}
              onChange={handleNameChange}
              placeholder="e.g. BESCOM Electricity, Airtel Fiber, House Rent"
              className={`w-full bg-slate-950 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition ${
                errors.billName
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-800 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.billName && (
            <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.billName}</span>
            </p>
          )}
        </div>

        {/* 2-Column Grid: Due Date & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Field 2: Due Date (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Due Date <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
                }}
                className={`w-full bg-slate-950 border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none transition ${
                  errors.dueDate
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.dueDate}</span>
              </p>
            )}
          </div>

          {/* Field 3: Amount (Required) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Amount (₹) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="text-slate-400 font-mono text-sm absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                ₹
              </span>
              <input
                type="number"
                step="any"
                min="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                placeholder="e.g. 1450"
                className={`w-full bg-slate-950 border rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition ${
                  errors.amount
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>{errors.amount}</span>
              </p>
            )}
          </div>
        </div>

        {/* Secondary Details: Category & Consumer ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Consumer/Account ID (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Account / Consumer #</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional</span>
            </label>
            <input
              type="text"
              value={consumerId}
              onChange={(e) => setConsumerId(e.target.value)}
              placeholder="e.g. CA-90283741"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          {typeof onClose === 'function' && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer text-xs font-semibold"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to LocalStorage...' : 'Save Bill to LocalStorage'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBillForm;
