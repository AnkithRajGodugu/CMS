import api from "./api";

/**
 * Get customers paginated
 */
export const getCustomers = (page = 0, size = 20, search = "") => {
  return api.get(
    `/v1/sectors/customers/paged?page=${page}&size=${size}&search=${search}`
  );
};

/**
 * Create customer
 */
export const createCustomer = (data) => {
  return api.post(`/v1/sectors/customers`, data);
};

/**
 * Update customer
 */
export const updateCustomer = (id, data) => {
  return api.put(`/v1/sectors/customers/${id}`, data);
};

/**
 * Delete customer
 */
export const deleteCustomer = (id) => {
  return api.delete(`/v1/sectors/customers/${id}`);
};