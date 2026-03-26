import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaTruck, FaPlus, FaWrench, FaUserCircle, FaExclamationTriangle, FaCheckCircle, FaCarSide } from 'react-icons/fa';
import { toast } from 'sonner';

const LogisticsFleetManagementPage = () => {
  const { user, sector } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: '',
    model: '',
    status: 'AVAILABLE',
    capacity: 0,
    currentDriver: ''
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/vehicles');
      if (response.data && response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
      toast.error('Failed to load fleet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') {
      fetchVehicles();
    }
  }, [user, sector]);

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/logistics/vehicles', newVehicle);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Vehicle added to fleet');
        setIsModalOpen(false);
        setNewVehicle({ plateNumber: '', model: '', status: 'AVAILABLE', capacity: 0, currentDriver: '' });
        fetchVehicles();
      }
    } catch (err) {
      console.error('Failed to add vehicle', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'badge-success';
      case 'IN_USE': return 'badge-info';
      case 'MAINTENANCE': return 'badge-warning';
      case 'RETIRED': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to manage the fleet.</p>
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
                <FaTruck className="text-warning" />
                Fleet Management
              </h1>
              <p className="text-base-content/70 mt-1">Monitor vehicle status, maintenance schedules, and driver assignments.</p>
            </div>
            <button 
              className="btn btn-warning gap-2 text-warning-content"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> Add Vehicle
            </button>
          </div>

          {/* Quick Fleet Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="card bg-base-100 shadow border-b-4 border-success">
              <div className="card-body py-4 flex-row justify-between items-center">
                <div>
                  <p className="text-sm opacity-60">Available Vehicles</p>
                  <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'AVAILABLE').length}</p>
                </div>
                <FaCheckCircle className="text-3xl text-success opacity-20" />
              </div>
            </div>
            <div className="card bg-base-100 shadow border-b-4 border-info">
              <div className="card-body py-4 flex-row justify-between items-center">
                <div>
                  <p className="text-sm opacity-60">Active in Service</p>
                  <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'IN_USE').length}</p>
                </div>
                <FaCarSide className="text-3xl text-info opacity-20" />
              </div>
            </div>
            <div className="card bg-base-100 shadow border-b-4 border-warning">
              <div className="card-body py-4 flex-row justify-between items-center">
                <div>
                  <p className="text-sm opacity-60">Under Maintenance</p>
                  <p className="text-2xl font-bold">{vehicles.filter(v => v.status === 'MAINTENANCE').length}</p>
                </div>
                <FaWrench className="text-3xl text-warning opacity-20" />
              </div>
            </div>
          </div>

          {/* Fleet Table */}
          <div className="card bg-base-100 shadow-xl">
             <div className="overflow-x-auto">
               <table className="table w-full">
                 <thead>
                   <tr>
                     <th>Vehicle ID / Plate</th>
                     <th>Model</th>
                     <th>Current Status</th>
                     <th>Capacity (Tons)</th>
                     <th>Driver</th>
                     <th>Last Service</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {loading ? (
                     <tr><td colSpan="7" className="text-center py-10 font-bold">Connecting to Fleet Control...</td></tr>
                   ) : vehicles.length === 0 ? (
                     <tr><td colSpan="7" className="text-center py-10 opacity-50 italic">No vehicles registered in the fleet.</td></tr>
                   ) : (
                    vehicles.map(v => (
                       <tr key={v.id} className="hover">
                         <td>
                           <div className="font-bold text-lg font-mono">{v.plateNumber}</div>
                           <div className="text-xs opacity-50 uppercase">V-LOG-{v.id}</div>
                         </td>
                         <td>{v.model}</td>
                         <td>
                           <span className={`badge ${getStatusBadge(v.status)} font-bold p-3`}>
                             {v.status}
                           </span>
                         </td>
                         <td>{v.capacity} T</td>
                         <td>
                            <div className="flex items-center gap-2">
                               <FaUserCircle className="text-base-content/20" />
                               {v.currentDriver || 'Unassigned'}
                            </div>
                         </td>
                         <td className="text-xs">
                           {v.lastServiceDate ? new Date(v.lastServiceDate).toLocaleDateString() : 'Pending'}
                         </td>
                         <td>
                           <button className="btn btn-ghost btn-xs text-info">Service</button>
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

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-6">Add New Fleet Vehicle</h3>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Plate Number</label>
                  <input type="text" className="input input-bordered" required
                    value={newVehicle.plateNumber} onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Model</label>
                  <input type="text" className="input input-bordered" required
                    value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Capacity (Tons)</label>
                  <input type="number" step="0.1" className="input input-bordered" required
                    value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: parseFloat(e.target.value)})} />
                </div>
                <div className="form-control">
                  <label className="label">Driver Name</label>
                  <input type="text" className="input input-bordered"
                    value={newVehicle.currentDriver} onChange={e => setNewVehicle({...newVehicle, currentDriver: e.target.value})} />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-warning text-warning-content px-8">Register Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsFleetManagementPage;
