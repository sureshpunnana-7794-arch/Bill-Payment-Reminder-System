import React, { useState } from 'react';
import { Smartphone, CheckCircle2, Shield, ArrowRight, User, RefreshCw, KeyRound, Sparkles, X } from 'lucide-react';
import { PRESET_PROFILES } from '../data/mockBills';

export const PhoneConnectModal = ({
  isOpen,
  onClose,
  currentPhone,
  onConnectPhone,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('otp');
      // Auto-fill OTP simulation for easy UX
      setOtp(['4', '2', '8', '9']);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const clean = phoneNumber.replace(/\D/g, '');
      onConnectPhone({
        phone: clean,
        formatted: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
        name: name || `User ${clean.slice(-4)}`,
        planType: 'Standard Account',
        verified: true
      });
      onClose();
      setStep('input');
      setPhoneNumber('');
    }, 700);
  };

  const handlePresetClick = (preset) => {
    onSelectPreset(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/70 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Connect Your Mobile Number</h3>
            <p className="text-sm text-slate-400">Bills linked to this number will automatically show reminders</p>
          </div>
        </div>

        {/* Currently Connected Info */}
        {currentPhone && (
          <div className="mb-6 p-3.5 rounded-xl bg-slate-800/80 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Number</div>
                <div className="text-sm font-bold text-white">{currentPhone.formatted || currentPhone.phone}</div>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Connected
            </span>
          </div>
        )}

        {/* Preset demo profiles */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo Numbers (Pre-loaded Bills)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_PROFILES.map((profile) => {
              const isSelected = currentPhone?.phone === profile.phone;
              return (
                <button
                  key={profile.phone}
                  type="button"
                  onClick={() => handlePresetClick(profile)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                      : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <div className="text-sm font-semibold flex items-center gap-1.5">
                        {profile.name}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">{profile.formatted}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300">
                      {profile.bills?.length || 0} Bills
                    </span>
                    <div className="text-[11px] text-indigo-400 mt-0.5 group-hover:underline">Switch to &rarr;</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-xs text-slate-500 uppercase tracking-wider">or connect your actual number</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Custom Phone Number Input Form */}
        {step === 'input' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Your Full Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex">
                <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-sm font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-r-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
              {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !phoneNumber}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating OTP...
                </>
              ) : (
                <>
                  <span>Verify & Sync Bills</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              <KeyRound className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
              Demo OTP automatically generated: <strong className="text-white font-mono">4289</strong>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2 text-center">
                Enter 4-Digit Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-xl font-bold bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-1/3 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm & Connect
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit encrypted phone linking with BBPS registry</span>
        </div>
      </div>
    </div>
  );
};
