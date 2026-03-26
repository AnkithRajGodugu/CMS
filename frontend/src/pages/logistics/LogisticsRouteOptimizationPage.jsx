import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaRoute, FaPlus, FaMapMarkedAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaRoad } from 'react-icons/fa';
import { toast } from 'sonner';

const LogisticsRouteOptimizationPage = () => {
  const { user, sector } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    startLocation: '',
    endLocation: '',
    distanceKm: 0,
    estimatedTimeMinutes: 0,
    status: 'PENDING'
  });

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/routes');
      if (response.data && response.data.success) {
        setRoutes(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch routes', err);
      toast.error('Failed to load route data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') {
      fetchRoutes();
    }
  }, [user, sector]);

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/logistics/routes', newRoute);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Route optimized successfully');
        setIsModalOpen(false);
        setNewRoute({ startLocation: '', endLocation: '', distanceKm: 0, estimatedTimeMinutes: 0, status: 'PENDING' });
        fetchRoutes();
      }
    } catch (err) {
      console.error('Failed to optimize route', err);
    }
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to optimize routes.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FaRoute className="text-error" />
                Route Optimization
              </h1>
              <p className="text-base-content/70 mt-1">Calculate shortest paths, avoid congestion, and improve delivery windows using AI-driven logic.</p>
            </div>
            <button 
              className="btn btn-error gap-2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> New Optimization
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Active Routes List */}
            <div className="lg:col-span-2 space-y-4">
               {loading ? (
                  <div className="card bg-base-100 shadow-xl p-10 flex flex-col items-center">
                    <span className="loading loading-spinner text-error loading-lg"></span>
                    <p className="mt-4 font-bold opacity-50">Analyzing global traffic patterns...</p>
                  </div>
               ) : routes.length === 0 ? (
                  <div className="card bg-base-100 shadow-xl p-10 text-center opacity-50">
                    No optimized routes found. Start an optimization task.
                  </div>
               ) : (
                 routes.map(route => (
                   <div key={route.id} className="card bg-base-100 shadow-lg border-l-4 border-error hover:scale-[1.01] transition-transform">
                     <div className="card-body p-6 flex-row items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="p-3 bg-red-100 rounded-lg text-error">
                             <FaMapMarkedAlt className="text-2xl" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 font-bold text-lg">
                                 {route.startLocation} <span className="text-xs opacity-30 text-base-content">→</span> {route.endLocation}
                              </div>
                              <div className="flex items-center gap-4 text-xs opacity-60 mt-1">
                                 <span className="flex items-center gap-1"><FaRoad /> {route.distanceKm} km</span>
                                 <span className="flex items-center gap-1"><FaClock /> {route.estimatedTimeMinutes} min</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           <span className={`badge font-bold ${route.status === 'OPTIMIZED' ? 'badge-success' : 'badge-warning'}`}>
                             {route.status}
                           </span>
                           <button className="btn btn-ghost btn-xs text-error">View Map</button>
                        </div>
                     </div>
                   </div>
                 ))
               )}
            </div>

            {/* AI Insights Panel */}
            <div className="card bg-base-100 shadow-xl border border-error/20">
               <div className="card-body">
                  <h2 className="card-title text-error border-b pb-2 mb-4">Traffic Insights</h2>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <div className="text-sm">Main corridor (A7) is 15% faster today</div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning"></div>
                        <div className="text-sm">Construction starting on Bridge X-2</div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-info"></div>
                        <div className="text-sm">AI suggests 12:00 PM departures for Node B</div>
                     </div>
                  </div>
                  <div className="divider opacity-10"></div>
                  <div className="flex flex-col gap-2">
                     <p className="text-xs opacity-40 uppercase font-bold">Current Sector load</p>
                     <div className="bg-base-200 h-2 w-full rounded-full overflow-hidden">
                        <div className="bg-error h-full w-[65%]"></div>
                     </div>
                     <p className="text-[10px] text-right font-mono italic">High Traffic Volume (65%)</p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Optimization Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <FaRoute className="text-error" /> Start Path Optimization
            </h3>
            <form onSubmit={handleCreateRoute} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Starting Location</label>
                  <input type="text" className="input input-bordered" required
                    value={newRoute.startLocation} onChange={e => setNewRoute({...newRoute, startLocation: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Target Location</label>
                  <input type="text" className="input input-bordered" required
                    value={newRoute.endLocation} onChange={e => setNewRoute({...newRoute, endLocation: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Distance (Est. km)</label>
                  <input type="number" step="0.1" className="input input-bordered" required
                    value={newRoute.distanceKm} onChange={e => setNewRoute({...newRoute, distanceKm: parseFloat(e.target.value)})} />
                </div>
                <div className="form-control">
                  <label className="label">Time (Est. min)</label>
                  <input type="number" className="input input-bordered" required
                    value={newRoute.estimatedTimeMinutes} onChange={e => setNewRoute({...newRoute, estimatedTimeMinutes: parseInt(e.target.value)})} />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-error text-white px-8">Calculate Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsRouteOptimizationPage;
