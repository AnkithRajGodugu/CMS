import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaBoxes, FaPlus, FaExclamationTriangle, FaWarehouse, FaHistory } from 'react-icons/fa';
import { toast } from 'sonner';

const LogisticsInventoryManagementPage = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: 0,
    reorderPoint: 10,
    warehouseLocation: ''
  });

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/inventory');
      // response.data is the ApiResponse object from backend
      if (response.data && response.data.success) {
        setInventory(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'logistics') {
      fetchInventory();
    }
  }, [user]);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/logistics/inventory', newItem);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Item created successfully');
        setIsModalOpen(false);
        setNewItem({ productName: '', quantity: 0, reorderPoint: 10, warehouseLocation: '' });
        fetchInventory();
      }
    } catch (err) {
      console.error('Failed to create item', err);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to manage inventory.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FaBoxes className="text-success" />
                Inventory Management
              </h1>
              <p className="text-base-content/70 mt-1">Monitor stock levels, reorder points, and warehouse locations across global sites.</p>
            </div>
            <button 
              className="btn btn-success gap-2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus /> Add New Item
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-success text-2xl"><FaBoxes /></div>
                <div className="stat-title">Total SKUs</div>
                <div className="stat-value text-success">{inventory.length}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-error text-2xl"><FaExclamationTriangle /></div>
                <div className="stat-title">Low Stock Alerts</div>
                <div className="stat-value text-error">
                  {inventory.filter(i => i.quantity <= i.reorderPoint).length}
                </div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-info text-2xl"><FaWarehouse /></div>
                <div className="stat-title">Active Warehouse Zones</div>
                <div className="stat-value text-info">
                  {new Set(inventory.map(i => i.warehouseLocation)).size}
                </div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-primary text-2xl"><FaHistory /></div>
                <div className="stat-title">Items Restocked (All)</div>
                <div className="stat-value text-primary">
                   {inventory.reduce((sum, i) => sum + (i.quantity > 100 ? 1 : 0), 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Search & Table */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row justify-between gap-4 bg-base-100/50 backdrop-blur">
               <div className="form-control w-full max-w-md">
                 <input 
                   type="text" 
                   placeholder="Search products or locations..." 
                   className="input input-bordered w-full" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="flex items-center gap-2 text-sm text-base-content/60">
                 Showing {filteredInventory.length} items
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>Product Name</th>
                    <th>Warehouse Location</th>
                    <th>Current Stock</th>
                    <th>Reorder Point</th>
                    <th>Status</th>
                    <th>Last Restocked</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-10 font-bold">Loading inventory...</td></tr>
                  ) : filteredInventory.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-10">No items found matching your criteria.</td></tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const isLowStock = item.quantity <= item.reorderPoint;
                      return (
                        <tr key={item.id} className="hover">
                          <td>
                            <div className="font-bold">{item.productName}</div>
                            <div className="text-xs opacity-50 uppercase font-mono">ID: {item.id}</div>
                          </td>
                          <td>
                             <div className="flex items-center gap-2">
                               <FaWarehouse className="text-base-content/30" />
                               {item.warehouseLocation || 'Unassigned'}
                             </div>
                          </td>
                          <td className="font-mono font-bold">{item.quantity}</td>
                          <td className="text-base-content/60">{item.reorderPoint}</td>
                          <td>
                            <span className={`badge ${isLowStock ? 'badge-error' : 'badge-success'} badge-sm font-bold`}>
                              {isLowStock ? 'LOW STOCK' : 'HEALTHY'}
                            </span>
                          </td>
                          <td className="text-xs">
                             {item.lastRestocked ? new Date(item.lastRestocked).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <div className="join join-horizontal">
                              <button className="btn btn-ghost btn-xs join-item">History</button>
                              <button className="btn btn-ghost btn-xs join-item text-primary">Update</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setIsModalOpen(false)}>✕</button>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaPlus className="text-success" /> Add New Inventory Item
            </h3>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Product Name</span></label>
                <input 
                  type="text" 
                  required
                  className="input input-bordered" 
                  value={newItem.productName}
                  onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Current Quantity</span></label>
                  <input 
                    type="number" 
                    required
                    className="input input-bordered" 
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Reorder Point</span></label>
                  <input 
                    type="number" 
                    required
                    className="input input-bordered" 
                    value={newItem.reorderPoint}
                    onChange={(e) => setNewItem({...newItem, reorderPoint: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Warehouse Location</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Zone A-4, Warehouse 1"
                  className="input input-bordered" 
                  value={newItem.warehouseLocation}
                  onChange={(e) => setNewItem({...newItem, warehouseLocation: e.target.value})}
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-success text-white w-full">Create Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsInventoryManagementPage;
