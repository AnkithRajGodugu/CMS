import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Building2, Star, AlertTriangle, Plus, Clock,
  CheckCircle2, X, Save, CalendarDays, Edit, Trash2
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls   = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none focus:border-[#99a8ff]/50 transition-all";
const labelCls   = "block text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2";
const selectCls  = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] focus:outline-none appearance-none cursor-pointer";

const perfColor     = s => s >= 90 ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : s >= 75 ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' : 'text-red-300 bg-red-500/10 border-red-500/20';
const perfBar       = s => s >= 90 ? 'from-emerald-400 to-emerald-600' : s >= 75 ? 'from-amber-400 to-amber-600' : 'from-red-400 to-red-600';
const contractColor = s => s === 'ACTIVE' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : s === 'EXPIRING_SOON' ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' : 'text-red-300 bg-red-500/10 border-red-500/20';
const contractLabel = s => ({ ACTIVE: 'Active', EXPIRING_SOON: 'Expiring Soon', EXPIRED: 'Expired', PENDING: 'Pending' }[s] || s);

const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-[#111318] rounded-3xl border border-[#46484d]/20 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">{children}</div>
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
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20"><Building2 className="w-5 h-5 text-amber-400" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">Manage Vendor</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/20 rounded-2xl p-4 border border-amber-500/20">
          <p className="font-bold text-amber-200 text-xl">{vendor.name}</p>
          <p className="text-amber-400/70 text-sm">{vendor.category}</p>
          <div className="flex gap-2 mt-2">
            <span className={cx('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border', contractColor(vendor.contractStatus))}>{contractLabel(vendor.contractStatus)}</span>
            <span className="text-[10px] text-[#aaabb0]">Score: {vendor.performanceScore}%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Vendor Name</label><input type="text" className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={labelCls}>Category</label><input type="text" className={inputCls} value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Performance Score (%)</label>
            <input type="number" min="0" max="100" className={inputCls} value={form.performanceScore} onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})} />
            <div className="mt-2 bg-[#0c0e12] h-1.5 rounded-full overflow-hidden">
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
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.contactEmail || ''} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
          <div><label className={labelCls}>Phone</label><input type="text" className={inputCls} value={form.contactPhone || ''} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
        </div>
        {confirmDelete && (
          <div className="flex items-start gap-3 p-3 rounded-xl border bg-red-500/5 border-red-500/20 text-red-300 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>Are you sure you want to remove this vendor?
              <div className="flex gap-2 mt-2">
                <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1 rounded-lg bg-[#23262c] text-[#aaabb0]">No</button>
                <button onClick={() => { onDeleted(vendor.id); onClose(); }} className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/20">Yes, Remove</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => setConfirmDelete(true)} className="py-3 px-4 rounded-xl text-sm font-semibold text-red-400 flex items-center gap-1.5"><Trash2 className="w-4 h-4" /> Remove</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c]">Cancel</button>
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
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20"><Plus className="w-5 h-5 text-[#99a8ff]" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">Add Vendor</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Vendor Name</label><input type="text" required className={inputCls} value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label className={labelCls}>Category</label><input type="text" required placeholder="Freight, Last-Mile..." className={inputCls} value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Performance Score (%)</label><input type="number" min="0" max="100" required className={inputCls} value={form.performanceScore} onChange={e => setForm({...form, performanceScore: parseInt(e.target.value)})} /></div>
          <div>
            <label className={labelCls}>Contract Status</label>
            <select className={selectCls} value={form.contractStatus} onChange={e => setForm({...form, contractStatus: e.target.value})}>
              {['ACTIVE','EXPIRING_SOON','PENDING'].map(s => <option key={s} value={s}>{contractLabel(s)}</option>)}
            </select>
          </div>
        </div>
        <div><label className={labelCls}>Renewal Date</label><input type="date" className={inputCls} value={form.contractRenewalDate} onChange={e => setForm({...form, contractRenewalDate: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Email</label><input type="email" className={inputCls} value={form.contactEmail} onChange={e => setForm({...form, contactEmail: e.target.value})} /></div>
          <div><label className={labelCls}>Phone</label><input type="text" className={inputCls} value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} /></div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c]">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] flex items-center justify-center gap-2">
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
    return <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]"><div className="flex flex-col items-center gap-6 p-10 bg-[#111318] rounded-3xl border border-[#46484d]/20 max-w-md"><AlertTriangle className="w-16 h-16 text-amber-400" /><h2 className="text-2xl font-bold text-[#f6f6fc]">Logistics Access Only</h2></div></div>;
  }

  const activeCount   = vendors.filter(v => v.contractStatus === 'ACTIVE').length;
  const expiringCount = vendors.filter(v => v.contractStatus === 'EXPIRING_SOON').length;
  const avgPerf       = vendors.length > 0 ? Math.round(vendors.reduce((s, v) => s + (v.performanceScore || 0), 0) / vendors.length) : 0;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans p-8">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Logistics</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Vendor Relations</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-2">Vendor Relations</h1>
            <p className="text-[#aaabb0] max-w-lg">Manage supplier contracts, track performance, and monitor renewal timelines.</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Contracts', value: activeCount,   Icon: CheckCircle2, color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
            { label: 'Expiring Soon',    value: expiringCount, Icon: Clock,        color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
            { label: 'Avg Performance',  value: `${avgPerf}%`, Icon: Star,         color: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-5 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#f6f6fc]">{loading ? '—' : value}</p>
                <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#46484d]/10 flex items-center justify-between">
            <h2 className="font-bold text-[#f6f6fc]">Approved Vendors</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#23262c] text-[#aaabb0]">{vendors.length} vendor{vendors.length !== 1 ? 's' : ''}</span>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" /></div>
          ) : vendors.length === 0 ? (
            <div className="py-16 text-center text-[#46484d] italic">No vendors registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#46484d]/10">{['Vendor','Category','Performance','Contract','Renewal','Contact','Actions'].map(h => <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">{h}</th>)}</tr></thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id} className="border-b border-[#46484d]/5 hover:bg-[#171a1f] transition-colors">
                      <td className="px-6 py-4"><div className="flex items-center gap-2 font-bold text-[#f6f6fc]"><Building2 className="w-4 h-4 text-amber-400 shrink-0" />{v.name}</div></td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border text-[#99a8ff] bg-[#99a8ff]/10 border-[#99a8ff]/20">{v.category}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#0c0e12] rounded-full overflow-hidden"><div className={cx('h-full rounded-full bg-gradient-to-r', perfBar(v.performanceScore))} style={{ width: `${v.performanceScore}%` }} /></div>
                          <span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', perfColor(v.performanceScore))}>{v.performanceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={cx('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', contractColor(v.contractStatus))}>{contractLabel(v.contractStatus)}</span></td>
                      <td className="px-6 py-4"><div className="flex items-center gap-1.5 text-xs text-[#aaabb0]"><CalendarDays className="w-3.5 h-3.5 text-[#46484d]" />{v.contractRenewalDate ?? '—'}</div></td>
                      <td className="px-6 py-4 text-xs text-[#aaabb0]">{v.contactEmail}</td>
                      <td className="px-6 py-4"><button onClick={() => setManageVendor(v)} className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-[#f6f6fc] transition-colors"><Edit className="w-3.5 h-3.5" /> Manage</button></td>
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
