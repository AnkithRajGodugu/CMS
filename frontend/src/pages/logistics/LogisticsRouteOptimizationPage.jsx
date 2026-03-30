import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import {
  FaRoute, FaPlus, FaMapMarkedAlt, FaClock, FaExclamationTriangle,
  FaRoad, FaTimes, FaChartLine, FaLocationArrow, FaCheck
} from 'react-icons/fa';
import { toast } from 'sonner';

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

/* ── City lat/lng lookup (India) ─────────────────────────────────────────── */
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
  Kochi:               [9.9312,   76.2673],
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
  // fuzzy match on first word
  const first = name.split(' ')[0];
  return CITY_LATLNG[first] || null;
}

/* ── Custom colored markers ──────────────────────────────────────────────── */
function makeMarkerIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

/* ── Leaflet Map Component ───────────────────────────────────────────────── */
function LeafletMap({ routes, selectedRoute, onRouteClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef([]);

  // Initialise map once
  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // India center
      zoom: 5,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);
    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, []);

  // Draw/redraw routes whenever they change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers
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
      const lineWeight = isSelected ? 5 : 3;

      // Polyline
      const line = L.polyline([fromLL, toLL], {
        color: lineColor,
        weight: lineWeight,
        opacity: isSelected ? 1 : 0.75,
        dashArray: isOpt ? null : '8, 6',
      })
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:160px">
            <b>${route.startLocation} → ${route.endLocation}</b><br/>
            <span style="color:#6b7280;font-size:12px">
              📏 ${route.distanceKm} km &nbsp; ⏱ ${route.estimatedTimeMinutes} min
            </span><br/>
            <span style="
              display:inline-block;margin-top:4px;padding:2px 8px;
              background:${isOpt ? '#d1fae5' : '#fef3c7'};
              color:${isOpt ? '#065f46' : '#92400e'};
              border-radius:99px;font-size:11px;font-weight:bold
            ">${route.status}</span>
          </div>
        `)
        .on('click', () => onRouteClick(route));

      line.addTo(map);
      layersRef.current.push(line);
      bounds.push(fromLL, toLL);

      // Start marker (green)
      const startM = L.marker(fromLL, { icon: makeMarkerIcon(isOpt ? '#10b981' : '#f59e0b') })
        .bindTooltip(route.startLocation, { permanent: false, direction: 'top' });
      startM.addTo(map);
      layersRef.current.push(startM);

      // End marker (blue/red)
      const endM = L.marker(toLL, { icon: makeMarkerIcon(isSelected ? '#f59e0b' : '#3b82f6') })
        .bindTooltip(route.endLocation, { permanent: false, direction: 'top' });
      endM.addTo(map);
      layersRef.current.push(endM);
    });

    // Fit map to show all routes
    if (bounds.length > 0) {
      try { map.fitBounds(bounds, { padding: [40, 40] }); } catch {}
    }
  }, [routes, selectedRoute]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    />
  );
}

/* ── Route Detail Side Panel ─────────────────────────────────────────────── */
function RouteDetailPanel({ route, onClose, onOptimize }) {
  if (!route) return null;
  const speedKmh = route.estimatedTimeMinutes > 0
    ? Math.round((route.distanceKm / route.estimatedTimeMinutes) * 60)
    : '—';
  const efficiency = route.status === 'OPTIMIZED' ? 92 : 54;

  return (
    <div className="absolute top-4 right-4 z-[999] w-72 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden animate-in slide-in-from-right">
      {/* Header */}
      <div className={`p-4 text-white ${route.status === 'OPTIMIZED' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <FaMapMarkedAlt className="flex-shrink-0"/>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{route.startLocation}</div>
              <div className="text-white/60 text-xs">↓</div>
              <div className="font-bold text-sm truncate">{route.endLocation}</div>
            </div>
          </div>
          <button className="btn btn-circle btn-xs btn-ghost text-white flex-shrink-0" onClick={onClose}>
            <FaTimes/>
          </button>
        </div>
        <div className="mt-2">
          <span className={`badge badge-sm font-bold ${route.status === 'OPTIMIZED' ? 'bg-white/20 text-white border-white/30' : 'bg-white/20 text-white border-white/30'}`}>
            {route.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Distance', value: `${route.distanceKm} km`, color: 'text-amber-500' },
            { label: 'Time', value: `${route.estimatedTimeMinutes}m`, color: 'text-blue-500' },
            { label: 'Avg Speed', value: `${speedKmh} km/h`, color: 'text-emerald-500' },
          ].map(s => (
            <div key={s.label} className="bg-base-200 rounded-xl py-2 px-1">
              <div className={`font-bold text-sm ${s.color}`}>{s.value}</div>
              <div className="text-xs opacity-40 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Efficiency */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="opacity-50">Route Efficiency</span>
            <span>{efficiency}%</span>
          </div>
          <div className="bg-base-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${route.status === 'OPTIMIZED' ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${efficiency}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {route.status !== 'OPTIMIZED' && (
          <button
            className="btn btn-warning text-white w-full gap-2 btn-sm"
            onClick={() => onOptimize(route.id)}
          >
            <FaChartLine className="text-xs"/> Mark as Optimized
          </button>
        )}
        {route.status === 'OPTIMIZED' && (
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold bg-emerald-50 rounded-xl p-2.5">
            <FaCheck/> Route is fully optimized
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
const LogisticsRouteOptimizationPage = () => {
  const { user, sector } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [newRoute, setNewRoute] = useState({
    startLocation: '', endLocation: '', distanceKm: 0, estimatedTimeMinutes: 0, status: 'PENDING'
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/routes');
      const data = res.data?.data ?? res.data;
      setRoutes(data?.content ?? (Array.isArray(data) ? data : []));
    } catch {
      toast.error('Failed to load route data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchRoutes();
  }, [user, sector]);

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
    try {
      await api.put(`/logistics/routes/${routeId}`, { status: 'OPTIMIZED' });
    } catch {}
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, status: 'OPTIMIZED' } : r));
    setSelectedRoute(prev => prev?.id === routeId ? { ...prev, status: 'OPTIMIZED' } : prev);
    toast.success('Route marked as optimized!');
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

  const filteredRoutes = routes.filter(r => {
    if (filter === 'OPTIMIZED') return r.status === 'OPTIMIZED';
    if (filter === 'PENDING') return r.status !== 'OPTIMIZED';
    return true;
  });

  const optimizedCount = routes.filter(r => r.status === 'OPTIMIZED').length;
  const pendingCount   = routes.filter(r => r.status !== 'OPTIMIZED').length;
  const avgDist        = routes.length > 0
    ? Math.round(routes.reduce((s, r) => s + (r.distanceKm || 0), 0) / routes.length)
    : 0;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <FaRoute className="text-amber-500"/> Route Optimization
          </h1>
          <p className="text-base-content/60 mt-1 text-sm">
            Live route network on OpenStreetMap · Click a route to inspect it
          </p>
        </div>
        <button className="btn btn-warning gap-2 text-white shadow-lg" onClick={() => setIsModalOpen(true)}>
          <FaPlus/> New Route
        </button>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Routes',   value: routes.length,   color: 'text-base-content', border: 'border-base-300' },
          { label: 'Optimized',      value: optimizedCount,  color: 'text-emerald-500',  border: 'border-emerald-400' },
          { label: 'Pending',        value: pendingCount,    color: 'text-amber-500',    border: 'border-amber-400' },
          { label: 'Avg Distance',   value: `${avgDist} km`, color: 'text-blue-500',     border: 'border-blue-400' },
        ].map(k => (
          <div key={k.label} className={`card bg-base-100 shadow border-l-4 ${k.border}`}>
            <div className="card-body py-3 px-5">
              <p className="text-xs uppercase opacity-40 font-bold">{k.label}</p>
              <p className={`text-2xl font-extrabold ${k.color}`}>{loading ? '—' : k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main layout: Map (left) + Route List (right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Map — takes 2/3 */}
        <div className="lg:col-span-2 card bg-base-100 shadow-xl overflow-hidden" style={{ minHeight: '520px' }}>
          <div className="p-3 border-b border-base-200 flex items-center gap-2 text-sm font-semibold opacity-60">
            <FaLocationArrow className="text-amber-500"/> Live Route Network
            <span className="ml-auto text-xs font-normal opacity-60">Powered by OpenStreetMap</span>
          </div>
          <div className="relative" style={{ height: '480px' }}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-base-200/60">
                <span className="loading loading-spinner loading-lg text-warning"/>
              </div>
            ) : (
              <LeafletMap
                routes={filteredRoutes}
                selectedRoute={selectedRoute}
                onRouteClick={r => setSelectedRoute(r.id === selectedRoute?.id ? null : r)}
              />
            )}
            {/* Route detail overlay */}
            {selectedRoute && (
              <RouteDetailPanel
                route={selectedRoute}
                onClose={() => setSelectedRoute(null)}
                onOptimize={handleOptimize}
              />
            )}
          </div>
        </div>

        {/* Route list — takes 1/3 */}
        <div className="space-y-3">
          {/* Filter tabs */}
          <div className="tabs tabs-boxed bg-base-100 shadow w-full">
            {['ALL', 'OPTIMIZED', 'PENDING'].map(f => (
              <button
                key={f}
                className={`tab flex-1 ${filter === f ? 'tab-active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? 'All' : f === 'OPTIMIZED' ? '✓ Done' : '⏳ Pending'}
              </button>
            ))}
          </div>

          {/* Scrollable route cards */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '460px' }}>
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-md text-warning"/>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="card bg-base-100 shadow p-8 text-center opacity-40 italic text-sm">
                No routes found. Create one!
              </div>
            ) : filteredRoutes.map(route => {
              const isSelected = selectedRoute?.id === route.id;
              const isOpt = route.status === 'OPTIMIZED';
              return (
                <div
                  key={route.id}
                  className={`card bg-base-100 shadow cursor-pointer border-l-4 transition-all hover:shadow-md
                    ${isSelected
                      ? 'border-amber-400 shadow-amber-100 scale-[1.01]'
                      : isOpt ? 'border-emerald-400' : 'border-base-300'
                    }`}
                  onClick={() => setSelectedRoute(isSelected ? null : route)}
                >
                  <div className="card-body p-4 gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${isOpt ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          <FaMapMarkedAlt className="text-xs"/>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{route.startLocation}</div>
                          <div className="text-xs opacity-30">↓</div>
                          <div className="font-bold text-sm truncate">{route.endLocation}</div>
                        </div>
                      </div>
                      <span className={`badge badge-sm font-bold flex-shrink-0 ${isOpt ? 'badge-success' : 'badge-warning'}`}>
                        {isOpt ? '✓' : '⏳'} {route.status}
                      </span>
                    </div>
                    <div className="flex gap-3 text-xs opacity-50 pt-1 border-t border-base-200">
                      <span className="flex items-center gap-1"><FaRoad/> {route.distanceKm} km</span>
                      <span className="flex items-center gap-1"><FaClock/> {route.estimatedTimeMinutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Traffic Insights */}
          <div className="card bg-base-100 shadow border border-amber-200">
            <div className="card-body p-4">
              <h2 className="text-xs font-bold uppercase opacity-50 mb-3 tracking-wider">Traffic Insights</h2>
              <div className="space-y-2 text-sm">
                {[
                  { dot: 'bg-success', text: 'NH-48 corridor 15% faster today' },
                  { dot: 'bg-warning', text: 'Construction on Bridge X-2' },
                  { dot: 'bg-info',    text: 'AI suggests 12PM departures for Node B' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`}/>
                    <span className="opacity-70">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── New Route Modal ── */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <FaRoute className="text-amber-500"/> Create New Route
              </h3>
              <button className="btn btn-circle btn-ghost btn-sm" onClick={() => setIsModalOpen(false)}>
                <FaTimes/>
              </button>
            </div>
            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Start City</span></label>
                  <input
                    type="text" className="input input-bordered" required
                    placeholder="e.g. Mumbai"
                    list="city-suggestions"
                    value={newRoute.startLocation}
                    onChange={e => setNewRoute({...newRoute, startLocation: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">End City</span></label>
                  <input
                    type="text" className="input input-bordered" required
                    placeholder="e.g. Delhi"
                    list="city-suggestions"
                    value={newRoute.endLocation}
                    onChange={e => setNewRoute({...newRoute, endLocation: e.target.value})}
                  />
                </div>
              </div>
              <datalist id="city-suggestions">
                {Object.keys(CITY_LATLNG).map(c => <option key={c} value={c}/>)}
              </datalist>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Distance (km)</span></label>
                  <input type="number" step="0.1" min="1" className="input input-bordered" required
                    value={newRoute.distanceKm}
                    onChange={e => setNewRoute({...newRoute, distanceKm: parseFloat(e.target.value)})}/>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-semibold">Est. Time (min)</span></label>
                  <input type="number" min="1" className="input input-bordered" required
                    value={newRoute.estimatedTimeMinutes}
                    onChange={e => setNewRoute({...newRoute, estimatedTimeMinutes: parseInt(e.target.value)})}/>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-warning text-white px-8">Create Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsRouteOptimizationPage;
