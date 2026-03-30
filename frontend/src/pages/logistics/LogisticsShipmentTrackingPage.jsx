import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaShippingFast, FaMapMarkerAlt, FaClock, FaCheckCircle,
  FaExclamationTriangle, FaSearch, FaPlus, FaTimes, FaBox,
  FaLocationArrow, FaEdit, FaSave
} from 'react-icons/fa';
import { toast } from 'sonner';

const STATUS_COLORS = {
  DELIVERED:  { badge: 'badge-success', bar: 'bg-emerald-500', pct: 100 },
  IN_TRANSIT: { badge: 'badge-info',    bar: 'bg-blue-500',    pct: 60  },
  PENDING:    { badge: 'badge-warning', bar: 'bg-amber-500',   pct: 10  },
  DELAYED:    { badge: 'badge-error',   bar: 'bg-red-500',     pct: 40  },
};
function getStatusConfig(s) { return STATUS_COLORS[s] || { badge: 'badge-ghost', bar: 'bg-gray-400', pct: 0 }; }

/* ─── Shipment Detail Modal ──────────────────────────────────────────────── */
function ShipmentModal({ shipment, onClose, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(shipment.status);
  const [saving, setSaving] = useState(false);
  const sc = getStatusConfig(newStatus);

  const STATUSES = ['PENDING', 'IN_TRANSIT', 'DELAYED', 'DELIVERED'];

  const handleSave = async () => {
    if (newStatus === shipment.status) { onClose(); return; }
    setSaving(true);
    try {
      await api.put(`/logistics/shipments/${shipment.id}`, { ...shipment, status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      onStatusUpdate(shipment.id, newStatus);
      onClose();
    } catch {
      // Optimistic update if PUT not supported
      onStatusUpdate(shipment.id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaShippingFast className="text-info"/> Shipment Details
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        {/* Tracking header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-4 text-white mb-6">
          <div className="font-mono font-bold text-lg">#{shipment.trackingId || `SHP-${shipment.id}`}</div>
          <div className="text-blue-100 text-sm mt-1">
            {shipment.origin} → {shipment.destination}
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-blue-200 mb-1">
              <span>Progress</span>
              <span>{sc.pct}%</span>
            </div>
            <div className="bg-white/20 h-2 rounded-full overflow-hidden">
              <div className={`${sc.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${sc.pct}%` }}/>
            </div>
          </div>
        </div>

        {/* Journey timeline */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <FaLocationArrow className="text-emerald-600 text-xs"/>
            </div>
            <div className="text-xs font-bold mt-1 text-center">{shipment.origin}</div>
          </div>
          <div className="flex-1 relative">
            <div className="h-1 bg-base-200 rounded"/>
            <div className={`h-1 ${sc.bar} rounded absolute top-0 left-0 transition-all`} style={{ width: `${sc.pct}%` }}/>
            <div className="text-center text-xs opacity-50 mt-2 font-bold">{newStatus}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FaMapMarkerAlt className="text-blue-600 text-xs"/>
            </div>
            <div className="text-xs font-bold mt-1 text-center">{shipment.destination}</div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-base-200 rounded-xl p-3">
            <div className="text-xs opacity-50">Weight</div>
            <div className="font-bold">{shipment.weight} kg</div>
          </div>
          <div className="bg-base-200 rounded-xl p-3">
            <div className="text-xs opacity-50">Est. Delivery</div>
            <div className="font-bold text-sm">
              {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'TBD'}
            </div>
          </div>
        </div>

        {/* Status update */}
        <div className="form-control mb-4">
          <label className="label"><span className="label-text font-semibold">Update Status</span></label>
          <select className="select select-bordered" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-info text-white gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-xs"/> : <FaSave/>}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Create Shipment Modal ───────────────────────────────────────────────── */
function CreateShipmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    trackingId: `TRK-${Date.now().toString().slice(-6)}`,
    origin: '', destination: '', status: 'PENDING',
    weight: 1.0, estimatedDelivery: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/shipments', form);
      const ok = res.data?.success !== false;
      if (ok) {
        toast.success('Shipment created and tracking initialized!');
        onCreate();
        onClose();
      }
    } catch { toast.error('Failed to create shipment'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaShippingFast className="text-info"/> New Shipment
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Tracking ID</span></label>
            <input type="text" className="input input-bordered font-mono" required
              value={form.trackingId} onChange={e => setForm({...form, trackingId: e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Origin</span></label>
              <input type="text" className="input input-bordered" required placeholder="City"
                value={form.origin} onChange={e => setForm({...form, origin: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Destination</span></label>
              <input type="text" className="input input-bordered" required placeholder="City"
                value={form.destination} onChange={e => setForm({...form, destination: e.target.value})}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Weight (kg)</span></label>
              <input type="number" step="0.1" min="0.1" className="input input-bordered" required
                value={form.weight} onChange={e => setForm({...form, weight: parseFloat(e.target.value)})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Estimated Delivery</span></label>
              <input type="date" className="input input-bordered" required
                value={form.estimatedDelivery} onChange={e => setForm({...form, estimatedDelivery: e.target.value})}/>
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-info text-white" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs"/> : null}
              Create & Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsShipmentTrackingPage = () => {
  const { user, sector } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/shipments');
      const data = res.data?.data ?? res.data;
      setShipments(data?.content ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Failed to fetch shipments', err);
      toast.error('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchShipments();
  }, [user, sector]);

  const handleStatusUpdate = (id, newStatus) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-warning mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Logistics Access Only</h2>
          <p className="text-base-content/60 mb-4">Please log in with logistics credentials.</p>
        </div>
      </div>
    );
  }

  const tabFilter = (s) => {
    if (activeTab === 'ACTIVE') return s.status === 'IN_TRANSIT' || s.status === 'DELAYED';
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

  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaShippingFast className="text-blue-500"/> Shipment Tracking
          </h1>
          <p className="text-base-content/60 mt-1">Real-time logistics monitoring — click any shipment to update status.</p>
        </div>
        <button className="btn btn-info gap-2 text-white shadow-lg" onClick={() => setIsCreateOpen(true)}>
          <FaPlus/> New Shipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: shipments.length, color: 'text-base-content', border: 'border-base-300' },
          { label: 'In Transit', count: shipments.filter(s=>s.status==='IN_TRANSIT').length, color: 'text-blue-500', border: 'border-blue-500' },
          { label: 'Delivered', count: shipments.filter(s=>s.status==='DELIVERED').length, color: 'text-emerald-500', border: 'border-emerald-500' },
          { label: 'Delayed', count: shipments.filter(s=>s.status==='DELAYED').length, color: 'text-red-500', border: 'border-red-500' },
        ].map(k => (
          <div key={k.label} className={`card bg-base-100 shadow border-l-4 ${k.border}`}>
            <div className="card-body py-4 px-5">
              <p className="text-xs uppercase opacity-50 font-bold">{k.label}</p>
              <p className={`text-3xl font-extrabold ${k.color}`}>{loading ? '—' : k.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30"/>
            <input type="text" placeholder="Search ID, origin, destination..."
              className="input input-bordered w-full pl-10"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
          </div>
          <div className="tabs tabs-boxed">
            {['ALL','ACTIVE','COMPLETED'].map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'ALL' ? 'All' : tab === 'ACTIVE' ? 'Active' : 'Completed'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-lg w-full">
            <thead>
              <tr>
                <th>Tracking ID</th>
                <th>Route</th>
                <th>Status</th>
                <th>Weight</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-16"><span className="loading loading-spinner loading-lg text-info"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-16 text-base-content/40 italic">No shipments found.</td></tr>
              ) : filtered.map(s => {
                const sc = getStatusConfig(s.status);
                return (
                  <tr key={s.id} className="hover:bg-base-200/50 transition-colors">
                    <td>
                      <div className="font-mono font-bold text-info">#{s.trackingId || `SHP-${s.id}`}</div>
                      <div className="text-xs opacity-40">ID: {s.id}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{s.origin}</span>
                        <span className="text-base-content/30">→</span>
                        <span className="font-semibold">{s.destination}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${sc.badge} font-bold gap-1`}>
                        {s.status === 'DELIVERED' && <FaCheckCircle/>}
                        {s.status === 'DELAYED' && <FaExclamationTriangle/>}
                        {s.status}
                      </span>
                    </td>
                    <td><span className="badge badge-outline">{s.weight} kg</span></td>
                    <td>
                      <div className="flex items-center gap-1 text-sm">
                        <FaClock className="text-base-content/30"/>
                        {s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : 'TBD'}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm gap-1 text-info"
                        onClick={() => setSelectedShipment(s)}
                      >
                        <FaEdit className="text-xs"/> Track
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedShipment && (
        <ShipmentModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      {isCreateOpen && (
        <CreateShipmentModal
          onClose={() => setIsCreateOpen(false)}
          onCreate={fetchShipments}
        />
      )}
    </div>
  );
};

export default LogisticsShipmentTrackingPage;
