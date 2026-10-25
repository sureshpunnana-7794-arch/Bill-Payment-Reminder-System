# ⚡ PayPulse | Smart Full-Stack Bill Payment & Reminder System

PayPulse is an enterprise-grade full-stack web application for tracking, reminding, managing, and paying utility bills. It connects mobile profiles to utility provider accounts, calculates monthly financial obligations, provides spend analytics, and coordinates multi-channel alerts (WhatsApp, SMS, Push, and Calendar Sync).

Built with **React 19**, **Tailwind CSS v4**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)** with enterprise JWT authentication, role-based resource ownership, and comprehensive automated test coverage.

---

## 🌟 Key Architecture & Highlights

- **Backend Architecture:** Express.js REST API with modular controllers, services, Mongoose schemas, and Zod input validation.
- **Persistent Database:** MongoDB (supporting Atlas Cloud & local instances) with compound indexing on users, due dates, categories, and payment references.
- **Authentication:** Dual-token JWT system with short-lived access tokens, encrypted refresh token rotation, and HttpOnly cookies.
- **Per-User Scoping:** Strict data isolation ensuring each user accesses only their own bills, reminders, payments, and notifications.
- **Simulated BBPS Gateway:** NPCI Bharat BillPay simulation supporting UPI/QR, Cards, and Net Banking with printable tax receipts.
- **Dual Client Sync:** Centralized API client (`src/services/api.js`) with automatic 401 token refresh queue and client fallback.
- **Automated Test Suite:** In-memory MongoDB testing with Vitest and Supertest across authentication, billing, payments, and reminders.

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (`v20+` or `v24` recommended)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/paypulse`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string.

Verify installed versions:
```bash
node -v
npm -v
```

---

### 2. Clone the Repository & Install Dependencies
```bash
git clone https://github.com/sureshpunnana-7794-arch/Bill-Payment-Reminder-System.git
cd Bill-Payment-Reminder-System
npm install
```

---

### 3. Configure Environment Variables

Create your local `.env` file from the provided `.env.example`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

#### Generating Secure JWT Secrets
Generate two 64-character random cryptographic secrets using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Configure your `.env` values:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB URI (Atlas Cloud or Local Instance)
MONGODB_URI=mongodb://127.0.0.1:27017/paypulse

# JWT Secret Configuration
JWT_SECRET=your_generated_jwt_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

---

### 4. Setting Up MongoDB Atlas (Step-by-Step for Beginners)

If you do not have local MongoDB installed, use MongoDB Atlas (100% Free):
1. Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **M0 Free Cluster** in your closest geographic region.
3. Under **Security > Database Access**, click **Add New Database User**. Choose **Password Authentication**, set a username and secure password, and grant **Read and write to any database**.
4. Under **Security > Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** for development.
5. In **Database > Clusters**, click **Connect > Drivers**. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/paypulse?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials and paste into `MONGODB_URI` in `.env`.

---

### 5. Running the Application

| Mode | Command | Description |
| :--- | :--- | :--- |
| **Full Stack (Recommended)** | `npm run dev:full` | Concurrently starts Vite frontend (`http://localhost:3000`) and Express backend (`http://localhost:5000`) |
| **Backend Server Only** | `npm run server` | Starts Express backend server on port 5000 |
| **Backend Development** | `npm run server:dev` | Starts Express backend with automatic file-watch reload |
| **Frontend Only** | `npm run dev` | Starts Vite client dev server with proxy to port 5000 |
| **Production Build** | `npm run build` | Compiles optimized static assets into `/dist` |
| **Run Linter** | `npm run lint` | Analyzes code quality using Oxlint |
| **Run Automated Tests** | `npm test` | Executes in-memory MongoDB test suite via Vitest |

To launch both frontend and backend concurrently:
```bash
npm run dev:full
```
Open your browser to: **`http://localhost:3000`**

---

### 6. Health & Diagnostics Verification

Verify that the backend and database connection are operational:
```bash
curl http://localhost:5000/api/health
```

**Sample Response:**
```json
{
  "success": true,
  "status": "healthy",
  "message": "PayPulse API and database are fully operational.",
  "database": {
    "status": "connected"
  },
  "uptime": 42,
  "timestamp": "2026-10-25T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 📚 REST API Reference

All protected endpoints require an `Authorization: Bearer <accessToken>` header or an authenticated session cookie.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account with initial starter bills | No |
| `POST` | `/api/auth/login` | Authenticate with email & password | No |
| `POST` | `/api/auth/demo-login` | 1-click login / preset profile switcher (Rahul, Priya, Vikram) | No |
| `POST` | `/api/auth/refresh` | Rotate refresh token & issue new access token | Cookie / Body |
| `POST` | `/api/auth/logout` | Revoke session & clear cookies | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | **Yes** |
| `PATCH` | `/api/auth/me` | Update name, phone, or avatar | **Yes** |
| `POST` | `/api/auth/change-password` | Update account password | **Yes** |

### Bills (`/api/bills`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/bills` | List user bills (supports `search`, `category`, `status`, `year`, `month`, `page`) | **Yes** |
| `GET` | `/api/bills/summary` | Aggregated monthly totals, due breakdown, and category stats | **Yes** |
| `GET` | `/api/bills/categories` | List supported utility categories | No |
| `POST` | `/api/bills` | Link a new bill with auto-reminder schedule | **Yes** |
| `GET` | `/api/bills/:id` | Get bill details | **Yes** |
| `PATCH` | `/api/bills/:id` | Update bill details | **Yes** |
| `PATCH` | `/api/bills/:id/status` | Toggle or set `isPaid` status | **Yes** |
| `DELETE` | `/api/bills/:id` | Remove bill from account | **Yes** |
| `GET` | `/api/bills/:id/payments` | Get payment transaction history for a bill | **Yes** |

### Payments (`/api/payments`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/payments` | Settle bill payment & generate transaction reference | **Yes** |
| `GET` | `/api/payments` | Get user payment transaction history | **Yes** |
| `GET` | `/api/payments/:id` | Get individual payment record | **Yes** |
| `GET` | `/api/payments/:id/receipt` | Generate official BBPS E-Receipt tax invoice | **Yes** |

### Reminders (`/api/reminders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/reminders` | Fetch reminder configurations | **Yes** |
| `POST` | `/api/reminders` | Create or update reminder preferences for a bill | **Yes** |
| `PATCH` | `/api/reminders/:id` | Update reminder channels & schedule triggers | **Yes** |
| `DELETE` | `/api/reminders/:id` | Delete reminder configuration | **Yes** |
| `POST` | `/api/reminders/:id/test` | Trigger simulated test dispatch (WhatsApp/SMS/Push) | **Yes** |

### Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/notifications` | Fetch user activity notification stream | **Yes** |
| `PATCH` | `/api/notifications/:id/read` | Mark individual notification as read | **Yes** |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read | **Yes** |
| `DELETE` | `/api/notifications` | Clear notification feed | **Yes** |

---

## 🧪 Automated Testing

The project includes an in-memory MongoDB test suite running via Vitest and Supertest:
```bash
npm test
```
The test suite validates:
- API health and database degradation handling
- Password hashing and secure token rotation
- Invalid credentials, token expiry, and revocation
- CRUD bill management and user data isolation
- Duplicate payment prevention on settled bills
- Aggregated financial calculations for dashboard summaries
- Cross-user authorization access denial

---

## 🛠️ Production Deployment Guidelines

### Separate Deployment (Render, Railway, or Fly.io)

1. **Deploying the Backend (Web Service):**
   - Root directory: `./`
   - Build command: `npm install`
   - Start command: `node server/src/server.js`
   - Environment variables:
     - `PORT`: `5000` (or provided by host)
     - `NODE_ENV`: `production`
     - `CLIENT_URL`: `https://your-frontend-domain.com`
     - `MONGODB_URI`: `mongodb+srv://...`
     - `JWT_SECRET`: `secure_random_hex_string_min_32_chars`
     - `JWT_REFRESH_SECRET`: `different_secure_random_hex_string_min_32_chars`

2. **Deploying the Frontend (Static Site or SPA):**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variable:
     - `VITE_API_URL`: `https://your-backend-api-url.com`

---

## ⚖️ Demo Features & External Service Integrations

- **Simulated Payment Gateway:** The checkout modal simulates UPI/Cards/Net Banking settlement. To integrate a real payment gateway (Razorpay, Stripe, or Cashfree), update `server/src/controllers/paymentController.js` with server-side order creation and webhook signature verification.
- **Simulated Notifications:** The WhatsApp Preview modal and reminder triggers simulate alert delivery. To connect live delivery, configure Twilio (SMS / WhatsApp Business API) or Firebase Cloud Messaging (Web Push) in `server/src/services/reminderService.js`.
