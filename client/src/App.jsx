import React, { useState, useEffect } from 'react';
import { PRESET_PROFILES, INITIAL_NOTIFICATIONS } from './data/mockBills';
import { Header } from './components/Header';
import { UrgentReminderBanner } from './components/UrgentReminderBanner';
import { StatsOverview } from './components/StatsOverview';
import { BillList } from './components/BillList';
import { AnalyticsView } from './components/AnalyticsView';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { AddBillModal } from './components/AddBillModal';
import { PaymentModal } from './components/PaymentModal';
import { ReminderModal } from './components/ReminderModal';
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal';
import { ReceiptModal } from './components/ReceiptModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Toast } from './components/Toast';
import { formatCurrency, formatPhoneDisplay } from './utils/helpers';
import { Shield, Sparkles, Smartphone, HeartHandshake, Zap, Bell } from 'lucide-react';

export function App() {
  // Load saved profile or default to Rahul Sharma
  const [currentPhone, setCurrentPhone] = useState(() => {
    try {
      const saved = localStorage.getItem('paypulse_phone');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PRESET_PROFILES[0];
  });

  // Load saved bills for this phone number
  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem(`paypulse_bills_${currentPhone?.phone || 'default'}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return currentPhone?.bills || PRESET_PROFILES[0].bills;
  });

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('paypulse_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Navigation View: 'bills' | 'analytics'
  const [currentView, setCurrentView] = useState('bills');

  // Modals state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  
  const [paymentBill, setPaymentBill] = useState(null);
  const [reminderBill, setReminderBill] = useState(null);
  const [whatsAppBill, setWhatsAppBill] = useState(null);
  const [receiptBill, setReceiptBill] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync current phone to localStorage
  useEffect(() => {
    if (currentPhone) {
      localStorage.setItem('paypulse_phone', JSON.stringify(currentPhone));
    }
  }, [currentPhone]);

  // Sync bills to localStorage whenever bills or currentPhone changes
  useEffect(() => {
    if (currentPhone?.phone) {
      localStorage.setItem(`paypulse_bills_${currentPhone.phone}`, JSON.stringify(bills));
    }
  }, [bills, currentPhone]);

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem('paypulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Switch phone profile
  const handleSelectPreset = (preset) => {
    setCurrentPhone(preset);
    // Check if there are saved bills in localStorage for this preset
    const saved = localStorage.getItem(`paypulse_bills_${preset.phone}`);
    if (saved) {
      setBills(JSON.parse(saved));
    } else {
      setBills(preset.bills || []);
    }
    showToast(
      'Profile Connected',
      `Switched to ${preset.name} (${preset.formatted}) with active bill monitoring.`
    );
  };

  // Connect custom phone number
  const handleConnectCustomPhone = (profileData) => {
    setCurrentPhone(profileData);
    const saved = localStorage.getItem(`paypulse_bills_${profileData.phone}`);
    if (saved) {
      setBills(JSON.parse(saved));
    } else {
      // Create with 2 sample utility bills for this custom number
      const sampleCustomBills = [
        {
          id: `bill-${Date.now()}-1`,
          category: 'Electricity',
          providerName: 'State Electricity Board',
          consumerId: `CA-${profileData.phone.slice(-6)}`,
          nickname: 'Home Primary Connection',
          amount: 1840,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isPaid: false,
          autoRemind: true,
          reminderChannels: { whatsapp: true, sms: true, push: true },
          lateFee: 120,
          billingPeriod: 'Current Month'
        },
        {
          id: `bill-${Date.now()}-2`,
          category: 'Mobile',
          providerName: 'Telecom Postpaid 5G',
          consumerId: profileData.phone,
          nickname: 'Personal Number Postpaid Plan',
          amount: 799,
          dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isPaid: false,
          autoRemind: true,
          reminderChannels: { whatsapp: true, sms: true, push: true },
          lateFee: 50,
          billingPeriod: 'Current Cycle'
        }
      ];
      setBills(sampleCustomBills);
    }
    showToast(
      'Phone Linked Successfully!',
      `Mobile ${profileData.formatted} verified. Connected bills synchronized.`
    );
  };

  // Add new bill
  const handleAddBill = (newBill) => {
    const updated = [newBill, ...bills];
    setBills(updated);
    
    // Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `New Bill Linked: ${newBill.providerName}`,
      message: `Bill of ${formatCurrency(newBill.amount)} connected to ${currentPhone?.formatted || 'your phone'}. Automated reminders are enabled.`,
      timestamp: 'Just now',
      type: 'info',
      read: false,
      billId: newBill.id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'Bill Connected & Protected',
      `${newBill.providerName} (₹${newBill.amount}) is now scheduled for proactive reminders.`
    );
  };

  // Payment successful
  const handlePaymentSuccess = (billId, paymentDetails) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return {
            ...b,
            isPaid: true,
            paidAt: paymentDetails.paidAt,
            paymentRef: paymentDetails.transactionId,
            paymentDetails
          };
        }
        return b;
      })
    );

    const paidBill = bills.find((b) => b.id === billId);
    setPaymentBill(null);

    // Open receipt modal automatically
    if (paidBill) {
      const updatedPaidBill = {
        ...paidBill,
        isPaid: true,
        paidAt: paymentDetails.paidAt,
        paymentRef: paymentDetails.transactionId,
        paymentDetails
      };
      setReceiptBill(updatedPaidBill);
    }

    // Add activity notification
    const notif = {
      id: `notif-${Date.now()}`,
      title: `Payment Success: ${paidBill?.providerName || 'Bill'}`,
      message: `Payment of ${formatCurrency(paymentDetails.amount)} authorized. Transaction ID: ${paymentDetails.transactionId}.`,
      timestamp: 'Just now',
      type: 'success',
      read: false,
      billId
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      'Payment Completed! 🎉',
      `Payment of ${formatCurrency(paymentDetails.amount)} cleared. Receipt generated.`
    );
  };

  // Toggle paid status manually
  const handleTogglePaidStatus = (billId) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const nextPaid = !b.isPaid;
          return {
            ...b,
            isPaid: nextPaid,
            paidAt: nextPaid ? new Date().toISOString() : null
          };
        }
        return b;
      })
    );
  };

  // Toggle auto-remind
  const handleToggleAutoRemind = (billId) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          const updatedState = !b.autoRemind;
          showToast(
            updatedState ? 'Reminders Activated' : 'Reminders Paused',
            `Auto-reminders for ${b.providerName} are now ${updatedState ? 'ACTIVE' : 'PAUSED'}.`,
            'info'
          );
          return { ...b, autoRemind: updatedState };
        }
        return b;
      })
    );
  };

  // Update bill reminders configuration
  const handleUpdateBillReminders = (billId, { autoRemind, reminderChannels }) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id === billId) {
          return { ...b, autoRemind, reminderChannels };
        }
        return b;
      })
    );
    showToast('Reminder Settings Saved', 'Your notification schedule and channels have been updated.');
  };

  // Delete bill
  const handleDeleteBill = (billId) => {
    const billToDelete = bills.find((b) => b.id === billId);
    setBills((prev) => prev.filter((b) => b.id !== billId));
    showToast(
      'Bill Removed',
      `${billToDelete?.providerName || 'Bill'} removed from your connected account.`,
      'info'
    );
  };

  // Test WhatsApp simulation
  const handleOpenWhatsAppTest = (bill) => {
    setWhatsAppBill(bill);
  };

  // Notification drawer handlers
  const handleMarkNotifRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Marked as Read', 'All notifications marked as read.', 'info');
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
    showToast('Activity Cleared', 'Notification feed has been reset.', 'info');
  };

  const handleSelectBillFromNotif = (billId) => {
    const target = bills.find((b) => b.id === billId);
    if (target) {
      setIsNotificationDrawerOpen(false);
      setPaymentBill(target);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background ambient decorative glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Navigation Header */}
      <Header
        currentPhone={currentPhone}
        unreadCount={unreadNotifCount}
        onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        onOpenAddModal={() => setIsAddBillModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Urgent Reminder Banner */}
        <UrgentReminderBanner
          bills={bills}
          onPayBill={(bill) => setPaymentBill(bill)}
          onOpenReminder={(bill) => setReminderBill(bill)}
          onTestWhatsApp={handleOpenWhatsAppTest}
        />

        {/* Overview Stats */}
        <StatsOverview
          bills={bills}
          currentPhone={currentPhone}
          onOpenPhoneModal={() => setIsPhoneModalOpen(true)}
        />

        {/* View Switcher: Bills vs Analytics */}
        {currentView === 'analytics' ? (
          <AnalyticsView bills={bills} />
        ) : (
          <BillList
            bills={bills}
            onPay={(bill) => setPaymentBill(bill)}
            onOpenReminder={(bill) => setReminderBill(bill)}
            onToggleAutoRemind={handleToggleAutoRemind}
            onDelete={handleDeleteBill}
            onTogglePaidStatus={handleTogglePaidStatus}
            onViewReceipt={(bill) => setReceiptBill(bill)}
            onTestWhatsApp={handleOpenWhatsAppTest}
            onOpenAddModal={() => setIsAddBillModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PayPulse Reminders</span>
            <span>&bull;</span>
            <span>Connected to {currentPhone?.formatted || 'Mobile'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>NPCI Bharat BillPay (BBPS) Partner</span>
            </span>
            <span>&bull;</span>
            <span>Instant WhatsApp & SMS Push</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PhoneConnectModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        currentPhone={currentPhone}
        onConnectPhone={handleConnectCustomPhone}
        onSelectPreset={handleSelectPreset}
      />

      <AddBillModal
        isOpen={isAddBillModalOpen}
        onClose={() => setIsAddBillModalOpen(false)}
        connectedPhone={currentPhone}
        onAddBill={handleAddBill}
      />

      <PaymentModal
        isOpen={!!paymentBill}
        onClose={() => setPaymentBill(null)}
        bill={paymentBill}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReminderModal
        isOpen={!!reminderBill}
        onClose={() => setReminderBill(null)}
        bill={reminderBill}
        connectedPhone={currentPhone}
        onUpdateBillReminders={handleUpdateBillReminders}
        onTriggerTestNotification={({ bill }) => {
          handleOpenWhatsAppTest(bill);
        }}
      />

      <WhatsAppPreviewModal
        isOpen={!!whatsAppBill}
        onClose={() => setWhatsAppBill(null)}
        bill={whatsAppBill}
        phone={currentPhone?.formatted || currentPhone?.phone}
        onPayNow={(bill) => {
          setWhatsAppBill(null);
          setPaymentBill(bill);
        }}
      />

      <ReceiptModal
        isOpen={!!receiptBill}
        onClose={() => setReceiptBill(null)}
        bill={receiptBill}
        connectedPhone={currentPhone}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onClearAll={handleClearAllNotifs}
        onSelectBill={handleSelectBillFromNotif}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
