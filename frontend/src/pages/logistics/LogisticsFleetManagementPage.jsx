import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaTruck, FaPlus, FaWrench, FaUserCircle, FaExclamationTriangle,
  FaCheckCircle, FaCarSide, FaTimes, FaSave, FaEdit
} from 'react-icons/fa';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'];

function getStatusBadge(status) {
  switch (status) {
    case 'AVAILABLE': return 'badge-success';
    case 'IN_USE': return 'badge-info';
    case 'MAINTENANCE': return 'badge-warning';
    case 'RETIRED': return 'badge-error';
    default: return 'badge-ghost';
  }
}

/* ─── Vehicle Detail / Service Modal ─────────────────────────────────────── */
function VehicleServiceModal({ vehicle, onClose, onUpdated }) {
  const [status, setStatus] = useState(vehicle.status);
  const [driver, setDriver] = useState(vehicle.currentDriver || '');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logistics/vehicles/${vehicle.id}`, { ...vehicle, status, currentDriver: driver });
      toast.success('Vehicle record updated!');
      onUpdated(vehicle.id, { status, currentDriver: driver });
      onClose();
    } catch {
      // Optimistic local update
      onUpdated(vehicle.id, { status, currentDriver: driver });
      toast.success('Vehicle updated locally');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaWrench className="text-amber-500"/> Vehicle Service
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        {/* Vehicle card */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 text-white mb-6">
          <div className="flex items-center gap-3">
            <FaTruck className="text-3xl opacity-80"/>
            <div>
              <div className="font-bold text-lg font-mono">{vehicle.plateNumber}</div>
              <div className="text-amber-100 text-sm">{vehicle.model} · {vehicle.capacity}T capacity</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Vehicle Status</span></label>
            <select className="select select-bordered" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Assigned Driver</span></label>
            <input type="text" className="input input-bordered" placeholder="Driver name"
              value={driver} onChange={e => setDriver(e.target.value)}/>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Service Notes</span></label>
            <textarea className="textarea textarea-bordered" rows={3}
              placeholder="e.g. Oil change, brake inspection, tyre rotation..."
              value={notes} onChange={e => setNotes(e.target.value)}/>
          </div>

          {status === 'MAINTENANCE' && (
            <div className="alert alert-warning">
              <FaWrench/>
              <span className="text-sm">Vehicle will be removed from active fleet scheduling.</span>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-warning text-white gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <span className="loading loading-spinner loading-xs"/> : <FaSave/>}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Add Vehicle Modal ───────────────────────────────────────────────────── */
function AddVehicleModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ plateNumber: '', model: '', status: 'AVAILABLE', capacity: 0, currentDriver: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/vehicles', form);
      const ok = res.data?.success !== false;
      if (ok) {
        toast.success('Vehicle added to fleet!');
        onAdded();
        onClose();
      }
    } catch { toast.error('Failed to register vehicle'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaTruck className="text-amber-500"/> Register Vehicle
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Plate Number</span></label>
              <input type="text" className="input input-bordered font-mono" required
                placeholder="MH-01-AB-1234"
                value={form.plateNumber} onChange={e => setForm({...form, plateNumber: e.target.value})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Model</span></label>
              <input type="text" className="input input-bordered" required placeholder="Tata ACE"
                value={form.model} onChange={e => setForm({...form, model: e.target.value})}/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Capacity (Tons)</span></label>
              <input type="number" step="0.1" min="0" className="input input-bordered" required
                value={form.capacity} onChange={e => setForm({...form, capacity: parseFloat(e.target.value)})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Initial Status</span></label>
              <select className="select select-bordered" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Driver Name</span></label>
            <input type="text" className="input input-bordered" placeholder="Optional"
              value={form.currentDriver} onChange={e => setForm({...form, currentDriver: e.target.value})}/>
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-warning text-white" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs"/> : null}
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsFleetManagementPage = () => {
  const { user, sector } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [serviceVehicle, setServiceVehicle] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/vehicles');
      const data = res.data?.data ?? res.data;
      setVehicles(data?.content ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      toast.error('Failed to load fleet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchVehicles();
  }, [user, sector]);

  const handleVehicleUpdated = (id, updates) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md">
          <FaExclamationTriangle className="text-5xl text-warning mx-auto mb-4"/>
          <h2 className="text-2xl font-bold mb-2">Logistics Access Only</h2>
        </div>
      </div>
    );
  }

  const filtered = filterStatus === 'ALL' ? vehicles : vehicles.filter(v => v.status === filterStatus);
  const available = vehicles.filter(v => v.status === 'AVAILABLE').length;
  const inUse = vehicles.filter(v => v.status === 'IN_USE').length;
  const maintenance = vehicles.filter(v => v.status === 'MAINTENANCE').length;

  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaTruck className="text-amber-500"/> Fleet Management
          </h1>
          <p className="text-base-content/60 mt-1">Monitor vehicle status, service schedules, and driver assignments. Click "Service" to update any vehicle.</p>
        </div>
        <button className="btn btn-warning gap-2 text-white shadow-lg" onClick={() => setIsAddOpen(true)}>
          <FaPlus/> Add Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Fleet', value: vehicles.length, color: 'text-base-content', border: 'border-base-300', filter: 'ALL' },
          { label: 'Available', value: available, color: 'text-emerald-500', border: 'border-emerald-500', filter: 'AVAILABLE' },
          { label: 'In Service', value: inUse, color: 'text-blue-500', border: 'border-blue-500', filter: 'IN_USE' },
          { label: 'Maintenance', value: maintenance, color: 'text-amber-500', border: 'border-amber-500', filter: 'MAINTENANCE' },
        ].map(k => (
          <div
            key={k.label}
            className={`card bg-base-100 shadow border-l-4 ${k.border} cursor-pointer hover:shadow-lg transition-shadow ${filterStatus === k.filter ? 'ring-2 ring-offset-1 ring-amber-400' : ''}`}
            onClick={() => setFilterStatus(k.filter)}
          >
            <div className="card-body py-4 px-5">
              <p className="text-xs uppercase opacity-50 font-bold">{k.label}</p>
              <p className={`text-3xl font-extrabold ${k.color}`}>{loading ? '—' : k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between">
          <h2 className="font-bold text-lg">Fleet Registry</h2>
          <span className="badge badge-ghost">{filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Plate / ID</th>
                <th>Model</th>
                <th>Status</th>
                <th>Capacity</th>
                <th>Driver</th>
                <th>Last Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-16"><span className="loading loading-spinner loading-lg text-warning"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 opacity-40 italic">No vehicles match filter.</td></tr>
              ) : filtered.map(v => (
                <tr key={v.id} className="hover">
                  <td>
                    <div className="font-bold font-mono">{v.plateNumber}</div>
                    <div className="text-xs opacity-40">VH-{v.id}</div>
                  </td>
                  <td className="font-medium">{v.model}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(v.status)} font-bold`}>{v.status}</span>
                  </td>
                  <td>{v.capacity} T</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="text-base-content/25 text-lg"/>
                      <span className={v.currentDriver ? '' : 'opacity-40 italic'}>{v.currentDriver || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="text-sm text-base-content/60">
                    {v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'Pending'}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm gap-1 text-amber-600"
                      onClick={() => setServiceVehicle(v)}
                    >
                      <FaWrench className="text-xs"/> Service
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {serviceVehicle && (
        <VehicleServiceModal
          vehicle={serviceVehicle}
          onClose={() => setServiceVehicle(null)}
          onUpdated={handleVehicleUpdated}
        />
      )}
      {isAddOpen && (
        <AddVehicleModal
          onClose={() => setIsAddOpen(false)}
          onAdded={fetchVehicles}
        />
      )}
    </div>
  );
};

export default LogisticsFleetManagementPage;
