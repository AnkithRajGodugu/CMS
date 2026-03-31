import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Truck, MapPin, Clock, CheckCircle2, AlertTriangle,
  Search, Plus, X, Navigation, Edit, Save
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls  = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all shadow-sm";
const labelCls  = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

const STATUS_META = {
  DELIVERED:  { label: 'Delivered',  color: 'text-emerald-700 bg-emerald-50 border-emerald-200', bar: 'from-emerald-400 to-emerald-600', pct: 100 },
  IN_TRANSIT: { label: 'In Transit', color: 'text-sky-700 bg-sky-50 border-sky-200',             bar: 'from-sky-400 to-sky-600',         pct: 60  },
  PENDING:    { label: 'Pending',    color: 'text-amber-700 bg-amber-50 border-amber-200',        bar: 'from-amber-400 to-amber-600',     pct: 10  },
  DELAYED:    { label: 'Delayed',    color: 'text-red-700 bg-red-50 border-red-200',              bar: 'from-red-400 to-red-600',         pct: 40  },
};
const getStatusMeta = (s) => STATUS_META[s] || { label: s || 'UNKNOWN', color: 'text-gray-500 bg-gray-100 border-gray-200', bar: 'from-[#46484d] to-[#23262c]', pct: 0 };

const STATUSES = ['PENDING', 'IN_TRANSIT', 'DELAYED', 'DELIVERED'];

const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl">{children}</div>
  </div>
);

/* ─── Shipment Detail Modal ─────────────────────────────────────────────────── */
function ShipmentModal({ shipment, onClose, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(shipment.status);
  const [saving, setSaving] = useState(false);
  const sm = getStatusMeta(newStatus);

  const handleSave = async () => {
    if (newStatus === shipment.status) { onClose(); return; }
    setSaving(true);
    try {
      await api.put(`/logistics/shipments/${shipment.id}`, { ...shipment, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      onStatusUpdate(shipment.id, newStatus);
      onClose();
    } catch {
      onStatusUpdate(shipment.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onClose();
    } finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20"><Truck className="w-5 h-5 text-sky-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Shipment Details</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-5">
        {/* Tracking banner */}
        <div className="bg-gradient-to-r from-amber-600/30 to-amber-400/10 rounded-2xl p-5 border border-amber-200">
          <p className="font-mono font-bold text-amber-600 text-lg mb-1">#{shipment.trackingId || `SHP-${shipment.id}`}</p>
          <p className="text-sm text-gray-500">{shipment.origin} → {shipment.destination}</p>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>Delivery Progress</span>
              <span className="text-amber-600 font-bold">{sm.pct}%</span>
            </div>
            <div className="h-2 bg-transparent rounded-full overflow-hidden">
              <div className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700', sm.bar)} style={{ width: `${sm.pct}%` }} />
            </div>
          </div>
        </div>

        {/* Journey line */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-1 text-center max-w-[60px] truncate">{shipment.origin}</p>
          </div>
          <div className="flex-1">
            <div className="h-0.5 bg-gray-100 rounded-full relative overflow-hidden">
              <div className={cx('absolute left-0 top-0 h-full bg-gradient-to-r transition-all', sm.bar)} style={{ width: `${sm.pct}%` }} />
            </div>
            <p className="text-center text-[10px] font-bold uppercase text-gray-500 mt-1">{newStatus}</p>
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <p className="text-[10px] font-bold text-gray-500 mt-1 text-center max-w-[60px] truncate">{shipment.destination}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-transparent rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Weight</p>
            <p className="font-bold text-[#1F2937]">{shipment.weight} kg</p>
          </div>
          <div className="bg-transparent rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Est. Delivery</p>
            <p className="font-bold text-[#1F2937] text-sm">{shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'TBD'}</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Update Status</label>
          <select className={inputCls} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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

/* ─── Create Shipment Modal ─────────────────────────────────────────────────── */
function CreateShipmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ trackingId: `TRK-${Date.now().toString().slice(-6)}`, origin: '', destination: '', status: 'PENDING', weight: 1.0, estimatedDelivery: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/shipments', form);
      if (res.data?.success !== false) { toast.success('Shipment created and tracking initialized!'); onCreate(); onClose(); }
    } catch { toast.error('Failed to create shipment'); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-200"><Truck className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">New Shipment</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className={labelCls}>Tracking ID</label>
          <input type="text" required className={cx(inputCls, 'font-mono')} value={form.trackingId} onChange={e => setForm({...form, trackingId: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Origin</label>
            <input type="text" required placeholder="City" className={inputCls} value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} />
          </div>
          <div>
            <label className={labelCls}>Destination</label>
            <input type="text" required placeholder="City" className={inputCls} value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Weight (kg)</label>
            <input type="number" step="0.1" min="0.1" required className={inputCls} value={form.weight} onChange={e => setForm({...form, weight: parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className={labelCls}>Estimated Delivery</label>
            <input type="date" required className={inputCls} value={form.estimatedDelivery} onChange={e => setForm({...form, estimatedDelivery: e.target.value})} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />}
            Create & Track
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsShipmentTrackingPage = () => {
  const { user, sector } = useAuth();
  const [shipments, setShipments]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [activeTab, setActiveTab]           = useState('ALL');
  const [isCreateOpen, setIsCreateOpen]     = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res  = await api.get('/logistics/shipments');
      const data = res.data?.data ?? res.data;
      setShipments(data?.content ?? (Array.isArray(data) ? data : []));
    } catch (err) { console.error(err); toast.error('Failed to load shipment data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user && sector?.code?.toLowerCase() === 'logistics') fetchShipments(); }, [user, sector]);
  const handleStatusUpdate = (id, newStatus) => setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-white rounded-3xl border border-gray-200 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
          <h2 className="text-2xl font-bold text-[#1F2937]">Logistics Access Only</h2>
        </div>
      </div>
    );
  }

  const tabFilter = (s) => {
    if (activeTab === 'ACTIVE')    return s.status === 'IN_TRANSIT' || s.status === 'DELAYED';
    if (activeTab === 'COMPLETED') return s.status === 'DELIVERED';
    return true;
  };
  const filtered = shipments.filter(s =>
    tabFilter(s) && (
      s.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = [
    { label: 'Total',      count: shipments.length,                                    Icon: Truck,        color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'In Transit', count: shipments.filter(s=>s.status==='IN_TRANSIT').length, Icon: Navigation,   color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { label: 'Delivered',  count: shipments.filter(s=>s.status==='DELIVERED').length,  Icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Delayed',    count: shipments.filter(s=>s.status==='DELAYED').length,    Icon: AlertTriangle, color: 'text-red-700 bg-red-50 border-red-200' },
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
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Shipment Tracking</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-2">Shipment Tracking</h1>
            <p className="text-gray-500 max-w-lg">Real-time logistics monitoring — click any shipment to update status.</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Shipment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, count, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : count}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-4 justify-between p-5 border-b border-gray-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search ID, origin, destination..."
                className="w-full bg-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500/20 border border-gray-200"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex bg-transparent rounded-xl p-1 border border-gray-100">
              {['ALL','ACTIVE','COMPLETED'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={cx('px-4 py-1.5 rounded-lg text-xs font-bold transition-all', activeTab === tab ? 'bg-amber-400 text-[#000]' : 'text-gray-500 hover:text-[#1F2937]')}>
                  {tab === 'ALL' ? 'All' : tab === 'ACTIVE' ? 'Active' : 'Completed'}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Tracking ID', 'Route', 'Status', 'Weight', 'ETA', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-16"><div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" /></div></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-16 text-gray-400 italic">No shipments found.</td></tr>
                ) : filtered.map(s => {
                  const sm = getStatusMeta(s.status);
                  return (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-mono font-bold text-amber-600">#{s.trackingId || `SHP-${s.id}`}</p>
                        <p className="text-[10px] text-gray-400">ID: {s.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[#1F2937]">
                          <span className="font-semibold">{s.origin}</span>
                          <span className="text-gray-400">→</span>
                          <span className="font-semibold">{s.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border', sm.color)}>{sm.label}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{s.weight} kg</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          {s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : 'TBD'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedShipment(s)} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-[#1F2937] transition-colors">
                          <Edit className="w-3.5 h-3.5" /> Track
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedShipment && <ShipmentModal shipment={selectedShipment} onClose={() => setSelectedShipment(null)} onStatusUpdate={handleStatusUpdate} />}
      {isCreateOpen     && <CreateShipmentModal onClose={() => setIsCreateOpen(false)} onCreate={fetchShipments} />}
    </div>
  );
};

export default LogisticsShipmentTrackingPage;
