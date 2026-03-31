import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Warehouse, AlertTriangle, PackageOpen, LayoutGrid,
  History, X, Layers, ArrowUp, ArrowDown, Search, FileDown
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const ZONE_COLORS = [
  { gradient: 'from-[#4765f9] to-[#99a8ff]', text: 'text-[#99a8ff]', bg: 'bg-[#99a8ff]/5' },
  { gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-300', bg: 'bg-emerald-500/5' },
  { gradient: 'from-violet-500 to-purple-500', text: 'text-violet-300', bg: 'bg-violet-500/5' },
  { gradient: 'from-amber-500 to-orange-500',  text: 'text-amber-300',  bg: 'bg-amber-500/5' },
  { gradient: 'from-rose-500 to-pink-500',    text: 'text-rose-300',   bg: 'bg-rose-500/5' },
];

const ModalShell = ({ children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className={cx('bg-[#111318] rounded-3xl border border-[#46484d]/20 shadow-2xl max-h-[90vh] overflow-y-auto', wide ? 'w-full max-w-2xl' : 'w-full max-w-lg')}>{children}</div>
  </div>
);

/* ─── Layout Modal ─────────────────────────────────────────────────────────── */
function WarehouseLayoutModal({ location, items, onClose }) {
  const totalStock  = items.reduce((s, i) => s + i.quantity, 0);
  const capacity    = 10000;
  const utilization = Math.min(Math.round((totalStock / capacity) * 100), 100);
  const zones       = ['A','B','C','D','E','F','G','H'];
  const itemZones   = items.map((item, i) => ({ item, zone: zones[i] || `Z${i}` }));
  const utilColor   = utilization > 85 ? 'text-red-400' : utilization > 60 ? 'text-amber-400' : 'text-emerald-400';
  const utilBar     = utilization > 85 ? 'from-red-400 to-red-600' : utilization > 60 ? 'from-amber-400 to-amber-600' : 'from-emerald-400 to-emerald-600';

  return (
    <ModalShell wide>
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20"><Layers className="w-5 h-5 text-[#99a8ff]" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">{location} — Floor Plan</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-5">
        <div className="bg-[#0c0e12] rounded-xl p-4">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-[#aaabb0]">Capacity Utilization</span>
            <span className={utilColor}>{utilization}%</span>
          </div>
          <div className="bg-[#23262c] h-3 rounded-full overflow-hidden">
            <div className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700', utilBar)} style={{ width: `${utilization}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-[#46484d] mt-1">
            <span>0 units</span>
            <span>{totalStock.toLocaleString()} / {capacity.toLocaleString()} units</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaabb0] mb-3">Storage Bays</p>
          {itemZones.length === 0 ? (
            <p className="text-center py-8 text-[#46484d] italic">No items assigned to this warehouse.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {itemZones.map(({ item, zone }, i) => {
                const color = ZONE_COLORS[i % ZONE_COLORS.length];
                const isLow = item.quantity <= item.reorderPoint;
                return (
                  <div key={item.id} className={cx('rounded-xl overflow-hidden border', isLow ? 'border-red-500/40 border-dashed' : 'border-[#46484d]/10')}>
                    <div className={cx('bg-gradient-to-r px-3 py-1.5 flex items-center justify-between text-white', color.gradient)}>
                      <span className="text-xs font-bold">Bay {zone}</span>
                      {isLow && <span className="text-[10px] bg-white/20 px-1.5 rounded font-bold">LOW</span>}
                    </div>
                    <div className={cx('p-3', color.bg)}>
                      <p className={cx('font-bold text-sm truncate', color.text)}>{item.productName}</p>
                      <p className="text-[10px] text-[#aaabb0] mt-1">Stock: <span className="font-mono font-bold">{item.quantity}</span></p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c]">Close</button>
          <button onClick={() => { toast.info('Warehouse report exported!'); onClose(); }} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] flex items-center justify-center gap-2">
            <FileDown className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ─── Logs Modal ───────────────────────────────────────────────────────────── */
function WarehouseLogsModal({ location, items, onClose }) {
  const logs = items.flatMap((item, i) => [
    { time: new Date(Date.now() - (i * 3 + 1) * 3600000).toLocaleString(), action: 'Dispatched', qty: `-${Math.floor(item.quantity * 0.1)}`, item: item.productName, by: 'driver_raj' },
    { time: new Date(Date.now() - (i * 3 + 5) * 3600000).toLocaleString(), action: 'Restocked',  qty: `+${Math.floor(item.quantity * 0.2)}`, item: item.productName, by: 'warehouse_manager' },
  ]).sort(() => Math.random() - 0.5).slice(0, 10);

  return (
    <ModalShell>
      <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/10 rounded-xl border border-violet-500/20"><History className="w-5 h-5 text-violet-300" /></div>
          <h3 className="font-bold text-[#f6f6fc] text-lg">{location} — Activity Logs</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:bg-[#23262c] transition-all"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-center py-8 text-[#46484d] italic">No activity logs available.</p>
        ) : logs.map((log, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-[#0c0e12] rounded-xl hover:bg-[#171a1f] transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', log.action === 'Dispatched' ? 'text-red-300 bg-red-500/10 border-red-500/20' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20')}>{log.action}</span>
                <span className="truncate text-[#aaabb0] text-xs">{log.item}</span>
              </div>
              <p className="text-[10px] text-[#46484d] mt-0.5">{log.time} · by {log.by}</p>
            </div>
            <span className={cx('font-bold font-mono ml-3 shrink-0 text-sm flex items-center gap-1', log.qty.startsWith('+') ? 'text-emerald-400' : 'text-red-400')}>
              {log.qty.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {log.qty}
            </span>
          </div>
        ))}
      </div>
      <div className="p-6 pt-0">
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c]">Close</button>
      </div>
    </ModalShell>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsWarehouseManagementPage = () => {
  const { user, sector } = useAuth();
  const [inventory, setInventory]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [layoutModal, setLayoutModal] = useState(null);
  const [logsModal, setLogsModal]     = useState(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res  = await api.get('/logistics/inventory');
      const data = res.data?.data ?? res.data;
      setInventory(data?.content ?? (Array.isArray(data) ? data : []));
    } catch { toast.error('Failed to load warehouse data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user && sector?.code?.toLowerCase() === 'logistics') fetchInventory(); }, [user, sector]);

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

  const warehouses = [...new Set(inventory.map(i => i.warehouseLocation || 'Unassigned'))];
  const getWarehouseStats = (loc) => {
    const items      = inventory.filter(i => (i.warehouseLocation || 'Unassigned') === loc);
    const totalStock = items.reduce((s, i) => s + i.quantity, 0);
    const capacity   = 10000;
    return {
      items, count: items.length, stock: totalStock,
      utilization: Math.min(Math.round((totalStock / capacity) * 100), 100),
      lowStock: items.filter(i => i.quantity <= i.reorderPoint).length,
    };
  };
  const filteredWarehouses = warehouses.filter(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));

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
              <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Warehouse Hub</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-2">Warehouse Hub</h1>
            <p className="text-[#aaabb0] max-w-lg">Global site management, inventory distribution, and capacity monitoring.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#46484d]" />
            <input type="text" placeholder="Search warehouse..." className="w-full bg-[#111318] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none border border-[#46484d]/20"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Summary bar */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Warehouses',  value: warehouses.length,                                                    color: 'text-[#99a8ff]', Icon: Warehouse },
              { label: 'Total SKUs',        value: inventory.length,                                                     color: 'text-emerald-400', Icon: PackageOpen },
              { label: 'Low Stock Alerts',  value: inventory.filter(i => i.quantity <= i.reorderPoint).length,          color: 'text-red-400',    Icon: AlertTriangle },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-5 flex items-center gap-4">
                <div className="p-2.5 rounded-xl border bg-[#23262c] border-[#46484d]/20 shrink-0"><Icon className={cx('w-5 h-5', color)} /></div>
                <div>
                  <p className={cx('text-2xl font-extrabold', color)}>{value}</p>
                  <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Warehouse Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 text-center">
              <div className="flex justify-center mb-4"><div className="w-10 h-10 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" /></div>
              <p className="text-[#46484d] italic text-sm">Scanning warehouse sensors…</p>
            </div>
          ) : filteredWarehouses.length === 0 ? (
            <div className="col-span-full bg-[#111318] rounded-3xl border border-[#46484d]/10 p-20 text-center text-[#46484d] italic">No warehouse locations found.</div>
          ) : filteredWarehouses.map((loc, idx) => {
            const stats    = getWarehouseStats(loc);
            const color    = ZONE_COLORS[idx % ZONE_COLORS.length];
            const barColor = stats.utilization > 85 ? 'from-red-400 to-red-600' : stats.utilization > 60 ? 'from-amber-400 to-amber-600' : 'from-emerald-400 to-emerald-600';
            const uColor   = stats.utilization > 85 ? 'text-red-400' : stats.utilization > 60 ? 'text-amber-400' : 'text-emerald-400';
            return (
              <div key={idx} className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden hover:border-[#46484d]/30 hover:shadow-xl transition-all">
                <div className={cx('bg-gradient-to-r p-5 text-white', color.gradient)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-extrabold text-xl">{loc}</h2>
                      <p className="text-white/70 text-sm mt-0.5">{stats.count} SKU{stats.count !== 1 ? 's' : ''} stored</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl"><LayoutGrid className="w-5 h-5" /></div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#aaabb0] mb-1">SKU Count</p>
                      <p className={cx('text-2xl font-bold flex items-center gap-1.5', color.text)}><PackageOpen className="w-4 h-4" />{stats.count}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#aaabb0] mb-1">Total Stock</p>
                      <p className="text-2xl font-bold text-[#f6f6fc]">{stats.stock.toLocaleString()}</p>
                    </div>
                  </div>
                  {stats.lowStock > 0 && (
                    <div className="flex items-center gap-2 p-3 rounded-xl border bg-amber-500/5 border-amber-500/20 text-amber-300 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {stats.lowStock} item{stats.lowStock > 1 ? 's' : ''} below reorder threshold
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-[#aaabb0]">Capacity Utilization</span>
                      <span className={uColor}>{stats.utilization}%</span>
                    </div>
                    <div className="bg-[#0c0e12] h-2 rounded-full overflow-hidden">
                      <div className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700', barColor)} style={{ width: `${stats.utilization}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setLogsModal({ location: loc, items: stats.items })} className="flex-1 py-2 rounded-xl text-xs font-bold text-[#aaabb0] bg-[#0c0e12] hover:text-[#f6f6fc] transition-all flex items-center justify-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Logs
                    </button>
                    <button onClick={() => setLayoutModal({ location: loc, items: stats.items })} className={cx('flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r flex items-center justify-center gap-1.5', color.gradient)}>
                      <Layers className="w-3.5 h-3.5" /> View Layout
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {layoutModal && <WarehouseLayoutModal location={layoutModal.location} items={layoutModal.items} onClose={() => setLayoutModal(null)} />}
      {logsModal   && <WarehouseLogsModal   location={logsModal.location}  items={logsModal.items}  onClose={() => setLogsModal(null)} />}
    </div>
  );
};

export default LogisticsWarehouseManagementPage;
