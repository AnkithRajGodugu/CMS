import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Truck, Plus, Wrench, User, AlertTriangle,
  CheckCircle2, X, Save
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls   = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none focus:border-[#99a8ff]/50 transition-all";
const labelCls   = "block text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2";
const selectCls  = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] focus:outline-none focus:border-[#99a8ff]/50 transition-all appearance-none cursor-pointer";

const STATUS_OPTIONS = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'];
const STATUS_META = {
  AVAILABLE:   'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  IN_USE:      'text-sky-300 bg-sky-500/10 border-sky-500/20',
  MAINTENANCE: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  RETIRED:     'text-red-300 bg-red-500/10 border-red-500/20',
};

const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-[#111318] rounded-3xl border border-[#46484d]/20 w-full max-w-md shadow-2xl">{children}</div>
  </div>
);

/* ─── Vehicle Service Modal ──────────────────────────────────────────────────── */
function VehicleServiceModal({ vehicle, onClose, onUpdated }) {
  const [status, setStatus] = useState(vehicle.status);
  const [driver, setDriver] = useState(vehicle.currentDriver || '');
  const [notes, setNotes]   = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logistics/vehicles/${vehicle.id}`, { ...vehicle, status, currentDriver: driver });
      toast.success('Vehicle record updated!');
      onUpdated(vehicle.id, { status, currentDriver: driver });
      onClose();
    } catch {
      onUpdated(vehicle.id, { status, currentDriver: driver });
      toast.success('Vehicle updated locally');
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20"><Wrench className="w-5 h-5 text-amber-400" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">Vehicle Service</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 rounded-2xl p-4 border border-amber-500/20 flex items-center gap-3">
          <Truck className="w-8 h-8 text-amber-300 opacity-80 shrink-0" />
          <div>
            <p className="font-bold font-mono text-amber-200 text-lg">{vehicle.plateNumber}</p>
            <p className="text-amber-400/70 text-sm">{vehicle.model} · {vehicle.capacity}T capacity</p>
          </div>
        </div>
        <div>
          <label className={labelCls}>Vehicle Status</label>
          <select className={selectCls} value={status} onChange={e => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Assigned Driver</label>
          <input type="text" placeholder="Driver name" className={inputCls} value={driver} onChange={e => setDriver(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Service Notes</label>
          <textarea rows={3} placeholder="e.g. Oil change, brake inspection, tyre rotation..." className={cx(inputCls, 'resize-none')} value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
        {status === 'MAINTENANCE' && (
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-amber-500/5 border-amber-500/20 text-amber-300 text-sm">
            <Wrench className="w-4 h-4 shrink-0" />Vehicle will be removed from active fleet scheduling.
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ─── Add Vehicle Modal ──────────────────────────────────────────────────────── */
function AddVehicleModal({ onClose, onAdded }) {
  const [form, setForm]     = useState({ plateNumber: '', model: '', status: 'AVAILABLE', capacity: 0, currentDriver: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/vehicles', form);
      if (res.data?.success !== false) { toast.success('Vehicle added to fleet!'); onAdded(); onClose(); }
    } catch { toast.error('Failed to register vehicle'); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20"><Truck className="w-5 h-5 text-[#99a8ff]" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">Register Vehicle</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Plate Number</label>
            <input type="text" required placeholder="MH-01-AB-1234" className={cx(inputCls, 'font-mono')} value={form.plateNumber} onChange={e => setForm({...form, plateNumber: e.target.value})} />
          </div>
          <div>
            <label className={labelCls}>Model</label>
            <input type="text" required placeholder="Tata ACE" className={inputCls} value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Capacity (Tons)</label>
            <input type="number" step="0.1" min="0" required className={inputCls} value={form.capacity} onChange={e => setForm({...form, capacity: parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className={labelCls}>Initial Status</label>
            <select className={selectCls} value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Driver Name</label>
          <input type="text" placeholder="Optional" className={inputCls} value={form.currentDriver} onChange={e => setForm({...form, currentDriver: e.target.value})} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />}
            Register
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsFleetManagementPage = () => {
  const { user, sector } = useAuth();
  const [vehicles, setVehicles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isAddOpen, setIsAddOpen]     = useState(false);
  const [serviceVehicle, setServiceVehicle] = useState(null);
  const [filterStatus, setFilterStatus]     = useState('ALL');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res  = await api.get('/logistics/vehicles');
      const data = res.data?.data ?? res.data;
      setVehicles(data?.content ?? (Array.isArray(data) ? data : []));
    } catch { toast.error('Failed to load fleet data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user && sector?.code?.toLowerCase() === 'logistics') fetchVehicles(); }, [user, sector]);
  const handleVehicleUpdated = (id, updates) => setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]">
        <div className="flex flex-col items-center gap-6 p-10 bg-[#111318] rounded-3xl border border-[#46484d]/20 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400" />
          <h2 className="text-2xl font-bold text-[#f6f6fc]">Logistics Access Only</h2>
        </div>
      </div>
    );
  }

  const filtered    = filterStatus === 'ALL' ? vehicles : vehicles.filter(v => v.status === filterStatus);
  const available   = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const inUse       = vehicles.filter(v => v.status === 'IN_USE').length;
  const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;

  const kpis = [
    { label: 'Total Fleet',  value: vehicles.length, filter: 'ALL',         Icon: Truck,         color: 'text-[#99a8ff] bg-[#99a8ff]/10 border-[#99a8ff]/20' },
    { label: 'Available',    value: available,        filter: 'AVAILABLE',   Icon: CheckCircle2,  color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'In Service',   value: inUse,            filter: 'IN_USE',      Icon: Truck,         color: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
    { label: 'Maintenance',  value: maintenance,      filter: 'MAINTENANCE', Icon: Wrench,        color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans p-8">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Logistics</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Fleet Management</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-2">Fleet Management</h1>
            <p className="text-[#aaabb0] max-w-lg">Monitor vehicle status, service schedules, and driver assignments.</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, filter, Icon, color }) => (
            <button key={label} onClick={() => setFilterStatus(filter)}
              className={cx('bg-[#111318] rounded-2xl border border-[#46484d]/10 p-5 flex items-center gap-4 text-left transition-all hover:border-[#46484d]/30', filterStatus === filter && 'ring-2 ring-[#99a8ff]/40 border-[#99a8ff]/20')}>
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#f6f6fc]">{loading ? '—' : value}</p>
                <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#46484d]/10 flex items-center justify-between">
            <h2 className="font-bold text-[#f6f6fc]">Fleet Registry</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#23262c] text-[#aaabb0] font-medium">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#46484d]/10">
                  {['Plate / ID', 'Model', 'Status', 'Capacity', 'Driver', 'Last Service', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-16"><div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" /></div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-16 text-[#46484d] italic">No vehicles match the selected filter.</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="border-b border-[#46484d]/5 hover:bg-[#171a1f] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-[#f6f6fc]">{v.plateNumber}</p>
                      <p className="text-[10px] text-[#46484d]">VH-{v.id}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#aaabb0]">{v.model}</td>
                    <td className="px-6 py-4">
                      <span className={cx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border', STATUS_META[v.status] || 'text-[#aaabb0] bg-[#23262c] border-[#46484d]/20')}>{v.status}</span>
                    </td>
                    <td className="px-6 py-4 text-[#aaabb0]">{v.capacity} T</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[#aaabb0]">
                        <User className="w-3.5 h-3.5 text-[#46484d]" />
                        <span className={v.currentDriver ? '' : 'text-[#46484d] italic'}>{v.currentDriver || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#aaabb0]">{v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'Pending'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setServiceVehicle(v)} className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-[#f6f6fc] transition-colors">
                        <Wrench className="w-3.5 h-3.5" /> Service
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {serviceVehicle && <VehicleServiceModal vehicle={serviceVehicle} onClose={() => setServiceVehicle(null)} onUpdated={handleVehicleUpdated} />}
      {isAddOpen      && <AddVehicleModal onClose={() => setIsAddOpen(false)} onAdded={fetchVehicles} />}
    </div>
  );
};

export default LogisticsFleetManagementPage;
