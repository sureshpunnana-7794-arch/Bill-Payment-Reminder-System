/**
 * PayPulse Centralized API Service
 * Handles base URL, auth token injection, automatic refresh on 401, error normalization, and offline detection.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';

let inMemoryToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAccessToken = (token) => {
  inMemoryToken = token;
  if (token) {
    try {
      sessionStorage.setItem('paypulse_access_token', token);
    } catch {
      // safe fallback
    }
  } else {
    try {
      sessionStorage.removeItem('paypulse_access_token');
    } catch {
      // safe fallback
    }
  }
};

export const getAccessToken = () => {
  if (inMemoryToken) return inMemoryToken;
  try {
    const saved = sessionStorage.getItem('paypulse_access_token');
    if (saved) {
      inMemoryToken = saved;
      return saved;
    }
  } catch {
    // safe fallback
  }
  return null;
};

/**
 * Core HTTP Request Wrapper
 */
export async function apiRequest(endpoint, options = {}, isRetry = false) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAccessToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send cookies for refresh token
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized with automatic token refresh
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
          return apiRequest(endpoint, options, true);
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        const refreshData = await refreshRes.json();
        if (refreshRes.ok && refreshData.success && refreshData.data?.accessToken) {
          const newToken = refreshData.data.accessToken;
          setAccessToken(newToken);
          processQueue(null, newToken);
          isRefreshing = false;

          options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
          return apiRequest(endpoint, options, true);
        } else {
          setAccessToken(null);
          processQueue(new Error('Session expired'), null);
          isRefreshing = false;
        }
      } catch (refreshErr) {
        setAccessToken(null);
        processQueue(refreshErr, null);
        isRefreshing = false;
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.errors = data.errors || null;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineError = new Error('Cannot connect to backend server. Please verify your connection.');
      offlineError.isNetworkError = true;
      offlineError.status = 0;
      throw offlineError;
    }
    throw err;
  }
}

/**
 * PayPulse API Modules
 */
export const api = {
  // Health & Diagnostics
  health: {
    check: () => apiRequest('/health')
  },

  // Authentication
  auth: {
    register: async (userData) => {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      return res;
    },
    login: async (credentials) => {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      return res;
    },
    demoLogin: async (profileData) => {
      const res = await apiRequest('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
      }
      return res;
    },
    refresh: () => apiRequest('/auth/refresh', { method: 'POST' }),
    logout: async () => {
      try {
        await apiRequest('/auth/logout', { method: 'POST' });
      } finally {
        setAccessToken(null);
      }
    },
    getMe: () => apiRequest('/auth/me'),
    updateMe: (data) => apiRequest('/auth/me', { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (data) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(data) })
  },

  // Bill Management
  bills: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const qStr = query.toString();
      return apiRequest(`/bills${qStr ? `?${qStr}` : ''}`);
    },
    getById: (id) => apiRequest(`/bills/${id}`),
    create: (billData) => apiRequest('/bills', {
      method: 'POST',
      body: JSON.stringify(billData)
    }),
    update: (id, billData) => apiRequest(`/bills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(billData)
    }),
    updateStatus: (id, isPaid) => apiRequest(`/bills/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isPaid })
    }),
    delete: (id) => apiRequest(`/bills/${id}`, {
      method: 'DELETE'
    }),
    getSummary: (params = {}) => {
      const query = new URLSearchParams();
      if (params.year !== undefined) query.append('year', params.year);
      if (params.month !== undefined) query.append('month', params.month);
      const qStr = query.toString();
      return apiRequest(`/bills/summary${qStr ? `?${qStr}` : ''}`);
    },
    getCategories: () => apiRequest('/bills/categories')
  },

  // Payments & Receipts
  payments: {
    create: (paymentData) => apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    }),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return apiRequest(`/payments${query ? `?${query}` : ''}`);
    },
    getById: (id) => apiRequest(`/payments/${id}`),
    getReceipt: (id) => apiRequest(`/payments/${id}/receipt`),
    getBillPayments: (billId) => apiRequest(`/bills/${billId}/payments`)
  },

  // Reminders
  reminders: {
    getAll: () => apiRequest('/reminders'),
    save: (reminderData) => apiRequest('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData)
    }),
    update: (id, data) => apiRequest(`/reminders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
    delete: (id) => apiRequest(`/reminders/${id}`, {
      method: 'DELETE'
    }),
    test: (id, channel = 'whatsapp') => apiRequest(`/reminders/${id}/test`, {
      method: 'POST',
      body: JSON.stringify({ channel })
    })
  },

  // Notifications
  notifications: {
    getAll: () => apiRequest('/notifications'),
    markAsRead: (id) => apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),
    markAllAsRead: () => apiRequest('/notifications/read-all', {
      method: 'PATCH'
    }),
    clearAll: () => apiRequest('/notifications', {
      method: 'DELETE'
    })
  }
};
