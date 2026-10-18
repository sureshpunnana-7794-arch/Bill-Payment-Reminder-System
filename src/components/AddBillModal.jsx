import React from 'react';
import { X } from 'lucide-react';
import { AddBillForm } from './AddBillForm';

export const AddBillModal = ({
  isOpen,
  onClose,
  connectedPhone,
  onAddBill
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-slate-100 overflow-hidden p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AddBillForm
          onAddBill={onAddBill}
          onClose={onClose}
          connectedPhone={connectedPhone}
          className="border-none shadow-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default AddBillModal;
