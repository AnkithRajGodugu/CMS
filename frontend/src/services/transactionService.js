import api from './api';

/**
 * Get all transactions (paginated)
 */
export const getTransactions = (page = 0, size = 10) => {
  return api.get(`/sectors/banking/transactions?page=${page}&size=${size}`);
};

/**
 * Get transaction by id
 */
export const getTransactionById = (id) => {
  return api.get(`/sectors/banking/transactions/${id}`);
};

/**
 * Get transactions by account number
 */
export const getTransactionsByAccount = (accountNumber) => {
  return api.get(`/sectors/banking/transactions/account/${accountNumber}`);
};

/**
 * Create transaction
 */
export const createTransaction = (data) => {
  return api.post(`/sectors/banking/transactions`, data);
};