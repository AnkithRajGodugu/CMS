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
 * Get recent banking transactions
 * Backend endpoint:
 * /api/sectors/banking/transactions
 */
export const getRecentTransactions = (page = 0, size = 5) => {
  return api.get(`/sectors/banking/transactions?page=${page}&size=${size}`);
};