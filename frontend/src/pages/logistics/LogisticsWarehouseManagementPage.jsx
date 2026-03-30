import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaWarehouse, FaExclamationTriangle, FaBoxOpen, FaThLarge,
  FaHistory, FaTimes, FaLayerGroup, FaArrowUp, FaArrowDown,
  FaSearch
} from 'react-icons/fa';
import { toast } from 'sonner';

/* ─── Zone visual layout ──────────────────────────────────────────────────── */
const ZONE_COLORS = [
  { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'from-violet-500 to-purple-500', light: 'bg-violet-50', text: 'text-violet-600' },
  { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50', text: 'text-amber-600' },
  { bg: 'from-rose-500 to-pink-500', light: 'bg-rose-50', text: 'text-rose-600' },
];

/* ─── Layout Drawer ───────────────────────────────────────────────────────── */
function WarehouseLayoutModal({ location, items, onClose }) {
  const totalStock = items.reduce((s, i) => s + i.quantity, 0);
  const capacity = 10000;
  const utilization = Math.min(Math.round((totalStock / capacity) * 100), 100);

  // Grid layout: up to 4 items per row, each as a bay
  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const itemZones = items.map((item, i) => ({ item, zone: zones[i] || `Z${i}` }));

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaLayerGroup className="text-primary"/> {location} — Floor Plan
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        {/* Capacity bar */}
        <div className="mb-6 p-4 bg-base-200 rounded-xl">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span>Capacity Utilization</span>
            <span className={utilization > 85 ? 'text-error' : utilization > 60 ? 'text-warning' : 'text-success'}>
              {utilization}%
            </span>
          </div>
          <div className="bg-base-300 h-4 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${utilization > 85 ? 'bg-error' : utilization > 60 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${utilization}%` }}
            />
          </div>
          <div className="flex justify-between text-xs opacity-50 mt-1">
            <span>0 units</span>
            <span>{totalStock.toLocaleString()} / {capacity.toLocaleString()} units</span>
          </div>
        </div>

        {/* Bay Grid */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm opacity-60 uppercase tracking-wider mb-3">Storage Bays</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {itemZones.length === 0 ? (
              <div className="col-span-3 text-center py-8 opacity-40 italic">No items assigned to this warehouse.</div>
            ) : itemZones.map(({ item, zone }, i) => {
              const color = ZONE_COLORS[i % ZONE_COLORS.length];
              const isLow = item.quantity <= item.reorderPoint;
              return (
                <div key={item.id} className={`rounded-xl border-2 ${isLow ? 'border-red-400 border-dashed' : 'border-transparent'} overflow-hidden`}>
                  <div className={`bg-gradient-to-r ${color.bg} text-white px-3 py-1.5 flex items-center justify-between`}>
                    <span className="text-xs font-bold">Bay {zone}</span>
                    {isLow && <span className="text-xs bg-white/20 px-1 rounded">LOW</span>}
                  </div>
                  <div className={`${color.light} p-3`}>
                    <div className={`font-bold text-sm ${color.text} truncate`}>{item.productName}</div>
                    <div className="text-xs opacity-60 mt-1">
                      Stock: <span className="font-mono font-bold">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary text-white" onClick={() => { toast.info('Warehouse report exported!'); onClose(); }}>
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Logs Modal ──────────────────────────────────────────────────────────── */
function WarehouseLogsModal({ location, items, onClose }) {
  // Simulated activity logs
  const logs = items.flatMap((item, i) => [
    { time: new Date(Date.now() - (i * 3 + 1) * 3600000).toLocaleString(), action: 'Dispatched', qty: `-${Math.floor(item.quantity * 0.1)}`, item: item.productName, by: 'driver_raj' },
    { time: new Date(Date.now() - (i * 3 + 5) * 3600000).toLocaleString(), action: 'Restocked', qty: `+${Math.floor(item.quantity * 0.2)}`, item: item.productName, by: 'warehouse_manager' },
  ]).sort(() => Math.random() - 0.5).slice(0, 10);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaHistory className="text-primary"/> {location} — Activity Logs
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-center py-8 opacity-40 italic">No activity logs available.</div>
          ) : logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-base-200 rounded-xl hover:bg-base-300/50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm flex items-center gap-2">
                  <span className={`badge badge-sm ${log.action === 'Dispatched' ? 'badge-error' : 'badge-success'}`}>
                    {log.action}
                  </span>
                  <span className="truncate opacity-70">{log.item}</span>
                </div>
                <div className="text-xs opacity-40 mt-0.5">{log.time} · by {log.by}</div>
              </div>
              <span className={`font-bold font-mono ml-3 flex-shrink-0 ${log.qty.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {log.qty.startsWith('+') ? <FaArrowUp className="inline text-xs"/> : <FaArrowDown className="inline text-xs"/>}
                {' '}{log.qty}
              </span>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsWarehouseManagementPage = () => {
  const { user, sector } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [layoutModal, setLayoutModal] = useState(null); // { location, items }
  const [logsModal, setLogsModal] = useState(null);     // { location, items }

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/inventory');
      const data = res.data?.data ?? res.data;
      setInventory(data?.content ?? (Array.isArray(data) ? data : []));
    } catch {
      toast.error('Failed to load warehouse data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchInventory();
  }, [user, sector]);

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

  const warehouses = [...new Set(inventory.map(i => i.warehouseLocation || 'Unassigned'))];

  const getWarehouseStats = (loc) => {
    const items = inventory.filter(i => (i.warehouseLocation || 'Unassigned') === loc);
    const totalStock = items.reduce((s, i) => s + i.quantity, 0);
    const capacity = 10000;
    return {
      items,
      count: items.length,
      stock: totalStock,
      utilization: Math.min(Math.round((totalStock / capacity) * 100), 100),
      lowStock: items.filter(i => i.quantity <= i.reorderPoint).length,
    };
  };

  const filteredWarehouses = warehouses.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaWarehouse className="text-primary"/> Warehouse Hub
          </h1>
          <p className="text-base-content/60 mt-1">
            Global site management, inventory distribution, and capacity monitoring. Click "View Layout" to see the floor plan.
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30"/>
          <input type="text" placeholder="Search warehouse..."
            className="input input-bordered w-full pl-10"
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        </div>
      </div>

      {/* Summary bar */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Warehouses', value: warehouses.length, color: 'text-primary' },
            { label: 'Total SKUs', value: inventory.length, color: 'text-emerald-500' },
            { label: 'Low Stock Alerts', value: inventory.filter(i => i.quantity <= i.reorderPoint).length, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="card bg-base-100 shadow text-center py-4">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs opacity-50 uppercase font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <span className="loading loading-spinner loading-lg text-primary"/>
            <p className="mt-4 opacity-40 italic">Scanning warehouse sensors...</p>
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="col-span-full card bg-base-100 shadow p-20 text-center opacity-40 italic">
            No warehouse locations found.
          </div>
        ) : filteredWarehouses.map((loc, idx) => {
          const stats = getWarehouseStats(loc);
          const color = ZONE_COLORS[idx % ZONE_COLORS.length];
          return (
            <div key={idx} className="card bg-base-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              {/* Card header */}
              <div className={`bg-gradient-to-r ${color.bg} p-5 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-extrabold text-xl">{loc}</h2>
                    <p className="text-white/70 text-sm mt-0.5">{stats.count} SKU{stats.count !== 1 ? 's' : ''} stored</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FaThLarge className="text-lg"/>
                  </div>
                </div>
              </div>

              <div className="card-body p-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs opacity-50 uppercase font-bold">SKU Count</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      <FaBoxOpen className={`text-sm ${color.text}`}/> {stats.count}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs opacity-50 uppercase font-bold">Total Stock</p>
                    <p className="text-2xl font-bold">{stats.stock.toLocaleString()}</p>
                  </div>
                </div>

                {/* Alerts */}
                {stats.lowStock > 0 && (
                  <div className="alert alert-warning py-2 mb-3">
                    <FaExclamationTriangle className="text-xs"/>
                    <span className="text-xs">{stats.lowStock} item{stats.lowStock > 1 ? 's' : ''} below reorder threshold</span>
                  </div>
                )}

                {/* Utilization bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="opacity-50">Capacity Utilization</span>
                    <span>{stats.utilization}%</span>
                  </div>
                  <div className="bg-base-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${stats.utilization > 85 ? 'bg-error' : stats.utilization > 60 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${stats.utilization}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-ghost btn-sm gap-2 opacity-70 hover:opacity-100"
                    onClick={() => setLogsModal({ location: loc, items: stats.items })}
                  >
                    <FaHistory className="text-xs"/> Logs
                  </button>
                  <button
                    className={`btn btn-sm text-white gap-2 bg-gradient-to-r ${color.bg} border-0 hover:opacity-90`}
                    onClick={() => setLayoutModal({ location: loc, items: stats.items })}
                  >
                    <FaLayerGroup className="text-xs"/> View Layout
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {layoutModal && (
        <WarehouseLayoutModal
          location={layoutModal.location}
          items={layoutModal.items}
          onClose={() => setLayoutModal(null)}
        />
      )}
      {logsModal && (
        <WarehouseLogsModal
          location={logsModal.location}
          items={logsModal.items}
          onClose={() => setLogsModal(null)}
        />
      )}
    </div>
  );
};

export default LogisticsWarehouseManagementPage;
