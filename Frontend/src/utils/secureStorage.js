import CryptoJS from 'crypto-js';

/**
 * Secure Storage Utility
 * Encrypts sensitive data before storing in localStorage
 */

// Get encryption key from environment or use a default (should be in env for production)
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

/**
 * Encrypt data before storage
 */
const encrypt = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

/**
 * Decrypt data after retrieval
 */
const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Secure Storage API
 */
const secureStorage = {
  /**
   * Set item in secure storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  setItem: (key, value) => {
    try {
      const encrypted = encrypt(value);
      if (encrypted) {
        localStorage.setItem(key, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      console.error('SecureStorage setItem error:', error);
      return false;
    }
  },

  /**
   * Get item from secure storage
   * @param {string} key - Storage key
   * @returns {any} Decrypted value or null
   */
  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decrypt(encrypted);
    } catch (error) {
      console.error('SecureStorage getItem error:', error);
      return null;
    }
  },

  /**
   * Remove item from secure storage
   * @param {string} key - Storage key
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('SecureStorage removeItem error:', error);
      return false;
    }
  },

  /**
   * Clear all secure storage
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('SecureStorage clear error:', error);
      return false;
    }
  },

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  hasItem: (key) => {
    return localStorage.getItem(key) !== null;
  },
};

/**
 * Token Storage - Special handling for JWT tokens
 */
export const tokenStorage = {
  set: (token) => {
    if (!token) return false;
    return secureStorage.setItem('auth_token', token);
  },

  get: () => {
    return secureStorage.getItem('auth_token');
  },

  remove: () => {
    return secureStorage.removeItem('auth_token');
  },

  exists: () => {
    return secureStorage.hasItem('auth_token');
  },
};

/**
 * User Data Storage - For caching user profile
 */
export const userStorage = {
  set: (user) => {
    if (!user) return false;
    return secureStorage.setItem('user_data', user);
  },

  get: () => {
    return secureStorage.getItem('user_data');
  },

  remove: () => {
    return secureStorage.removeItem('user_data');
  },

  exists: () => {
    return secureStorage.hasItem('user_data');
  },
};

/**
 * Clear all auth-related data
 */
export const clearAuthData = () => {
  tokenStorage.remove();
  userStorage.remove();
};

export default secureStorage;
