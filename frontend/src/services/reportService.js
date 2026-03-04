import api from "./api";

/**
 * Get customers created this month by sector
 */
export const getCustomersThisMonth = (sectorCode) => {
  return api.get(`/reports/customers-this-month?sectorCode=${sectorCode}`);
};