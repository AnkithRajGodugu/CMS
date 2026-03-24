import api from './api';

/**
 * Get dashboard statistics for banking sector
 * Backend endpoint:
 * /api/sectors/banking/dashboard/stats
 */
export const getBankingDashboardStats = () => {
  return api.get('/sectors/banking/dashboard/stats');
};

/**
 * Get current user's banking dashboard statistics
 * Backend endpoint: /api/sectors/banking/my-dashboard
 */
export const getUserBankingDashboardStats = () => {
  return api.get('/sectors/banking/my-dashboard');
};

/**
 * Get current user's bank accounts
 * Backend endpoint: /api/sectors/banking/my-accounts
 */
export const getUserAccounts = () => {
  return api.get('/sectors/banking/my-accounts');
};

/**
 * Get recent banking transactions
 * Backend endpoint:
 * /api/sectors/banking/transactions
 */
export const getRecentTransactions = (page = 0, size = 5) => {
  return api.get(`/sectors/banking/transactions?page=${page}&size=${size}`);
};

/**
 * Create a new bank transfer
 * @param {Object} data - Transfer details
 */
export const createTransfer = (data) => {
  return api.post('/banking/transfers', data);
};