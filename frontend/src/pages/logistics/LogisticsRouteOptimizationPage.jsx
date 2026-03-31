import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Route, Plus, Map, Clock, AlertTriangle,
  X, TrendingUp, Navigation, Check
} from 'lucide-react';

// Leaflet CSS must be loaded
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icons (broken with bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls  = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all shadow-sm";
const labelCls  = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

/* ── City lat/lng lookup (India) ──────────────────────────────────────────── */
const CITY_LATLNG = {
  Mumbai:              [19.0760,  72.8777],
  Delhi:               [28.6139,  77.2090],
  Bangalore:           [12.9716,  77.5946],
  Bengaluru:           [12.9716,  77.5946],
  Chennai:             [13.0827,  80.2707],
  Hyderabad:           [17.3850,  78.4867],
  Ahmedabad:           [23.0225,  72.5714],
  Kolkata:             [22.5726,  88.3639],
  Pune:                [18.5204,  73.8567],
  Jaipur:              [26.9124,  75.7873],
  Surat:               [21.1702,  72.8311],
  Lucknow:             [26.8467,  80.9462],
  Nagpur:              [21.1458,  79.0882],
  Bhopal:              [23.2599,  77.4126],
  Chandigarh:          [30.7333,  76.7794],
  Kochi:               [ 9.9312,  76.2673],
  Coimbatore:          [11.0168,  76.9558],
  Visakhapatnam:       [17.6868,  83.2185],
  Patna:               [25.5941,  85.1376],
  Guwahati:            [26.1445,  91.7362],
  'Mumbai Central Hub':    [19.0760, 72.8777],
  'Pune Distribution':     [18.5204, 73.8567],
  'Delhi NCR Warehouse':   [28.6139, 77.2090],
  'Jaipur Logistics Park': [26.9124, 75.7873],
  'Bangalore East Hub':    [12.9716, 77.5946],
};

function cityLatLng(name) {
  if (!name) return null;
  if (CITY_LATLNG[name]) return CITY_LATLNG[name];
  const first = name.split(' ')[0];
  return CITY_LATLNG[first] || null;
}

function makeMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;background:${color};border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/* ── Leaflet Map ──────────────────────────────────────────────────────────── */
function LeafletMap({ routes, selectedRoute, onRouteClick }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef      = useRef([]);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { center: [20.5937, 78.9629], zoom: 5, zoomControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    layersRef.current.forEach(l => map.removeLayer(l));
    layersRef.current = [];
    const bounds = [];

    routes.forEach(route => {
      const fromLL = cityLatLng(route.startLocation);
      const toLL   = cityLatLng(route.endLocation);
      if (!fromLL || !toLL) return;

      const isSelected = selectedRoute?.id === route.id;
      const isOpt      = route.status === 'OPTIMIZED';
      const lineColor  = isSelected ? '#f59e0b' : isOpt ? '#10b981' : '#6b7280';

      const line = L.polyline([fromLL, toLL], {
        color: lineColor, weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.75, dashArray: isOpt ? null : '8, 6',
      })
        .bindPopup(`<div style="font-family:sans-serif;min-width:160px"><b>${route.startLocation} → ${route.endLocation}</b><br/><span style="color:#6b7280;font-size:12px">📏 ${route.distanceKm} km &nbsp; ⏱ ${route.estimatedTimeMinutes} min</span></div>`)
        .on('click', () => onRouteClick(route));

      line.addTo(map);
      layersRef.current.push(line);
      bounds.push(fromLL, toLL);

      const startM = L.marker(fromLL, { icon: makeMarkerIcon(isOpt ? '#10b981' : '#f59e0b') }).bindTooltip(route.startLocation, { permanent: false, direction: 'top' });
      const endM   = L.marker(toLL,   { icon: makeMarkerIcon(isSelected ? '#f59e0b' : '#3b82f6') }).bindTooltip(route.endLocation, { permanent: false, direction: 'top' });
      startM.addTo(map); layersRef.current.push(startM);
      endM.addTo(map);   layersRef.current.push(endM);
    });

    if (bounds.length > 0) { try { map.fitBounds(bounds, { padding: [40, 40] }); } catch {} }
  }, [routes, selectedRoute]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '0.75rem', zIndex: 0 }} />;
}

/* ── Route Detail Overlay ─────────────────────────────────────────────────── */
function RouteDetailPanel({ route, onClose, onOptimize }) {
  if (!route) return null;
  const speedKmh   = route.estimatedTimeMinutes > 0 ? Math.round((route.distanceKm / route.estimatedTimeMinutes) * 60) : '—';
  const efficiency = route.status === 'OPTIMIZED' ? 92 : 54;
  const isOpt      = route.status === 'OPTIMIZED';

  return (
    <div className="absolute top-4 right-4 z-[999] w-72 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
      <div className={cx('p-4 text-white', isOpt ? 'bg-gradient-to-r from-emerald-600/70 to-teal-700/70' : 'bg-gradient-to-r from-amber-600/70 to-orange-700/70')}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Map className="w-4 h-4 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{route.startLocation}</p>
              <p className="text-white/40 text-xs">↓</p>
              <p className="font-bold text-sm truncate">{route.endLocation}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <span className={cx('mt-2 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border', isOpt ? 'border-emerald-400/30 text-emerald-200 bg-emerald-400/10' : 'border-amber-400/30 text-amber-200 bg-amber-400/10')}>
          {route.status}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
          {[
            { label: 'Distance', value: `${route.distanceKm} km`,  color: 'text-amber-600' },
            { label: 'Time',     value: `${route.estimatedTimeMinutes}m`, color: 'text-sky-600' },
            { label: 'Avg Spd', value: `${speedKmh}km/h`,          color: 'text-emerald-600' },
          ].map(s => (
            <div key={s.label} className="bg-transparent rounded-xl py-2 px-1">
              <p className={cx('font-bold text-xs', s.color)}>{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-gray-500">Route Efficiency</span>
            <span className="text-[#1F2937]">{efficiency}%</span>
          </div>
          <div className="bg-transparent h-2 rounded-full overflow-hidden">
            <div className={cx('h-full rounded-full transition-all duration-700', isOpt ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-amber-400 to-amber-600')} style={{ width: `${efficiency}%` }} />
          </div>
        </div>
        {!isOpt ? (
          <button onClick={() => onOptimize(route.id)} className="w-full py-2.5 rounded-xl text-xs font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" /> Mark as Optimized
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5">
            <Check className="w-3.5 h-3.5" /> Route is fully optimized
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────────────────── */
const LogisticsRouteOptimizationPage = () => {
  const { user, sector } = useAuth();
  const [routes, setRoutes]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filter, setFilter]             = useState('ALL');
  const [newRoute, setNewRoute]         = useState({ startLocation: '', endLocation: '', distanceKm: 0, estimatedTimeMinutes: 0, status: 'PENDING' });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res  = await api.get('/logistics/routes');
      const data = res.data?.data ?? res.data;
      setRoutes(data?.content ?? (Array.isArray(data) ? data : []));
    } catch { toast.error('Failed to load route data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user && sector?.code?.toLowerCase() === 'logistics') fetchRoutes(); }, [user, sector]);

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      await api.post('/logistics/routes', newRoute);
      toast.success('Route created!');
      setIsModalOpen(false);
      setNewRoute({ startLocation: '', endLocation: '', distanceKm: 0, estimatedTimeMinutes: 0, status: 'PENDING' });
      fetchRoutes();
    } catch { toast.error('Failed to create route'); }
  };

  const handleOptimize = async (routeId) => {
    try { await api.put(`/logistics/routes/${routeId}`, { status: 'OPTIMIZED' }); } catch {}
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, status: 'OPTIMIZED' } : r));
    setSelectedRoute(prev => prev?.id === routeId ? { ...prev, status: 'OPTIMIZED' } : prev);
    toast.success('Route marked as optimized!');
  };

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

  const filteredRoutes  = routes.filter(r => filter === 'OPTIMIZED' ? r.status === 'OPTIMIZED' : filter === 'PENDING' ? r.status !== 'OPTIMIZED' : true);
  const optimizedCount  = routes.filter(r => r.status === 'OPTIMIZED').length;
  const pendingCount    = routes.filter(r => r.status !== 'OPTIMIZED').length;
  const avgDist         = routes.length > 0 ? Math.round(routes.reduce((s, r) => s + (r.distanceKm || 0), 0) / routes.length) : 0;

  return (
    <div className="min-h-screen bg-transparent text-[#1F2937] font-sans p-8">
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Logistics</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600">Route Optimization</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-2">Route Optimization</h1>
            <p className="text-gray-500">Live route network on OpenStreetMap · Click a route to inspect it.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Route
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Routes',  value: routes.length,   Icon: Route,       color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Optimized',     value: optimizedCount,  Icon: Check,       color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { label: 'Pending',       value: pendingCount,    Icon: Clock,       color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Avg Distance',  value: `${avgDist} km`, Icon: Navigation,  color: 'text-sky-700 bg-sky-50 border-sky-200' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border shrink-0', color.split(' ').slice(1).join(' '))}><Icon className={cx('w-5 h-5', color.split(' ')[0])} /></div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{loading ? '—' : value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '520px' }}>
            <div className="px-5 py-3.5 border-b border-gray-100 flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-gray-500">
              <Navigation className="w-4 h-4 text-amber-600" /> Live Route Network
              <span className="ml-auto text-xs text-gray-400">Powered by OpenStreetMap</span>
            </div>
            <div className="relative flex-1" style={{ minHeight: '480px' }}>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-transparent/60">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" />
                </div>
              ) : (
                <LeafletMap routes={filteredRoutes} selectedRoute={selectedRoute} onRouteClick={r => setSelectedRoute(r.id === selectedRoute?.id ? null : r)} />
              )}
              {selectedRoute && <RouteDetailPanel route={selectedRoute} onClose={() => setSelectedRoute(null)} onOptimize={handleOptimize} />}
            </div>
          </div>

          {/* Route list */}
          <div className="space-y-4">
            <div className="flex bg-white rounded-xl p-1 border border-gray-100">
              {['ALL', 'OPTIMIZED', 'PENDING'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={cx('flex-1 py-2 rounded-lg text-xs font-bold transition-all', filter === f ? 'bg-amber-400 text-[#000]' : 'text-gray-500 hover:text-[#1F2937]')}>
                  {f === 'ALL' ? 'All' : f === 'OPTIMIZED' ? '✓ Done' : '⏳ Pending'}
                </button>
              ))}
            </div>

            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '430px' }}>
              {loading ? (
                <div className="flex justify-center py-8"><div className="w-7 h-7 rounded-full border-2 border-amber-200 border-t-amber-500 animate-spin" /></div>
              ) : filteredRoutes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center text-gray-400 italic text-sm">No routes found. Create one!</div>
              ) : filteredRoutes.map(route => {
                const isSelected = selectedRoute?.id === route.id;
                const isOpt      = route.status === 'OPTIMIZED';
                return (
                  <button key={route.id} onClick={() => setSelectedRoute(isSelected ? null : route)}
                    className={cx('w-full text-left bg-white rounded-2xl border border-l-4 p-4 transition-all hover:border-gray-300',
                      isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.01]' : isOpt ? 'border-emerald-500' : 'border-gray-100')}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cx('p-1.5 rounded-lg shrink-0', isOpt ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600')}>
                          <Map className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-[#1F2937] truncate">{route.startLocation}</p>
                          <p className="text-gray-400 text-xs">↓</p>
                          <p className="font-bold text-sm text-[#1F2937] truncate">{route.endLocation}</p>
                        </div>
                      </div>
                      <span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0', isOpt ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200')}>
                        {isOpt ? '✓' : '⏳'} {route.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>{route.distanceKm} km</span>
                      <span>{route.estimatedTimeMinutes} min</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Traffic Insights */}
            <div className="bg-white rounded-2xl border border-amber-500/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-3">Traffic Insights</p>
              <div className="space-y-2">
                {[
                  { dot: 'bg-emerald-400', text: 'NH-48 corridor 15% faster today' },
                  { dot: 'bg-amber-400',   text: 'Construction on Bridge X-2' },
                  { dot: 'bg-sky-400',     text: 'AI suggests 12PM departures for Node B' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-500">
                    <div className={cx('w-2 h-2 rounded-full shrink-0', item.dot)} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200"><Route className="w-5 h-5 text-amber-600" /></div>
                <h3 className="font-bold text-[#1F2937] text-lg">Create New Route</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateRoute} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Start City</label>
                  <input type="text" required placeholder="e.g. Mumbai" list="city-suggestions" className={inputCls}
                    value={newRoute.startLocation} onChange={e => setNewRoute({...newRoute, startLocation: e.target.value})} />
                </div>
                <div>
                  <label className={labelCls}>End City</label>
                  <input type="text" required placeholder="e.g. Delhi" list="city-suggestions" className={inputCls}
                    value={newRoute.endLocation} onChange={e => setNewRoute({...newRoute, endLocation: e.target.value})} />
                </div>
              </div>
              <datalist id="city-suggestions">{Object.keys(CITY_LATLNG).map(c => <option key={c} value={c}/>)}</datalist>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Distance (km)</label>
                  <input type="number" step="0.1" min="1" required className={inputCls}
                    value={newRoute.distanceKm} onChange={e => setNewRoute({...newRoute, distanceKm: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className={labelCls}>Est. Time (min)</label>
                  <input type="number" min="1" required className={inputCls}
                    value={newRoute.estimatedTimeMinutes} onChange={e => setNewRoute({...newRoute, estimatedTimeMinutes: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-amber-400 to-amber-600 hover:shadow-lg active:scale-95 transition-all">Create Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsRouteOptimizationPage;
