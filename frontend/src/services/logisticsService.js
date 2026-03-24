import api from './api';

/**
 * Get current user's logistics dashboard statistics
 */
export const getUserLogisticsDashboardStats = () => {
  return api.get('/logistics/my-dashboard');
};

/**
 * Get the current user's shipments
 */
export const getMyShipments = (page = 0, size = 20) => {
  return api.get(`/logistics/my-shipments?page=${page}&size=${size}`);
};

/**
 * Track a specific shipment by tracking ID
 * @param {string} trackingId - The unique tracking ID
 */
export const trackShipment = (trackingId) => {
  return api.get(`/logistics/shipments/track/${trackingId}`);
};

/**
 * Get the current user's order history
 */
export const getMyOrders = () => {
  return api.get('/logistics/orders/me');
};
