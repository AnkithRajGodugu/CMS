import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaBuilding, FaStar, FaExclamationTriangle, FaPlus, FaClock,
  FaCheckCircle, FaTimes, FaSave, FaPhone, FaEnvelope, FaCalendarAlt,
  FaEdit, FaTrash
} from 'react-icons/fa';
import { toast } from 'sonner';

const perfBadge = s => s >= 90 ? 'badge-success' : s >= 75 ? 'badge-warning' : 'badge-error';
const contractBadge = s => s === 'ACTIVE' ? 'badge-success' : s === 'EXPIRING_SOON' ? 'badge-warning' : 'badge-error';
const contractLabel = s => ({ ACTIVE: 'Active', EXPIRING_SOON: 'Expiring Soon', EXPIRED: 'Expired', PENDING: 'Pending' }[s] || s);

/* ─── Vendor Management Modal ────────────────────────────────────────────── */
function VendorModal({ vendor, onClose, onUpdated, onDeleted }) {
  const [form, setForm] = useState({ ...vendor });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logistics/vendors/${vendor.id}`, form);
      toast.success('Vendor updated!');
      onUpdated(vendor.id, form);
      onClose();
    } catch {
      onUpdated(vendor.id, form);
      toast.success('Vendor updated locally');
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaBuilding className="text-amber-500"/> Manage Vendor
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        {/* Vendor header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white mb-6">
          <div className="font-bold text-xl">{vendor.name}</div>
          <div className="text-amber-100 text-sm">{vendor.category}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${contractBadge(vendor.contractStatus)} badge-sm font-bold`}>
              {contractLabel(vendor.contractStatus)}
            </span>
            <span className="badge badge-ghost bg-white/20 text-white badge-sm">Score: {vendor.performanceScore}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Vendor Name</span></label>
              <input type="text" className="input input-bordered" required value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Category</span></label>
              <input type="text" className="input input-bordered" value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Performance Score (%)</span></label>
              <input type="number" min="0" max="100" className="input input-bordered" value={form.performanceScore}
                onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})}/>
              <div className="mt-2 bg-base-200 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${form.performanceScore >= 90 ? 'bg-success' : form.performanceScore >= 75 ? 'bg-warning' : 'bg-error'}`}
                  style={{ width: `${form.performanceScore}%` }}/>
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Contract Status</span></label>
              <select className="select select-bordered" value={form.contractStatus}
                onChange={e => setForm({...form, contractStatus: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="EXPIRED">Expired</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Contract Renewal Date</span></label>
            <input type="date" className="input input-bordered" value={form.contractRenewalDate || ''}
              onChange={e => setForm({...form, contractRenewalDate: e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold"><FaEnvelope className="inline mr-1"/>Contact Email</span></label>
              <input type="email" className="input input-bordered" value={form.contactEmail || ''}
                onChange={e => setForm({...form, contactEmail: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold"><FaPhone className="inline mr-1"/>Contact Phone</span></label>
              <input type="text" className="input input-bordered" value={form.contactPhone || ''}
                onChange={e => setForm({...form, contactPhone: e.target.value})}/>
            </div>
          </div>
        </div>

        {confirmDelete && (
          <div className="alert alert-error mt-4">
            <FaExclamationTriangle/>
            <span className="text-sm">Are you sure you want to remove this vendor?</span>
            <div className="flex gap-2">
              <button className="btn btn-xs btn-ghost" onClick={() => setConfirmDelete(false)}>No</button>
              <button className="btn btn-xs btn-error text-white" onClick={() => { onDeleted(vendor.id); onClose(); }}>Yes, Remove</button>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost btn-sm text-error" onClick={() => setConfirmDelete(true)}>
            <FaTrash className="text-xs"/> Remove
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-warning text-white gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-xs"/> : <FaSave/>}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Vendor Modal ────────────────────────────────────────────────────── */
function AddVendorModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', category: '', performanceScore: 80, contractStatus: 'ACTIVE', contractRenewalDate: '', contactEmail: '', contactPhone: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/vendors', form);
      const ok = res.data?.success !== false;
      if (ok) {
        toast.success('Vendor added successfully');
        onAdded();
        onClose();
      }
    } catch { toast.error('Failed to add vendor'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaPlus className="text-amber-500"/> Add Vendor
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Vendor Name</span></label>
              <input type="text" className="input input-bordered" required value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Category</span></label>
              <input type="text" className="input input-bordered" required placeholder="Freight, Last-Mile..."
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Performance Score (%)</span></label>
              <input type="number" min="0" max="100" className="input input-bordered" required value={form.performanceScore}
                onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Contract Status</span></label>
              <select className="select select-bordered" value={form.contractStatus}
                onChange={e => setForm({...form, contractStatus: e.target.value})}>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Renewal Date</span></label>
            <input type="date" className="input input-bordered" value={form.contractRenewalDate}
              onChange={e => setForm({...form, contractRenewalDate: e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Email</span></label>
              <input type="email" className="input input-bordered" value={form.contactEmail}
                onChange={e => setForm({...form, contactEmail: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Phone</span></label>
              <input type="text" className="input input-bordered" value={form.contactPhone}
                onChange={e => setForm({...form, contactPhone: e.target.value})}/>
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-warning text-white" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs"/> : null}
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsVendorRelationsPage = () => {
  const { user, sector } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [manageVendor, setManageVendor] = useState(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/vendors');
      const data = res.data?.data ?? res.data;
      setVendors(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load vendors'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'logistics') fetchVendors();
  }, [sector]);

  const handleUpdated = (id, updates) => setVendors(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  const handleDeleted = (id) => setVendors(prev => prev.filter(v => v.id !== id));

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-warning mx-auto mb-4"/>
          <h2 className="text-2xl font-bold">Logistics Access Only</h2>
        </div>
      </div>
    );
  }

  const activeCount = vendors.filter(v => v.contractStatus === 'ACTIVE').length;
  const expiringCount = vendors.filter(v => v.contractStatus === 'EXPIRING_SOON').length;
  const avgPerf = vendors.length > 0 ? Math.round(vendors.reduce((s, v) => s + (v.performanceScore || 0), 0) / vendors.length) : 0;

  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaBuilding className="text-amber-500"/> Vendor Relations
          </h1>
          <p className="text-base-content/60 mt-1">Manage supplier contracts, track performance, and monitor renewal timelines. Click Manage to edit any vendor.</p>
        </div>
        <button className="btn btn-warning text-white gap-2 shadow-lg" onClick={() => setIsAddOpen(true)}>
          <FaPlus/> Add Vendor
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Contracts', value: activeCount, icon: <FaCheckCircle className="text-3xl text-emerald-500"/>, color: 'text-emerald-500', border: 'border-emerald-500' },
          { label: 'Expiring Soon', value: expiringCount, icon: <FaClock className="text-3xl text-amber-500"/>, color: 'text-amber-500', border: 'border-amber-500' },
          { label: 'Avg Performance', value: `${avgPerf}%`, icon: <FaStar className="text-3xl text-blue-500"/>, color: 'text-blue-500', border: 'border-blue-500' },
        ].map(k => (
          <div key={k.label} className={`card bg-base-100 shadow border-l-4 ${k.border}`}>
            <div className="card-body py-4 flex-row items-center justify-between">
              <div>
                <p className="text-xs uppercase opacity-50 font-bold">{k.label}</p>
                <p className={`text-3xl font-extrabold ${k.color}`}>{loading ? '—' : k.value}</p>
              </div>
              {k.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Vendor Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between">
          <h2 className="font-bold text-lg">Approved Vendors</h2>
          <span className="badge badge-ghost">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-warning"/></div>
        ) : vendors.length === 0 ? (
          <div className="py-16 text-center opacity-40 italic">No vendors registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Performance</th>
                  <th>Contract</th>
                  <th>Renewal</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id} className="hover">
                    <td className="font-bold flex items-center gap-2">
                      <FaBuilding className="text-amber-500 flex-shrink-0"/>{v.name}
                    </td>
                    <td><span className="badge badge-ghost badge-sm">{v.category}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="bg-base-200 h-2 w-20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${v.performanceScore >= 90 ? 'bg-success' : v.performanceScore >= 75 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${v.performanceScore}%` }}/>
                        </div>
                        <span className={`badge ${perfBadge(v.performanceScore)} badge-sm`}>{v.performanceScore}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${contractBadge(v.contractStatus)} badge-sm font-bold`}>{contractLabel(v.contractStatus)}</span></td>
                    <td className="font-mono text-sm text-base-content/60">
                      <div className="flex items-center gap-1">
                        <FaCalendarAlt className="text-xs opacity-40"/>
                        {v.contractRenewalDate ?? '—'}
                      </div>
                    </td>
                    <td className="text-xs opacity-60">{v.contactEmail}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm gap-1 text-amber-600"
                        onClick={() => setManageVendor(v)}>
                        <FaEdit className="text-xs"/> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {manageVendor && (
        <VendorModal
          vendor={manageVendor}
          onClose={() => setManageVendor(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
      {isAddOpen && (
        <AddVendorModal
          onClose={() => setIsAddOpen(false)}
          onAdded={fetchVendors}
        />
      )}
    </div>
  );
};

export default LogisticsVendorRelationsPage;
