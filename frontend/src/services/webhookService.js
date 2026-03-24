import api from './api';

export const getOrganizations = async () => {
    const response = await api.get('/organizations');
    return response.data; // Page<OrganizationResponse>
};

export const getWebhooks = async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/webhooks`);
    return response.data;
};

export const createWebhook = async (orgId, data) => {
    const response = await api.post(`/organizations/${orgId}/webhooks`, data);
    return response.data;
};

export const updateWebhook = async (orgId, webhookId, data) => {
    const response = await api.put(`/organizations/${orgId}/webhooks/${webhookId}`, data);
    return response.data;
};

export const deleteWebhook = async (orgId, webhookId) => {
    const response = await api.delete(`/organizations/${orgId}/webhooks/${webhookId}`);
    return response.data;
};
