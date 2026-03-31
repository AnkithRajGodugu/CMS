import { useState, useEffect } from 'react';
import { getOrganizations, getWebhooks, createWebhook, deleteWebhook } from '../../services/webhookService';
import { toast } from 'sonner';
import { FaPlug, FaTrash, FaPlus, FaCircle } from 'react-icons/fa';

const WebhooksPage = () => {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ url: '', secret: '', eventTypes: '*' });

    useEffect(() => {
        fetchOrganizations();
    }, []);

    useEffect(() => {
        if (selectedOrg) fetchWebhooks(selectedOrg);
    }, [selectedOrg]);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const data = await getOrganizations();
            // Data could be a Page object { content: [...] } or an array depending on backend serialization
            const orgs = Array.isArray(data) ? data : (data.content || []);
            setOrganizations(orgs);
            if (orgs.length > 0) setSelectedOrg(orgs[0].id);
        } catch (error) {
            toast.error('Failed to load organizations.');
        } finally {
            setLoading(false);
        }
    };

    const fetchWebhooks = async (orgId) => {
        try {
            const data = await getWebhooks(orgId);
            setWebhooks(data);
        } catch (error) {
            toast.error('Failed to load webhooks.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOrg) return;

        try {
            await createWebhook(selectedOrg, { ...formData, isActive: true });
            toast.success('Webhook created successfully!');
            setIsFormOpen(false);
            setFormData({ url: '', secret: '', eventTypes: '*' });
            fetchWebhooks(selectedOrg);
        } catch (error) {
            // Error handled by intercepter, but we catch to keep form open if needed
        }
    };

    const handleDelete = async (webhookId) => {
        if (!window.confirm("Delete this webhook?")) return;
        try {
            await deleteWebhook(selectedOrg, webhookId);
            toast.success('Webhook removed.');
            setWebhooks(prev => prev.filter(w => w.id !== webhookId));
        } catch (error) {
            toast.error('Failed to delete webhook.');
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaPlug className="text-primary" /> Webhook Integrations
                    </h1>
                    <p className="text-base-content/70 mt-1">Manage external integrations and event subscriptions.</p>
                </div>
                {selectedOrg && (
                    <button onClick={() => setIsFormOpen(true)} className="btn btn-primary gap-2">
                        <FaPlus /> Add Webhook
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>
            ) : organizations.length === 0 ? (
                <div className="alert alert-warning shadow-sm">
                    ⚠️ No organizations found. Webhooks must be attached to an organization.
                </div>
            ) : (
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar / Org Selector */}
                    <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                        <h3 className="font-bold uppercase text-xs tracking-wider opacity-60 ml-2 mb-3">Select Organization</h3>
                        <div className="menu bg-base-100 rounded-box w-full shadow border border-base-200">
                            {organizations.map(org => (
                                <li key={org.id}>
                                    <a 
                                        className={selectedOrg === org.id ? 'active' : ''}
                                        onClick={() => setSelectedOrg(org.id)}
                                    >
                                        <FaCircle className={`text-[8px] ${org.active ? 'text-success' : 'text-error'}`} />
                                        {org.name}
                                    </a>
                                </li>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                        {isFormOpen && (
                            <div className="card bg-base-100 shadow-xl border border-primary/20 animate-fade-in-up">
                                <div className="card-body">
                                    <h3 className="card-title text-lg border-b pb-2">New Webhook Subscription</h3>
                                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                                        <div className="form-control">
                                            <label className="label"><span className="label-text font-medium">Payload URL</span></label>
                                            <input 
                                                type="url" 
                                                className="input input-bordered" 
                                                placeholder="https://your-domain.com/webhook"
                                                value={formData.url} 
                                                onChange={e => setFormData({...formData, url: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-medium">Secret (Optional)</span></label>
                                                <input 
                                                    type="text" 
                                                    className="input input-bordered" 
                                                    placeholder="Webhook signing secret"
                                                    value={formData.secret} 
                                                    onChange={e => setFormData({...formData, secret: e.target.value})} 
                                                />
                                            </div>
                                            <div className="form-control">
                                                <label className="label"><span className="label-text font-medium">Events</span></label>
                                                <input 
                                                    type="text" 
                                                    className="input input-bordered" 
                                                    placeholder="* or EVENT_NAME_1,EVENT_NAME_2"
                                                    value={formData.eventTypes} 
                                                    onChange={e => setFormData({...formData, eventTypes: e.target.value})}
                                                    required 
                                                />
                                            </div>
                                        </div>
                                        <div className="card-actions justify-end mt-4">
                                            <button type="button" className="btn btn-ghost" onClick={() => setIsFormOpen(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Save Webhook</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {!isFormOpen && webhooks.length === 0 ? (
                            <div className="text-center py-16 bg-base-100 rounded-2xl border border-dashed border-base-300">
                                <FaPlug className="text-4xl text-base-content/20 mx-auto mb-3" />
                                <h3 className="text-lg font-bold">No active webhooks</h3>
                                <p className="text-base-content/60 max-w-sm mx-auto mt-2">
                                    Configure webhooks to send real-time HTTP POST payloads to external services when events occur.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {webhooks.map(wh => (
                                    <div key={wh.id} className="card bg-base-100 shadow-sm border border-base-200">
                                        <div className="card-body p-5 flex flex-row items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`badge badge-sm ${wh.active ? 'badge-success' : 'badge-ghost'}`}>
                                                        {wh.active ? 'Active' : 'Disabled'}
                                                    </span>
                                                    <code className="text-xs font-bold px-2 py-0.5 bg-base-200 rounded text-primary truncate max-w-[200px] md:max-w-none">
                                                        {wh.url}
                                                    </code>
                                                </div>
                                                <div className="text-sm text-base-content/60 mt-2 truncate">
                                                    Subscribed to: <span className="font-mono bg-base-200 px-1 rounded">{wh.eventTypes}</span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <button 
                                                    onClick={() => handleDelete(wh.id)}
                                                    className="btn btn-sm btn-ghost text-error hover:bg-error/20"
                                                    title="Delete Webhook"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebhooksPage;
