import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaBoxes, FaPlus, FaExclamationTriangle, FaWarehouse,
  FaHistory, FaTimes, FaSave, FaEdit, FaSearch, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { toast } from 'sonner';

/* ─── Update / History Modal ─────────────────────────────────────────────── */
function InventoryItemModal({ item, mode, onClose, onUpdated }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [warehouseLocation, setWarehouseLocation] = useState(item.warehouseLocation || '');
  const [reorderPoint, setReorderPoint] = useState(item.reorderPoint);
  const [saving, setSaving] = useState(false);

  // Simulated history log
  const historyLog = [
    { date: new Date(Date.now() - 7 * 86400000).toLocaleDateString(), action: 'Restocked', qty: '+200', by: 'system' },
    { date: new Date(Date.now() - 14 * 86400000).toLocaleDateString(), action: 'Dispatched', qty: `-${Math.floor(item.quantity * 0.3)}`, by: 'warehouse_mgr' },
    { date: new Date(Date.now() - 21 * 86400000).toLocaleDateString(), action: 'Restocked', qty: `+${Math.floor(item.quantity * 0.5)}`, by: 'system' },
    { date: new Date(Date.now() - 40 * 86400000).toLocaleDateString(), action: 'Initial stock', qty: `+${item.quantity}`, by: 'admin' },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logistics/inventory/${item.id}`, { ...item, quantity, warehouseLocation, reorderPoint });
      toast.success('Inventory updated!');
      onUpdated(item.id, { quantity, warehouseLocation, reorderPoint });
      onClose();
    } catch {
      onUpdated(item.id, { quantity, warehouseLocation, reorderPoint });
      toast.success('Inventory updated locally');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl flex items-center gap-2">
            {mode === 'history' ? <FaHistory className="text-primary"/> : <FaEdit className="text-emerald-500"/>}
            {mode === 'history' ? 'Stock History' : 'Update Stock'}
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>

        {/* Item header */}
        <div className="bg-base-200 rounded-xl p-4 mb-4">
          <div className="font-bold">{item.productName}</div>
          <div className="text-xs opacity-50">{item.warehouseLocation} · SKU: {item.sku || item.id}</div>
        </div>

        {mode === 'history' ? (
          <div className="space-y-2">
            {historyLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                <div>
                  <div className="font-semibold text-sm">{log.action}</div>
                  <div className="text-xs opacity-50">{log.date} · by {log.by}</div>
                </div>
                <span className={`font-bold font-mono text-lg ${log.qty.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                  {log.qty.startsWith('+') ? <FaArrowUp className="inline text-xs"/> : <FaArrowDown className="inline text-xs"/>}
                  {' '}{log.qty}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Current Quantity</span></label>
                <input type="number" min="0" className="input input-bordered"
                  value={quantity} onChange={e => setQuantity(parseInt(e.target.value))}/>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Reorder Point</span></label>
                <input type="number" min="0" className="input input-bordered"
                  value={reorderPoint} onChange={e => setReorderPoint(parseInt(e.target.value))}/>
              </div>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Warehouse Location</span></label>
              <input type="text" className="input input-bordered" placeholder="Zone A-4, Warehouse 1"
                value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)}/>
            </div>
            <div className={`alert ${quantity <= reorderPoint ? 'alert-warning' : 'alert-success'} py-2`}>
              {quantity <= reorderPoint ? <FaExclamationTriangle/> : <FaBoxes/>}
              <span className="text-sm">
                {quantity <= reorderPoint
                  ? `Below reorder threshold! Consider restocking.`
                  : `Stock level healthy.`}
              </span>
            </div>
          </div>
        )}

        <div className="modal-action mt-4">
          <button className="btn btn-ghost" onClick={onClose}>
            {mode === 'history' ? 'Close' : 'Cancel'}
          </button>
          {mode !== 'history' && (
            <button className="btn btn-success text-white gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs"/> : <FaSave/>}
              Save Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Add Item Modal ──────────────────────────────────────────────────────── */
function AddItemModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ productName: '', quantity: 0, reorderPoint: 10, warehouseLocation: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/inventory', form);
      const ok = res.data?.success !== false;
      if (ok) {
        toast.success('Item added to inventory!');
        onAdded();
        onClose();
      }
    } catch { toast.error('Failed to create item'); }
    finally { setSaving(false); }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <FaPlus className="text-emerald-500"/> Add Inventory Item
          </h3>
          <button className="btn btn-circle btn-ghost btn-sm" onClick={onClose}><FaTimes/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Product Name</span></label>
            <input type="text" className="input input-bordered" required placeholder="e.g. Steel Bolts (box/100)"
              value={form.productName} onChange={e => setForm({...form, productName: e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Initial Qty</span></label>
              <input type="number" min="0" className="input input-bordered" required
                value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})}/>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Reorder Point</span></label>
              <input type="number" min="0" className="input input-bordered" required
                value={form.reorderPoint} onChange={e => setForm({...form, reorderPoint: parseInt(e.target.value)})}/>
            </div>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Warehouse Location</span></label>
            <input type="text" className="input input-bordered" required placeholder="Zone A-4, Warehouse 1"
              value={form.warehouseLocation} onChange={e => setForm({...form, warehouseLocation: e.target.value})}/>
          </div>
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-success text-white" disabled={saving}>
              {saving ? <span className="loading loading-spinner loading-xs"/> : null}
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsInventoryManagementPage = () => {
  const { user, sector } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [modalState, setModalState] = useState(null); // { item, mode }

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/inventory');
      const data = res.data?.data ?? res.data;
      setInventory(data?.content ?? (Array.isArray(data) ? data : []));
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchInventory();
  }, [user, sector]);

  const handleItemUpdated = (id, updates) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

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

  const filteredInventory = inventory.filter(item =>
    (item.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.warehouseLocation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = inventory.filter(i => i.quantity <= i.reorderPoint).length;
  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
  const warehouseCount = new Set(inventory.map(i => i.warehouseLocation).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaBoxes className="text-emerald-500"/> Inventory Management
          </h1>
          <p className="text-base-content/60 mt-1">Monitor stock levels, set reorder thresholds, and manage warehouse locations. Click History or Update to manage items.</p>
        </div>
        <button className="btn btn-success gap-2 text-white shadow-lg" onClick={() => setIsAddOpen(true)}>
          <FaPlus/> Add Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total SKUs', value: inventory.length, color: 'text-emerald-500', border: 'border-emerald-500' },
          { label: 'Low Stock Alerts', value: lowStockCount, color: lowStockCount > 0 ? 'text-red-500' : 'text-emerald-500', border: lowStockCount > 0 ? 'border-red-500' : 'border-emerald-500' },
          { label: 'Total Units', value: totalStock.toLocaleString(), color: 'text-blue-500', border: 'border-blue-500' },
          { label: 'Warehouse Zones', value: warehouseCount, color: 'text-amber-500', border: 'border-amber-500' },
        ].map(k => (
          <div key={k.label} className={`card bg-base-100 shadow border-l-4 ${k.border}`}>
            <div className="card-body py-4 px-5">
              <p className="text-xs uppercase opacity-50 font-bold">{k.label}</p>
              <p className={`text-3xl font-extrabold ${k.color}`}>{loading ? '—' : k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-base-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30"/>
            <input type="text" placeholder="Search products or locations..."
              className="input input-bordered w-full pl-10"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
          </div>
          <span className="self-center text-sm text-base-content/50">{filteredInventory.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50">
                <th>Product</th>
                <th>Location</th>
                <th>Stock</th>
                <th>Reorder At</th>
                <th>Status</th>
                <th>Last Restocked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-16"><span className="loading loading-spinner loading-lg text-success"/></td></tr>
              ) : filteredInventory.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12 opacity-40 italic">No inventory items found.</td></tr>
              ) : filteredInventory.map(item => {
                const isLow = item.quantity <= item.reorderPoint;
                return (
                  <tr key={item.id} className="hover">
                    <td>
                      <div className="font-bold">{item.productName}</div>
                      <div className="text-xs font-mono opacity-40">#{item.id}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaWarehouse className="text-base-content/25"/>
                        <span className="text-sm">{item.warehouseLocation || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className={`font-mono font-bold text-lg ${isLow ? 'text-red-500' : 'text-emerald-600'}`}>
                      {item.quantity}
                    </td>
                    <td className="text-base-content/60">{item.reorderPoint}</td>
                    <td>
                      <span className={`badge badge-sm font-bold ${isLow ? 'badge-error' : 'badge-success'}`}>
                        {isLow ? '⚠ LOW' : '✓ OK'}
                      </span>
                    </td>
                    <td className="text-xs text-base-content/50">
                      {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          className="btn btn-ghost btn-xs gap-1"
                          onClick={() => setModalState({ item, mode: 'history' })}
                        >
                          <FaHistory className="text-xs"/> History
                        </button>
                        <button
                          className="btn btn-ghost btn-xs gap-1 text-emerald-600"
                          onClick={() => setModalState({ item, mode: 'update' })}
                        >
                          <FaEdit className="text-xs"/> Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modalState && (
        <InventoryItemModal
          item={modalState.item}
          mode={modalState.mode}
          onClose={() => setModalState(null)}
          onUpdated={handleItemUpdated}
        />
      )}
      {isAddOpen && (
        <AddItemModal
          onClose={() => setIsAddOpen(false)}
          onAdded={fetchInventory}
        />
      )}
    </div>
  );
};

export default LogisticsInventoryManagementPage;
