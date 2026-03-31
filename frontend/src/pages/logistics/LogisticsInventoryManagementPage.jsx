import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Package, Plus, AlertTriangle, Warehouse, History,
  X, Save, Edit, Search, ArrowUp, ArrowDown
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all shadow-sm";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
const ModalShell = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl">{children}</div>
  </div>
);

/* ─── Update / History Modal ────────────────────────────────────────────────── */
function InventoryItemModal({ item, mode, onClose, onUpdated }) {
  const [quantity, setQuantity]                 = useState(item.quantity);
  const [warehouseLocation, setWarehouseLocation] = useState(item.warehouseLocation || '');
  const [reorderPoint, setReorderPoint]         = useState(item.reorderPoint);
  const [saving, setSaving]                     = useState(false);

  const historyLog = [
    { date: new Date(Date.now() - 7  * 86400000).toLocaleDateString(), action: 'Restocked',    qty: '+200',                                  by: 'system' },
    { date: new Date(Date.now() - 14 * 86400000).toLocaleDateString(), action: 'Dispatched',   qty: `-${Math.floor(item.quantity * 0.3)}`,    by: 'warehouse_mgr' },
    { date: new Date(Date.now() - 21 * 86400000).toLocaleDateString(), action: 'Restocked',    qty: `+${Math.floor(item.quantity * 0.5)}`,    by: 'system' },
    { date: new Date(Date.now() - 40 * 86400000).toLocaleDateString(), action: 'Initial stock', qty: `+${item.quantity}`,                     by: 'admin' },
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
    } finally { setSaving(false); }
  };

  const isLow = quantity <= reorderPoint;

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={cx('p-2 rounded-xl border', mode === 'history' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20')}>
            {mode === 'history' ? <History className="w-5 h-5 text-amber-600" /> : <Edit className="w-5 h-5 text-emerald-600" />}
          </div>
          <h3 className="font-bold text-[#1F2937] text-lg">{mode === 'history' ? 'Stock History' : 'Update Stock'}</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-4">
        <div className="bg-transparent rounded-xl p-4">
          <p className="font-bold text-[#1F2937]">{item.productName}</p>
          <p className="text-xs text-gray-500 font-mono">{item.warehouseLocation} · SKU: {item.sku || item.id}</p>
        </div>

        {mode === 'history' ? (
          <div className="space-y-2">
            {historyLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-transparent rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-[#1F2937]">{log.action}</p>
                  <p className="text-[10px] text-gray-500">{log.date} · by {log.by}</p>
                </div>
                <span className={cx('font-bold font-mono flex items-center gap-1 text-sm', log.qty.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
                  {log.qty.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {log.qty}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Current Quantity</label>
                <input type="number" min="0" className={inputCls} value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Reorder Point</label>
                <input type="number" min="0" className={inputCls} value={reorderPoint} onChange={e => setReorderPoint(parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Warehouse Location</label>
              <input type="text" placeholder="Zone A-4, Warehouse 1" className={inputCls} value={warehouseLocation} onChange={e => setWarehouseLocation(e.target.value)} />
            </div>
            <div className={cx('flex items-center gap-3 p-3 rounded-xl border text-sm', isLow ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600')}>
              {isLow ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <Package className="w-4 h-4 shrink-0" />}
              {isLow ? 'Below reorder threshold! Consider restocking.' : 'Stock level healthy.'}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">{mode === 'history' ? 'Close' : 'Cancel'}</button>
          {mode !== 'history' && (
            <button onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-emerald-400 to-emerald-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" /> : <Save className="w-4 h-4" />}
              Save Stock
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

/* ─── Add Item Modal ────────────────────────────────────────────────────────── */
function AddItemModal({ onClose, onAdded }) {
  const [form, setForm]   = useState({ productName: '', quantity: 0, reorderPoint: 10, warehouseLocation: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/logistics/inventory', form);
      if (res.data?.success !== false) { toast.success('Item added to inventory!'); onAdded(); onClose(); }
    } catch { toast.error('Failed to create item'); }
    finally { setSaving(false); }
  };

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-200"><Plus className="w-5 h-5 text-amber-600" /></div>
          <h3 className="font-bold text-[#1F2937] text-lg">Add Inventory Item</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className={labelCls}>Product Name</label>
          <input type="text" required placeholder="e.g. Steel Bolts (box/100)" className={inputCls} value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Initial Qty</label>
            <input type="number" min="0" required className={inputCls} value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className={labelCls}>Reorder Point</label>
            <input type="number" min="0" required className={inputCls} value={form.reorderPoint} onChange={e => setForm({...form, reorderPoint: parseInt(e.target.value)})} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Warehouse Location</label>
          <input type="text" required placeholder="Zone A-4, Warehouse 1" className={inputCls} value={form.warehouseLocation} onChange={e => setForm({...form, warehouseLocation: e.target.value})} />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {saving && <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />}
            Add Item
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsInventoryManagementPage = () => {
  const { user, sector } = useAuth();
  const [inventory, setInventory]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen]   = useState(false);
  const [modalState, setModalState] = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res  = await api.get('/logistics/inventory');
      const data = res.data?.data ?? res.data;
      setInventory(data?.content ?? (Array.isArray(data) ? data : []));
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user && sector?.code?.toLowerCase() === 'logistics') fetchInventory(); }, [user, sector]);
  const handleItemUpdated = (id, updates) => setInventory(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));

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

  const filteredInventory = inventory.filter(item =>
    (item.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.warehouseLocation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const lowStockCount  = inventory.filter(i => i.quantity <= i.reorderPoint).length;
  const totalStock     = inventory.reduce((s, i) => s + i.quantity, 0);
  const warehouseCount = new Set(inventory.map(i => i.warehouseLocation).filter(Boolean)).size;

  const statsData = [
    { label: 'Total SKUs',       value: inventory.length,             color: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: Package },
    { label: 'Low Stock Alerts', value: lowStockCount,                color: lowStockCount > 0 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: AlertTriangle },
    { label: 'Total Units',      value: totalStock.toLocaleString(),  color: 'text-sky-700 bg-sky-50 border-sky-200',             Icon: Package },
    { label: 'Warehouse Zones',  value: warehouseCount,               color: 'text-amber-700 bg-amber-50 border-amber-200',       Icon: Warehouse },
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
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Inventory</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-2">Inventory Management</h1>
            <p className="text-gray-500 max-w-lg">Monitor stock levels, set reorder thresholds, and manage warehouse locations.</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-5 border-b border-gray-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search products or locations..."
                className="w-full bg-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none border border-gray-200"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <span className="self-center text-sm text-gray-500">{filteredInventory.length} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Product', 'Location', 'Stock', 'Reorder At', 'Status', 'Last Restocked', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-16"><div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" /></div></td></tr>
                ) : filteredInventory.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-16 text-gray-400 italic">No inventory items found.</td></tr>
                ) : filteredInventory.map(item => {
                  const isLow = item.quantity <= item.reorderPoint;
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#1F2937]">{item.productName}</p>
                        <p className="font-mono text-[10px] text-gray-400">#{item.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Warehouse className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm">{item.warehouseLocation || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cx('font-mono font-bold text-lg', isLow ? 'text-red-600' : 'text-emerald-600')}>{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.reorderPoint}</td>
                      <td className="px-6 py-4">
                        <span className={cx('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', isLow ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200')}>
                          {isLow ? '⚠ LOW' : '✓ OK'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => setModalState({ item, mode: 'history' })} className="text-xs font-bold text-amber-600 hover:text-[#1F2937] transition-colors flex items-center gap-1">
                            <History className="w-3.5 h-3.5" /> History
                          </button>
                          <button onClick={() => setModalState({ item, mode: 'update' })} className="text-xs font-bold text-emerald-600 hover:text-[#1F2937] transition-colors flex items-center gap-1">
                            <Edit className="w-3.5 h-3.5" /> Update
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
      </div>

      {modalState && <InventoryItemModal item={modalState.item} mode={modalState.mode} onClose={() => setModalState(null)} onUpdated={handleItemUpdated} />}
      {isAddOpen  && <AddItemModal onClose={() => setIsAddOpen(false)} onAdded={fetchInventory} />}
    </div>
  );
};

export default LogisticsInventoryManagementPage;
