import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Truck, Plus, Wrench, User, AlertTriangle,
  CheckCircle2, X, Save
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls   = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all shadow-sm";
const labelCls   = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
const selectCls  = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-amber-400 transition-all appearance-none cursor-pointer shadow-sm";

const STATUS_OPTIONS = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'];
const STATUS_META = {
  AVAILABLE:   'text-emerald-700 bg-emerald-50 border-emerald-200',
  IN_USE:      'text-sky-700 bg-sky-50 border-sky-200',
  MAINTENANCE: 'text-amber-700 bg-amber-50 border-amber-200',
  RETIRED:     'text-red-700 bg-red-50 border-red-200',
};

const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-md shadow-2xl">{children}</div>
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
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200"><Wrench className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Vehicle Service</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 rounded-2xl p-4 border border-amber-500/20 flex items-center gap-3">
          <Truck className="w-8 h-8 text-amber-600 opacity-80 shrink-0" />
          <div>
            <p className="font-bold font-mono text-amber-200 text-lg">{vehicle.plateNumber}</p>
            <p className="text-amber-600/70 text-sm">{vehicle.model} · {vehicle.capacity}T capacity</p>
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
          <div className="flex items-center gap-3 p-3 rounded-xl border bg-amber-50 border-amber-200 text-amber-600 text-sm">
            <Wrench className="w-4 h-4 shrink-0" />Vehicle will be removed from active fleet scheduling.
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
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
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-200"><Truck className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Register Vehicle</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
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
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl border border-gray-200 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
          <h2 className="text-2xl font-bold text-[#1F2937]">Logistics Access Only</h2>
        </div>
      </div>
    );
  }

  const filtered    = filterStatus === 'ALL' ? vehicles : vehicles.filter(v => v.status === filterStatus);
  const available   = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const inUse       = vehicles.filter(v => v.status === 'IN_USE').length;
  const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;

  const kpis = [
    { label: 'Total Fleet',  value: vehicles.length, filter: 'ALL',         Icon: Truck,         color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Available',    value: available,        filter: 'AVAILABLE',   Icon: CheckCircle2,  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'In Service',   value: inUse,            filter: 'IN_USE',      Icon: Truck,         color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { label: 'Maintenance',  value: maintenance,      filter: 'MAINTENANCE', Icon: Wrench,        color: 'text-amber-700 bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#1F2937] font-sans p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Logistics</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Fleet Management</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-2">Fleet Management</h1>
            <p className="text-gray-500 max-w-lg">Monitor vehicle status, service schedules, and driver assignments.</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(({ label, value, filter, Icon, color }) => (
            <button key={label} onClick={() => setFilterStatus(filter)}
              className={cx('bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4 text-left transition-all hover:border-gray-300', filterStatus === filter && 'ring-2 ring-amber-400/40 border-amber-200')}>
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#1F2937]">Fleet Registry</h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Plate / ID', 'Model', 'Status', 'Capacity', 'Driver', 'Last Service', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-16"><div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" /></div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-16 text-gray-400 italic">No vehicles match the selected filter.</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono font-bold text-[#1F2937]">{v.plateNumber}</p>
                      <p className="text-[10px] text-gray-400">VH-{v.id}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-500">{v.model}</td>
                    <td className="px-6 py-4">
                      <span className={cx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border', STATUS_META[v.status] || 'text-gray-500 bg-gray-100 border-gray-200')}>{v.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{v.capacity} T</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className={v.currentDriver ? '' : 'text-gray-400 italic'}>{v.currentDriver || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'Pending'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => setServiceVehicle(v)} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-[#1F2937] transition-colors">
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
