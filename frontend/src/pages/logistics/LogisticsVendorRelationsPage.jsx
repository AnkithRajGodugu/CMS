import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Building2, Star, AlertTriangle, Plus, Clock,
  CheckCircle2, X, Save, CalendarDays, Edit, Trash2
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls   = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all shadow-sm";
const labelCls   = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
const selectCls  = "w-full bg-transparent border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none appearance-none cursor-pointer";

const perfColor     = s => s >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : s >= 75 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200';
const perfBar       = s => s >= 90 ? 'from-emerald-400 to-emerald-600' : s >= 75 ? 'from-amber-400 to-amber-600' : 'from-red-400 to-red-600';
const contractColor = s => s === 'ACTIVE' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : s === 'EXPIRING_SOON' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200';
const contractLabel = s => ({ ACTIVE: 'Active', EXPIRING_SOON: 'Expiring Soon', EXPIRED: 'Expired', PENDING: 'Pending' }[s] || s);

const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">{children}</div>
  </div>
);

function VendorModal({ vendor, onClose, onUpdated, onDeleted }) {
  const [form, setForm]                   = useState({ ...vendor });
  const [saving, setSaving]               = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logistics/vendors/${vendor.id}`, form);
      onUpdated(vendor.id, form); toast.success('Vendor updated!'); onClose();
    } catch { onUpdated(vendor.id, form); toast.success('Vendor updated locally'); onClose(); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200"><Building2 className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Manage Vendor</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/20 rounded-2xl p-4 border border-amber-500/20">
          <p className="font-bold text-amber-200 text-xl">{vendor.name}</p>
          <p className="text-amber-600/70 text-sm">{vendor.category}</p>
          <div className="flex gap-2 mt-2">
            <span className={cx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border', contractColor(vendor.contractStatus))}>{contractLabel(vendor.contractStatus)}</span>
            <span className="text-[10px] text-gray-500">Score: {vendor.performanceScore}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Vendor Name</label><input type="text" className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={labelCls}>Category</label><input type="text" className={inputCls} value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Performance Score (%)</label>
            <input type="number" min="0" max="100" className={inputCls} value={form.performanceScore} onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})} />
            <div className="mt-2 bg-transparent h-1.5 rounded-full overflow-hidden">
              <div className={cx('h-full rounded-full bg-gradient-to-r', perfBar(form.performanceScore))} style={{ width: `${form.performanceScore}%` }} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Contract Status</label>
            <select className={selectCls} value={form.contractStatus} onChange={e => setForm({...form, contractStatus: e.target.value})}>
              {['ACTIVE','EXPIRING_SOON','EXPIRED','PENDING'].map(s => <option key={s} value={s}>{contractLabel(s)}</option>)}
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Contract Renewal Date</label><input type="date" className={inputCls} value={form.contractRenewalDate || ''} onChange={e => setForm({...form, contractRenewalDate: e.target.value})} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.contactEmail || ''} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
          <div><label className={labelCls}>Phone</label><input type="text" className={inputCls} value={form.contactPhone || ''} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
        </div>
        {confirmDelete && (
          <div className="flex items-start gap-3 p-3 rounded-xl border bg-red-50 border-red-200 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>Are you sure you want to remove this vendor?
              <div className="flex gap-2 mt-2">
                <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-500">No</button>
                <button onClick={() => { onDeleted(vendor.id); onClose(); }} className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-600 border border-red-500/20">Yes, Remove</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(true)} className="py-3 px-4 rounded-xl text-sm font-semibold text-red-600 flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> Remove</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function AddVendorModal({ onClose, onAdded }) {
  const [form, setForm]   = useState({ name: '', category: '', performanceScore: 80, contractStatus: 'ACTIVE', contractRenewalDate: '', contactEmail: '', contactPhone: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await api.post('/logistics/vendors', form);
      if (res.data?.success !== false) { toast.success('Vendor added!'); onAdded(); onClose(); }
    } catch { toast.error('Failed to add vendor'); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-200"><Plus className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Add Vendor</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Vendor Name</label><input type="text" required className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={labelCls}>Category</label><input type="text" required placeholder="Freight, Last-Mile..." className={inputCls} value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Performance Score (%)</label><input type="number" min="0" max="100" required className={inputCls} value={form.performanceScore} onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})} /></div>
          <div>
            <label className={labelCls}>Contract Status</label>
            <select className={selectCls} value={form.contractStatus} onChange={e => setForm({...form, contractStatus: e.target.value})}>
              {['ACTIVE','EXPIRING_SOON','PENDING'].map(s => <option key={s} value={s}>{contractLabel(s)}</option>)}
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Renewal Date</label><input type="date" className={inputCls} value={form.contractRenewalDate} onChange={e => setForm({...form, contractRenewalDate: e.target.value})} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
          <div><label className={labelCls}>Phone</label><input type="text" className={inputCls} value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />} Add Vendor
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

const LogisticsVendorRelationsPage = () => {
  const { user, sector } = useAuth();
  const [vendors, setVendors]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [manageVendor, setManageVendor] = useState(null);

  const fetchVendors = async () => {
    try { setLoading(true); const res = await api.get('/logistics/vendors'); const data = res.data?.data ?? res.data; setVendors(Array.isArray(data) ? data : []); }
    catch { toast.error('Failed to load vendors'); } finally { setLoading(false); }
  };

  useEffect(() => { if (sector?.code?.toLowerCase() === 'logistics') fetchVendors(); }, [sector]);
  const handleUpdated = (id, u) => setVendors(prev => prev.map(v => v.id === id ? { ...v, ...u } : v));
  const handleDeleted = (id) => setVendors(prev => prev.filter(v => v.id !== id));

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return <div className="min-h-screen flex items-center justify-center bg-transparent"><div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl border border-gray-200 max-w-md"><AlertTriangle className="w-16 h-16 text-amber-600" /><h2 className="text-2xl font-bold text-[#1F2937]">Logistics Access Only</h2></div></div>;
  }

  const activeCount   = vendors.filter(v => v.contractStatus === 'ACTIVE').length;
  const expiringCount = vendors.filter(v => v.contractStatus === 'EXPIRING_SOON').length;
  const avgPerf       = vendors.length > 0 ? Math.round(vendors.reduce((s, v) => s + (v.performanceScore || 0), 0) / vendors.length) : 0;

  return (
    <div className="min-h-screen bg-transparent text-[#1F2937] font-sans p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Logistics</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Vendor Relations</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-2">Vendor Relations</h1>
            <p className="text-gray-500 max-w-lg">Manage supplier contracts, track performance, and monitor renewal timelines.</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Contracts', value: activeCount,   Icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { label: 'Expiring Soon',    value: expiringCount, Icon: Clock,        color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Avg Performance',  value: `${avgPerf}%`, Icon: Star,         color: 'text-sky-700 bg-sky-50 border-sky-200' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#1F2937]">Approved Vendors</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" /></div>
          ) : vendors.length === 0 ? (
            <div className="py-16 text-center text-gray-400 italic">No vendors registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-100">{['Vendor','Category','Performance','Contract','Renewal','Contact','Actions'].map(h => <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>)}</tr></thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-2 font-bold text-[#1F2937]"><Building2 className="w-4 h-4 text-amber-600 shrink-0" />{v.name}</div></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border text-amber-700 bg-amber-50 border-amber-200">{v.category}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-transparent rounded-full overflow-hidden"><div className={cx('h-full rounded-full bg-gradient-to-r', perfBar(v.performanceScore))} style={{ width: `${v.performanceScore}%` }} /></div>
                          <span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', perfColor(v.performanceScore))}>{v.performanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={cx('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', contractColor(v.contractStatus))}>{contractLabel(v.contractStatus)}</span></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-xs text-gray-500"><CalendarDays className="w-3.5 h-3.5 text-gray-400" />{v.contractRenewalDate ?? '—'}</div></td>
                      <td className="px-6 py-4 text-xs text-gray-500">{v.contactEmail}</td>
                      <td className="px-6 py-4"><button onClick={() => setManageVendor(v)} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-[#1F2937] transition-colors"><Edit className="w-3.5 h-3.5" /> Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {manageVendor && <VendorModal vendor={manageVendor} onClose={() => setManageVendor(null)} onUpdated={handleUpdated} onDeleted={handleDeleted} />}
      {isAddOpen    && <AddVendorModal onClose={() => setIsAddOpen(false)} onAdded={fetchVendors} />}
    </div>
  );
};

export default LogisticsVendorRelationsPage;
