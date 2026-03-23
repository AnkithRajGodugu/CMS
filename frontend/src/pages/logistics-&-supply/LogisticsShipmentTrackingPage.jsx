import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaShippingFast, FaMapMarkerAlt, FaClock, FaCheckCircle, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { toast } from 'sonner';

const LogisticsShipmentTrackingPage = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    trackingId: '',
    origin: '',
    destination: '',
    status: 'PENDING',
    weight: 1.0,
    estimatedDelivery: ''
  });

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/shipments');
      if (response.data && response.data.success) {
        setShipments(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch shipments', err);
      toast.error('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'logistics') {
      fetchShipments();
    }
  }, [user]);

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/logistics/shipments', newShipment);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Shipment created successfully');
        setIsModalOpen(false);
        setNewShipment({
          trackingId: '',
          origin: '',
          destination: '',
          status: 'PENDING',
          weight: 1.0,
          estimatedDelivery: ''
        });
        fetchShipments();
      }
    } catch (err) {
      console.error('Failed to create shipment', err);
    }
  };

  const filteredShipments = shipments.filter(s => 
    s.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'IN_TRANSIT': return 'badge-info';
      case 'PENDING': return 'badge-warning';
      case 'DELAYED': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <Header />
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to track shipments.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FaShippingFast className="text-info" />
                Shipment Tracking
              </h1>
              <p className="text-base-content/70 mt-1">Real-time global logistics monitoring and tracking management.</p>
            </div>
            <button 
              className="btn btn-info gap-2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="text-sm" /> Create Shipment
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stats shadow bg-base-100 border-l-4 border-info">
              <div className="stat">
                <div className="stat-title">Total Active</div>
                <div className="stat-value text-info">{shipments.length}</div>
                <div className="stat-desc">across all zones</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100 border-l-4 border-success">
              <div className="stat">
                <div className="stat-title">Delivered</div>
                <div className="stat-value text-success">{shipments.filter(s => s.status === 'DELIVERED').length}</div>
                <div className="stat-desc">this week</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100 border-l-4 border-warning">
              <div className="stat">
                <div className="stat-title">In Transit</div>
                <div className="stat-value text-warning">{shipments.filter(s => s.status === 'IN_TRANSIT').length}</div>
                <div className="stat-desc">moving currently</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100 border-l-4 border-error">
              <div className="stat">
                <div className="stat-title">Delayed</div>
                <div className="stat-value text-error">{shipments.filter(s => s.status === 'DELAYED').length}</div>
                <div className="stat-desc">requires attention</div>
              </div>
            </div>
          </div>

          {/* Shipment Table */}
          <div className="card bg-base-100 shadow-xl">
             <div className="p-6 bg-base-100/50 flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full max-w-md">
                   <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                   <input 
                     type="text" 
                     placeholder="Search by ID or destination..." 
                     className="input input-bordered w-full pl-10" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <div className="tabs tabs-boxed">
                  <a className="tab tab-active">All</a>
                  <a className="tab">Active</a>
                  <a className="tab">Completed</a>
                </div>
             </div>

             <div className="overflow-x-auto">
               <table className="table table-lg w-full">
                 <thead>
                   <tr>
                     <th>Tracking ID</th>
                     <th>Route/Nodes</th>
                     <th>Status</th>
                     <th>Weight</th>
                     <th>ETA</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {loading ? (
                     <tr><td colSpan="6" className="text-center py-20"><span className="loading loading-spinner loading-lg text-info"></span></td></tr>
                   ) : filteredShipments.length === 0 ? (
                     <tr><td colSpan="6" className="text-center py-20 text-base-content/50 italic">No shipments found.</td></tr>
                   ) : (
                    filteredShipments.map(s => (
                      <tr key={s.id} className="hover:bg-base-200/50 transition-colors">
                        <td>
                           <div className="font-mono font-bold text-info">#{s.trackingId || 'N/A'}</div>
                           <div className="text-xs opacity-50">S-SYS-{s.id}</div>
                        </td>
                        <td>
                           <div className="flex items-center gap-2">
                             <div className="flex flex-col">
                               <span className="text-xs uppercase opacity-40">From</span>
                               <span className="text-sm font-semibold">{s.origin}</span>
                             </div>
                             <div className="px-2 text-base-content/30">→</div>
                             <div className="flex flex-col">
                               <span className="text-xs uppercase opacity-40">To</span>
                               <span className="text-sm font-semibold">{s.destination}</span>
                             </div>
                           </div>
                        </td>
                        <td>
                          <div className={`badge ${getStatusBadge(s.status)} p-3 font-bold gap-2`}>
                            {s.status === 'DELIVERED' && <FaCheckCircle className="text-xs" />}
                            {s.status === 'DELAYED' && <FaExclamationTriangle className="text-xs" />}
                            {s.status}
                          </div>
                        </td>
                        <td>
                           <span className="badge badge-outline">{s.weight} kg</span>
                        </td>
                        <td>
                           <div className="flex items-center gap-2 text-sm">
                             <FaClock className="text-base-content/40" />
                             {s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : 'TBD'}
                           </div>
                        </td>
                        <td>
                           <button className="btn btn-ghost btn-circle btn-sm">
                             <FaMapMarkerAlt className="text-info" />
                           </button>
                        </td>
                      </tr>
                    ))
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </main>

      {/* Add Shipment Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
              <FaShippingFast className="text-info" /> Initialize New Shipment
            </h3>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Tracking ID</label>
                  <input type="text" className="input input-bordered" required
                    value={newShipment.trackingId} onChange={e => setNewShipment({...newShipment, trackingId: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Weight (kg)</label>
                  <input type="number" step="0.1" className="input input-bordered" required
                    value={newShipment.weight} onChange={e => setNewShipment({...newShipment, weight: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Origin City</label>
                  <input type="text" className="input input-bordered" required
                    value={newShipment.origin} onChange={e => setNewShipment({...newShipment, origin: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Destination City</label>
                  <input type="text" className="input input-bordered" required
                    value={newShipment.destination} onChange={e => setNewShipment({...newShipment, destination: e.target.value})} />
                </div>
              </div>
              <div className="form-control">
                <label className="label">Estimated Delivery Date</label>
                <input type="date" className="input input-bordered" required
                  value={newShipment.estimatedDelivery} onChange={e => setNewShipment({...newShipment, estimatedDelivery: e.target.value})} />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-info text-white">Confirm Logistics</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default LogisticsShipmentTrackingPage;
