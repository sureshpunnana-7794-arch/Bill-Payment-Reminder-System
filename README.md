# ⚡ PayPulse | Smart Bill Payment & Reminder System

PayPulse is a modern, responsive web application for tracking, reminding, and paying utility bills. It connects to your phone profile, manages scheduled payments, calculates monthly obligations, and automates multi-channel notifications (WhatsApp, SMS, Push, and Calendar).

---

## 🚀 How to Run the Application

Follow these steps to run the application on your local machine:

### 1. Prerequisites
Make sure you have **Node.js** and **npm** installed on your system:
- **Node.js**: v18.0.0 or higher (v20+ or v22 recommended)
- **npm**: v9.0.0 or higher

You can verify your versions by running:
```bash
node -v
npm -v
```

---

### 2. Clone the Repository
```bash
git clone https://github.com/sureshpunnana-7794-arch/Bill-Payment-Reminder-System.git
cd Bill-Payment-Reminder-System
```

---

### 3. Install Dependencies
Install all required project packages:
```bash
npm install
```

---

### 4. Start Development Server
Run the local Vite development server:
```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:3000
```
*(The dev server is configured to bind to `0.0.0.0:3000`)*

---

### 5. Build for Production
To generate an optimized production build:
```bash
npm run build
```
The compiled static assets will be output to the `dist/` folder.

---

### 6. Preview Production Build
To preview the production build locally before deploying:
```bash
npm run preview
```
This serves the contents of `dist/` on `http://localhost:3000`.

---

### 7. Run Code Quality Checks (Lint)
To run the high-speed Oxlint linter:
```bash
npm run lint
```

---

## 📋 Available npm Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` with hot reloading |
| `npm run build` | Compiles and bundles production-ready assets into `/dist` |
| `npm run preview` | Previews the production build locally on port 3000 |
| `npm run lint` | Runs `oxlint` to analyze codebase for syntax issues and code quality |

---

## 🌟 Key Application Features

### 1. 📊 Monthly Bill Due Dashboard
- **Current Month Total Due Calculation:** Automatically computes the net sum of all pending bills due in the current month.
- **Interactive Paid / Pending Checkbox & Toggle:** Click to mark any bill as **Paid** or **Pending**. Marking a bill as Paid instantly updates and excludes it from the current month total due calculation.
- **Month Switcher:** Navigate backward and forward across billing months to review archived cycles or upcoming obligations.
- **Dual Display Modes:** Switch between a responsive Card Grid and a high-density tabular Ledger view.

### 2. 📝 Add New Bill Form with LocalStorage Persistence
- **Input Fields:** Enter Bill Name, Due Date, and Amount.
- **Category Selection:** Assign categories like **Utilities**, **Rent**, **Subscriptions**, **Electricity**, **Broadband**, **Credit Cards**, and more.
- **Smart Category Auto-Detection:** Automatically infers category as you type the provider or bill name (e.g., typing "Netflix" sets Subscriptions, "BESCOM" sets Utilities, "Rent" sets Rent).
- **Instant Persistence:** New bills are saved directly to browser `localStorage` under both generic keys (`saved_bills`) and phone-specific keys (`paypulse_bills_<phone>`).
- **Flexible Access:** Available both inline in the Dashboard and via the top navigation "+ Link Bill" modal.

### 3. 🏷️ Color-Coded Category Badges
- Color-coded badges with contextual icons for every category:
  - ⚡ **Utilities & Electricity** (Amber)
  - 🏠 **Rent** (Emerald)
  - ✨ **Subscriptions** (Purple)
  - 🌐 **Broadband / Wi-Fi** (Sky Blue)
  - 📱 **Mobile Postpaid** (Teal)
  - 💳 **Credit Cards** (Indigo)
  - 💧 **Water & Gas** (Cyan / Rose)
- Displayed across dashboard cards, table ledger rows, and forms.

### 4. 📱 Mobile Number Profiles & Data Sync
- Pre-loaded with demo profiles (**Rahul Sharma**, **Priya Patel**, **Vikram Verma**) to explore with real sample utility accounts.
- **Custom Phone Connect:** Connect any 10-digit mobile number with simulated OTP verification.
- All bills, preferences, and payment transactions persist across page reloads.

### 5. 🔔 Smart Reminder Engine & Channels
- **Urgent Reminder Banner:** Flags bills that are overdue, due today, or due in the next 3 days.
- **WhatsApp Notification Simulator:** Live interactive preview of real-time WhatsApp alert templates with "Pay Now" links.
- **Calendar Export (.ics):** Download standard `.ics` calendar events directly into Google Calendar, Apple Calendar, or Microsoft Outlook.
- **Notification Drawer:** Activity log recording bill linkages, payment confirmations, and reminder triggers.

### 6. 💳 Payment Gateway Simulation & E-Receipts
- Simulated payment checkout supporting **UPI / QR** (GPay, PhonePe, Paytm, CRED), **Cards**, and **Net Banking**.
- Celebratory confetti animation upon payment success.
- Instant official BBPS receipt generation with printable and downloadable invoice layout.

---

## 📂 Project Structure

```
├── index.html                 # HTML entry point with meta tags & Google fonts
├── package.json               # Dependencies and build scripts
├── vite.config.js             # Vite 8 configuration (host 0.0.0.0, port 3000)
├── metadata.json              # Applet metadata and capabilities
├── .env.example               # Environment variables template
├── public/                    # Static assets & icons
└── src/
    ├── main.jsx               # React DOM entry point
    ├── App.jsx                # Main application container & view manager
    ├── index.css              # Global styles & Tailwind CSS directives
    ├── components/
    │   ├── Dashboard.jsx           # Monthly Bill Due Dashboard & ledger view
    │   ├── AddBillForm.jsx         # Add bill form with validation & localStorage
    │   ├── AddBillModal.jsx        # Modal dialog wrapper for AddBillForm
    │   ├── CategoryBadge.jsx       # Color-coded category badge component
    │   ├── CategoryIcon.jsx        # Category icon mapper
    │   ├── BillCard.jsx            # Interactive bill card with Paid toggle
    │   ├── BillList.jsx            # Searchable, filterable list of bills
    │   ├── Header.jsx              # Navigation header and phone profile pill
    │   ├── PaymentModal.jsx        # Simulated payment checkout flow
    │   ├── ReceiptModal.jsx        # Printable BBPS invoice receipt
    │   ├── ReminderModal.jsx       # Multi-channel reminder configuration
    │   ├── UrgentReminderBanner.jsx# Alert banner for overdue / urgent bills
    │   ├── WhatsAppPreviewModal.jsx# WhatsApp notification simulation modal
    │   ├── NotificationDrawer.jsx  # Slide-out notification activity drawer
    │   ├── StatsOverview.jsx       # Overview metrics cards
    │   ├── AnalyticsView.jsx       # Category spend charts and penalty rating
    │   └── Toast.jsx               # Toast notification system
    ├── data/
    │   └── mockBills.js       # Initial seed data and demo user profiles
    └── utils/
        ├── helpers.js         # Formatting, date calculations, monthly due logic
        └── calendar.js        # .ics calendar event file generator
```

---

## 🛠️ Technology Stack

- **Frontend Library:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **CSS Framework:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations & Effects:** `canvas-confetti`
- **Linter:** `oxlint`
- **Storage:** HTML5 LocalStorage API (zero external database setup required)