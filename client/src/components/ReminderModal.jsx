import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Smartphone,
  Calendar,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  CalendarPlus,
  AlertTriangle,
  X,
  Volume2
} from 'lucide-react';
import { formatCurrency, formatDate, getUrgencyInfo } from '../utils/helpers';
import { downloadBillCalendarReminder } from '../utils/calendar';

export const ReminderModal = ({
  isOpen,
  onClose,
  bill,
  connectedPhone,
  onUpdateBillReminders,
  onTriggerTestNotification
}) => {
  if (!isOpen || !bill) return null;

  const [autoRemind, setAutoRemind] = useState(bill.autoRemind ?? true);
  const [channels, setChannels] = useState({
    whatsapp: bill.reminderChannels?.whatsapp ?? true,
    sms: bill.reminderChannels?.sms ?? true,
    push: bill.reminderChannels?.push ?? true
  });
  const [schedule, setSchedule] = useState({
    sevenDays: true,
    threeDays: true,
    oneDay: true,
    dueDay: true
  });
  const [testSent, setTestSent] = useState(false);

  const urgency = getUrgencyInfo(bill.dueDate, bill.isPaid);

  const handleSave = () => {
    onUpdateBillReminders(bill.id, {
      autoRemind,
      reminderChannels: channels
    });
    onClose();
  };

  const handleSendTestNotification = () => {
    onTriggerTestNotification({
      type: 'whatsapp',
      bill,
      phone: connectedPhone?.formatted || connectedPhone?.phone
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleBrowserPush = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`PayPulse Reminder: ${bill.providerName}`, {
            body: `Your bill of ${formatCurrency(bill.amount)} is due on ${formatDate(bill.dueDate)}. Click to pay.`,
            icon: '/favicon.svg'
          });
        }
      });
    }
    handleSendTestNotification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Smart Bill Reminder Settings</h3>
              <p className="text-xs text-slate-400">
                Connected to mobile: <span className="text-indigo-300 font-mono font-semibold">{connectedPhone?.formatted || connectedPhone?.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bill Context Summary */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">{bill.providerName}</div>
            <div className="text-sm font-bold text-white font-mono">{formatCurrency(bill.amount)}</div>
          </div>
          <div className="text-right">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${urgency.badgeClass}`}>
              {urgency.label}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">Due {formatDate(bill.dueDate)}</div>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Master Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
            <div>
              <div className="text-sm font-semibold text-white">Enable Automated Reminders</div>
              <div className="text-xs text-slate-400">Send proactive notifications so you never miss a due date</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRemind}
                onChange={(e) => setAutoRemind(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Delivery Channels */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Notification Channels
            </div>
            <div className="space-y-2">
              {/* WhatsApp Channel */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">WhatsApp Notifications</div>
                    <div className="text-[11px] text-slate-400">Receive alert with 1-click Pay link on WhatsApp</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.whatsapp}
                  onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* SMS Channel */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">SMS Priority Alert</div>
                    <div className="text-[11px] text-slate-400">Direct carrier text alert delivered to your SIM</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.sms}
                  onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Push Channel */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">In-App & Browser Push Notification</div>
                    <div className="text-[11px] text-slate-400">Pop-up banner on mobile lock screen & desktop</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={channels.push}
                  onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Reminder Timing Schedule */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Reminder Schedule Trigger
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'sevenDays', label: '7 Days Before' },
                { key: 'threeDays', label: '3 Days Before' },
                { key: 'oneDay', label: '1 Day Before' },
                { key: 'dueDay', label: 'On Due Date' },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                    schedule[key]
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-slate-200'
                      : 'bg-slate-800/30 border-slate-700/50 text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={schedule[key]}
                    onChange={(e) => setSchedule({ ...schedule, [key]: e.target.checked })}
                    className="w-3.5 h-3.5 rounded text-indigo-600 cursor-pointer"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Actions: Test Alerts & Calendar Sync */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Live Reminders</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Test WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => downloadBillCalendarReminder(bill)}
                className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Sync .ICS Calendar</span>
              </button>
            </div>
            {testSent && (
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulated reminder dispatched to your WhatsApp!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
