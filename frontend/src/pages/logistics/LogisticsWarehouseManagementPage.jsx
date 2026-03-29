import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaWarehouse, FaExclamationTriangle, FaBoxOpen, FaThLarge, FaSearch, FaHistory } from 'react-icons/fa';
import { toast } from 'sonner';

const LogisticsWarehouseManagementPage = () => {
  const { user, sector } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/inventory');
      if (response.data && response.data.success) {
        setInventory(response.data.data?.content || response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
      toast.error('Failed to load warehouse data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') {
      fetchInventory();
    }
  }, [user, sector]);

  const warehouses = [...new Set(inventory.map(item => item.warehouseLocation || 'Unassigned'))];

  const getWarehouseStats = (loc) => {
    const items = inventory.filter(i => i.warehouseLocation === loc);
    const totalStock = items.reduce((sum, i) => sum + i.quantity, 0);
    const capacity = 10000; // Mock capacity per warehouse
    return {
      count: items.length,
      stock: totalStock,
      utilization: Math.min(Math.round((totalStock / capacity) * 100), 100)
    };
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to manage warehouses.</p>
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
                <FaWarehouse className="text-primary" />
                Warehouse Hub
              </h1>
              <p className="text-base-content/70 mt-1">Global site management, inventory distribution, and capacity utilization monitoring.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
               <div className="col-span-full py-20 text-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="mt-4 font-bold opacity-40">Scanning warehouse sensors...</p>
               </div>
            ) : warehouses.length === 0 ? (
               <div className="col-span-full card bg-base-100 shadow p-20 text-center italic opacity-50">
                  No warehouse locations registered in inventory records.
               </div>
            ) : (
              warehouses.map((loc, idx) => {
                const stats = getWarehouseStats(loc);
                return (
                  <div key={idx} className="card bg-base-100 shadow-xl border-t-8 border-primary hover:scale-[1.02] transition-transform">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <h2 className="card-title text-2xl font-bold">{loc}</h2>
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <FaThLarge />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="flex flex-col">
                          <span className="text-xs opacity-50 uppercase font-bold tracking-tighter">SKU Count</span>
                          <span className="text-xl font-bold flex items-center gap-2"><FaBoxOpen className="text-sm opacity-30" /> {stats.count}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs opacity-50 uppercase font-bold tracking-tighter">Total Stock</span>
                          <span className="text-xl font-bold">{stats.stock.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>Capacity Utilization</span>
                          <span>{stats.utilization}%</span>
                        </div>
                        <div className="bg-base-200 h-3 w-full rounded-full overflow-hidden">
                           <div 
                             className={`h-full transition-all duration-1000 ${stats.utilization > 85 ? 'bg-error' : stats.utilization > 60 ? 'bg-warning' : 'bg-success'}`}
                             style={{ width: `${stats.utilization}%` }}
                           ></div>
                        </div>
                      </div>

                      <div className="card-actions justify-end mt-6">
                         <button className="btn btn-ghost btn-sm gap-2 opacity-60">
                            <FaHistory /> Logs
                         </button>
                         <button className="btn btn-primary btn-sm text-white px-6">View Layout</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogisticsWarehouseManagementPage;
