import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Info,
  Trash2,
  CheckCheck
} from 'lucide-react';

export const NotificationDrawer = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSelectBill
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Bill Reminders & Activity</h3>
              <p className="text-xs text-slate-400">
                {notifications.filter((n) => !n.read).length} unread alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onMarkAllAsRead}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            onClick={onClearAll}
            className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear list</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No notification activity yet</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUrgent = notif.type === 'urgent';
              const isSuccess = notif.type === 'success';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    if (notif.billId) onSelectBill(notif.billId);
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                    !notif.read
                      ? 'bg-slate-800/80 border-indigo-500/40 text-white shadow-sm'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isUrgent
                        ? 'bg-rose-500/15 text-rose-400'
                        : isSuccess
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-indigo-500/15 text-indigo-400'
                    }`}>
                      {isUrgent ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isSuccess ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 pr-3">
                      <div className="text-xs font-semibold text-slate-100 mb-0.5">
                        {notif.title}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        {notif.message}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1.5 font-medium">
                        {notif.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
