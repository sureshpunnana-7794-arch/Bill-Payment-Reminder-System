# ⚡ PayPulse | Phone-Connected Smart Bill Payment & Reminder System

A modern, stylish, full-featured web application designed to connect to your phone number and automatically track, remind, and manage all your utility bills with instant payment settlement.

![PayPulse Application](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Key Features

### 1. 📱 Mobile Number Connection & Bill Synchronization
- **One-Click & OTP Phone Connection:** Connect your actual 10-digit mobile number or switch between pre-loaded demo profiles:
  - **Rahul Sharma** (`+91 98765 43210`): Electricity, Broadband, Credit Card, Mobile, Gas, Water.
  - **Priya Patel** (`+91 98123 45678`): Tech office electricity, Gigabit fiber, Business card.
  - **Vikram Verma** (`+91 91234 56789`): House rent, DTH 4K pack.
  - **Custom Mobile Number**: Enter any phone number to link your personal bills.
- **Persistent Storage:** All added bills, payment records, and reminder preferences are saved in browser `localStorage`.

### 2. 🔔 Intelligent Reminder Engine
- **Urgent Reminder Banner:** Automatically detects upcoming bills due today, tomorrow, overdue, or within 3 days.
- **Dynamic Urgency Badges:** Real-time countdowns (`Due Today!`, `Due Tomorrow`, `Due in 4 days`, `Overdue by 2 days`, `Paid`).
- **Omnichannel Reminder Channels:**
  - 💬 **Interactive WhatsApp Alerts:** Previews authentic WhatsApp chat notifications with instant "Pay Now" links.
  - 📲 **SMS Carrier Alerts:** SMS notification triggers.
  - 🔔 **In-App & Browser Push:** System desktop / mobile push notification permissions and alerts.
  - 📅 **One-Click iCalendar Sync (.ics):** Download standard `.ics` calendar events directly into Google Calendar, Apple Calendar, or Outlook.
- **Customizable Reminder Lead Times:** Trigger reminders 7 days before, 3 days before, 1 day before, and on the due date.

### 3. 💳 BBPS Multi-Channel Payment Gateway Simulator
- **Unified Payment Modes:**
  - ⚡ **UPI & QR:** Google Pay, PhonePe, Paytm, CRED UPI, or custom UPI ID.
  - 💳 **Credit / Debit Cards:** Interactive 3D credit card display with live cardholder and expiry rendering.
  - 🏦 **Net Banking:** Top banks (HDFC, ICICI, SBI, Axis, Kotak, PNB).
- **Celebratory Confirmation:** Integrated `canvas-confetti` bursts on successful payment.
- **Official E-Receipt / Tax Invoice:** Generates downloadable and printable BBPS transaction invoices with transaction IDs.

### 4. 📊 Financial Analytics & Spend Breakdown
- **Utility Category Distribution:** Interactive visual progress breakdown (Electricity, Mobile, Broadband, Gas, Water, Rent, Cards).
- **Penalty Shield Rating:** Displays late fees saved and timely payment compliance score.
- **Search, Filter & Sorting:** Real-time search by provider or consumer ID, filter by category or urgency status, and sort by due date or amount.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS + Glassmorphism aesthetic
- **Icons:** Lucide React
- **Animations:** Canvas-Confetti, CSS pulse keyframes, backdrop blur
- **Data Persistence:** LocalStorage API

---

## 💻 How to Run Locally

```bash
# 1. Navigate to the client directory
cd client

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Then open **`http://localhost:5173`** in your browser.