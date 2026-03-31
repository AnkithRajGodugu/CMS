import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import api from '../../services/api';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Building, Webhook, Eye, EyeOff } from 'lucide-react';

const OrganizationSettingsPage = () => {
    const { user } = useContext(AuthContext);
    const orgId = user?.organizationId;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [orgData, setOrgData] = useState({ name: '', domain: '' });
    const [settings, setSettings] = useState({});
    const [kvList, setKvList] = useState([]);

    // ---------- Webhook state ----------
    const [webhooks, setWebhooks] = useState([]);
    const [newWebhook, setNewWebhook] = useState({ url: '', secret: '', eventTypes: '*' });
    const [addingWebhook, setAddingWebhook] = useState(false);
    const [showSecret, setShowSecret] = useState({});

    const AVAILABLE_EVENTS = ['*', 'CUSTOMER_CREATED', 'CUSTOMER_UPDATED', 'LEAD_CREATED', 'USER_REGISTERED', 'LOGIN_SUCCESS'];


    useEffect(() => {
        if (orgId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [orgId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [orgRes, settingsRes, webhooksRes] = await Promise.all([
                api.get(`/organizations/${orgId}`),
                api.get(`/organizations/${orgId}/settings`),
                api.get(`/organizations/${orgId}/webhooks`)
            ]);
            
            setOrgData({
                name: orgRes.data.name || '',
                domain: orgRes.data.domain || ''
            });

            const st = settingsRes.data || {};
            setSettings(st);
            const arr = Object.keys(st).map(k => ({ key: k, value: String(st[k]) }));
            setKvList(arr);
            setWebhooks(webhooksRes.data || []);
            
        } catch (error) {
            console.error("Failed to fetch organization data:", error);
            toast.error("Failed to load organization settings.");
        } finally {
            setLoading(false);
        }
    };

    // ---------- Webhook Handlers ----------
    const addWebhook = async () => {
        if (!newWebhook.url.trim()) { toast.error("Please enter a webhook URL."); return; }
        setAddingWebhook(true);
        try {
            const res = await api.post(`/organizations/${orgId}/webhooks`, newWebhook);
            setWebhooks(prev => [...prev, res.data]);
            setNewWebhook({ url: '', secret: '', eventTypes: '*' });
            toast.success("Webhook registered successfully!");
        } catch (e) {
            toast.error("Failed to register webhook.");
        } finally {
            setAddingWebhook(false);
        }
    };

    const deleteWebhook = async (webhookId) => {
        try {
            await api.delete(`/organizations/${orgId}/webhooks/${webhookId}`);
            setWebhooks(prev => prev.filter(w => w.id !== webhookId));
            toast.success("Webhook removed.");
        } catch (e) {
            toast.error("Failed to delete webhook.");
        }
    };

    const toggleSecretVisibility = (id) => {
        setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOrgChange = (e) => {
        setOrgData({ ...orgData, [e.target.name]: e.target.value });
    };

    const handleKvChange = (index, field, value) => {
        const newKv = [...kvList];
        newKv[index][field] = value;
        setKvList(newKv);
    };

    const addKvPair = () => {
        setKvList([...kvList, { key: '', value: '' }]);
    };

    const removeKvPair = (index) => {
        const newKv = [...kvList];
        newKv.splice(index, 1);
        setKvList(newKv);
    };

    const saveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // First save base org info
            await api.put(`/organizations/${orgId}`, {
                name: orgData.name,
                domain: orgData.domain,
                // keep sectorId intact if possible, or backend ignores if unset
                sectorId: user?.sectorId
            });

            // Then save custom settings
            const settingsPayload = {};
            kvList.forEach(item => {
                if (item.key.trim()) {
                    settingsPayload[item.key.trim()] = item.value;
                }
            });

            await api.put(`/organizations/${orgId}/settings`, settingsPayload);
            toast.success("Organization settings updated successfully!");
            
            // Sync local state
            setSettings(settingsPayload);
            const arr = Object.keys(settingsPayload).map(k => ({ key: k, value: String(settingsPayload[k]) }));
            setKvList(arr);

        } catch (error) {
            console.error("Failed to update organization:", error);
            toast.error(error.response?.data?.message || "Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Building className="w-8 h-8 text-primary" />
                        Organization Settings
                    </h1>
                    <p className="text-base-content/60 mt-2">
                        Manage your company's profile and custom configurations.
                    </p>
                </div>

                {!orgId ? (
                    <div className="alert alert-warning">
                        <span>You are not assigned to any organization.</span>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <form onSubmit={saveSettings} className="space-y-6">
                        
                        {/* Base Profile Info */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <h2 className="card-title text-xl mb-4">Organization Profile</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Organization Name</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={orgData.name}
                                            onChange={handleOrgChange}
                                            required
                                            className="input input-bordered w-full" 
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Email Domain</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            name="domain"
                                            value={orgData.domain}
                                            onChange={handleOrgChange}
                                            placeholder="e.g. acmecorp.com"
                                            className="input input-bordered w-full" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Custom Configurations (JSONB) */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="card-title text-xl">Custom Configurations</h2>
                                        <p className="text-sm text-base-content/60">Dynamic key-value settings for integrations.</p>
                                    </div>
                                    <button type="button" onClick={addKvPair} className="btn btn-sm btn-outline btn-primary">
                                        <Plus className="w-4 h-4" /> Add Field
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    {kvList.length === 0 ? (
                                        <div className="text-center py-8 text-base-content/40 bg-base-200 rounded-lg border border-dashed border-base-300">
                                            No custom settings configured yet.
                                        </div>
                                    ) : (
                                        kvList.map((item, index) => (
                                            <div key={index} className="flex gap-2 items-start animate-fade-in">
                                                <div className="flex-1">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Configuration Key (e.g. api_key)"
                                                        value={item.key}
                                                        onChange={(e) => handleKvChange(index, 'key', e.target.value)}
                                                        className="input input-sm input-bordered w-full font-mono text-xs" 
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Value"
                                                        value={item.value}
                                                        onChange={(e) => handleKvChange(index, 'value', e.target.value)}
                                                        className="input input-sm input-bordered w-full text-sm" 
                                                    />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeKvPair(index)}
                                                    className="btn btn-sm btn-square btn-ghost text-error"
                                                    title="Remove Field"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Webhooks Panel */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="card-title text-xl flex items-center gap-2">
                                            <Webhook className="w-5 h-5 text-secondary" /> Webhook Subscriptions
                                        </h2>
                                        <p className="text-sm text-base-content/60">Receive HTTP POST on your endpoints when platform events occur.</p>
                                    </div>
                                </div>

                                {/* New Webhook Form */}
                                <div className="bg-base-200 rounded-lg p-4 mb-4 border border-base-300">
                                    <p className="text-sm font-semibold mb-3">Register New Webhook</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="url"
                                            placeholder="https://your-server.com/hook"
                                            value={newWebhook.url}
                                            onChange={e => setNewWebhook(p => ({ ...p, url: e.target.value }))}
                                            className="input input-sm input-bordered w-full col-span-2"
                                        />
                                        <select
                                            value={newWebhook.eventTypes}
                                            onChange={e => setNewWebhook(p => ({ ...p, eventTypes: e.target.value }))}
                                            className="select select-sm select-bordered w-full"
                                        >
                                            {AVAILABLE_EVENTS.map(ev => (
                                                <option key={ev} value={ev}>{ev}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            placeholder="Secret (optional, for HMAC signing)"
                                            value={newWebhook.secret}
                                            onChange={e => setNewWebhook(p => ({ ...p, secret: e.target.value }))}
                                            className="input input-sm input-bordered w-full md:col-span-2"
                                        />
                                        <button
                                            type="button"
                                            onClick={addWebhook}
                                            disabled={addingWebhook}
                                            className="btn btn-sm btn-secondary w-full"
                                        >
                                            {addingWebhook ? <span className="loading loading-spinner loading-xs"></span> : <><Plus className="w-4 h-4" /> Add</>}
                                        </button>
                                    </div>
                                </div>

                                {/* Existing Webhooks List */}
                                {webhooks.length === 0 ? (
                                    <div className="text-center py-6 text-base-content/40 bg-base-200 rounded-lg border border-dashed border-base-300">
                                        No webhooks registered yet.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {webhooks.map(wh => (
                                            <div key={wh.id} className="flex items-center justify-between gap-3 p-3 bg-base-200 rounded-lg border border-base-300">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-mono text-sm truncate">{wh.url}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="badge badge-sm badge-outline badge-secondary">{wh.eventTypes}</span>
                                                        {wh.active ? <span className="badge badge-sm badge-success">active</span> : <span className="badge badge-sm badge-ghost">inactive</span>}
                                                        {wh.secret && (
                                                            <span className="flex items-center gap-1 text-xs text-base-content/50">
                                                                {showSecret[wh.id] ? wh.secret : '••••••••'}
                                                                <button type="button" onClick={() => toggleSecretVisibility(wh.id)} className="hover:text-base-content">
                                                                    {showSecret[wh.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                </button>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteWebhook(wh.id)}
                                                    className="btn btn-sm btn-square btn-ghost text-error"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? <span className="loading loading-spinner loading-xs"></span> : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OrganizationSettingsPage;
