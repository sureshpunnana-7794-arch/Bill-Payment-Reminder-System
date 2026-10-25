/**
 * Structured logger utility with timestamp and safe credential masking
 */

const maskSensitiveData = (data) => {
  if (!data) return data;
  if (typeof data === 'string') {
    // Mask password in connection string or auth header
    return data.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/g, '$1****$2');
  }
  return data;
};

export const logger = {
  info: (message, meta = '') => {
    const time = new Date().toISOString();
    console.log(`[${time}] [INFO] ${maskSensitiveData(message)}`, meta ? maskSensitiveData(meta) : '');
  },
  warn: (message, meta = '') => {
    const time = new Date().toISOString();
    console.warn(`[${time}] [WARN] ${maskSensitiveData(message)}`, meta ? maskSensitiveData(meta) : '');
  },
  error: (message, meta = '') => {
    const time = new Date().toISOString();
    console.error(`[${time}] [ERROR] ${maskSensitiveData(message)}`, meta ? maskSensitiveData(meta) : '');
  },
  debug: (message, meta = '') => {
    if (process.env.NODE_ENV !== 'production') {
      const time = new Date().toISOString();
      console.log(`[${time}] [DEBUG] ${maskSensitiveData(message)}`, meta ? maskSensitiveData(meta) : '');
    }
  }
};
