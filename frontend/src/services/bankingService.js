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
 * Create a new bank transfer (internal between own accounts)
 * @param {Object} data - Transfer details { fromAccount, toAccount, amount, description }
 */
export const createBankAccount = (accountData) => {
  return api.post('/sectors/banking/accounts', accountData);
};

/**
 * Create a new bank transfer (internal between own accounts)
 * @param {Object} data - Transfer details { fromAccount, toAccount, amount, description }
 */
export const createTransfer = (data) => {
  return api.post('/sectors/banking/my-transfer', data);
};

/**
 * Create an external bank transfer (to a different bank)
 * @param {Object} data - Transfer details { fromAccount, routingNumber, externalAccount, amount, description }
 */
export const createExternalTransfer = (data) => {
  return api.post('/sectors/banking/my-external-transfer', data);
};