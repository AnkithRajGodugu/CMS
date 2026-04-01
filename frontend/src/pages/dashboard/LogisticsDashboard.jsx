import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaBoxes, FaRoute, FaWarehouse, FaUsers, FaShippingFast, FaExclamationTriangle } from 'react-icons/fa';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import SystemMetricsWidget from '../../components/shared/SystemMetricsWidget';

const LogisticsDashboard = () => {
  const { user, sector } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        const [shipmentsRes, inventoryRes] = await Promise.all([
          api.get('/logistics/shipments'),
          api.get('/logistics/inventory')
        ]);
        setShipments(Array.isArray(shipmentsRes.data) ? shipmentsRes.data : (shipmentsRes.data?.content || []));
        setInventory(Array.isArray(inventoryRes.data) ? inventoryRes.data : (inventoryRes.data?.content || []));
        setError(null);
      } catch (err) {
        console.error('Failed to load logistics data', err);
        setError('Server connection failed. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch unconditionally — sector gate is applied after loading
    fetchLogisticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to view the dashboard.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Shipments', value: shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'PENDING').length || 0, change: '+18%', icon: FaShippingFast, color: 'text-info' },
    { label: 'Inventory Items', value: inventory.length || 0, change: '+5%', icon: FaBoxes, color: 'text-success' },
    { label: 'Total Shipments', value: shipments.length || 0, change: '0%', icon: FaTruck, color: 'text-warning' },
    { label: 'Warehouses', value: '2', change: '0', icon: FaWarehouse, color: 'text-error' },
  ];

  const quickActions = [
    { title: 'Shipment Tracking', path: '/dashboard/logistics/tracking', icon: FaShippingFast, color: 'bg-info' },
    { title: 'Inventory', path: '/dashboard/logistics/inventory', icon: FaBoxes, color: 'bg-success' },
    { title: 'Fleet Management', path: '/dashboard/logistics/fleet', icon: FaTruck, color: 'bg-warning' },
    { title: 'Route Optimization', path: '/dashboard/logistics/routes', icon: FaRoute, color: 'bg-error' },
    { title: 'Warehouse', path: '/dashboard/logistics/warehouse', icon: FaWarehouse, color: 'bg-primary' },
    { title: 'Vendor Relations', path: '/dashboard/logistics/vendors', icon: FaUsers, color: 'bg-secondary' },
  ];

  return (
    <div className="space-y-6">
        
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaTruck className="text-2xl md:text-4xl text-warning" />
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">Logistics Dashboard</h1>
              </div>
              <p className="text-base-content/70 text-sm md:text-base">Manage shipments, inventory, and supply chain operations</p>
            </div>
            <ReportExportButtons sectorCode="LOGISTICS" />
          </div>

        {/* System Metrics (Visible only to Admins) */}
        <SystemMetricsWidget />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-xs md:text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`text-3xl md:text-4xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  <div className="card-body items-center text-center">
                    <div className={`p-4 rounded-full ${action.color} text-white mb-2`}>
                      <action.icon className="text-3xl" />
                    </div>
                    <h3 className="card-title text-lg">{action.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Shipments */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
          <h2 className="card-title">Recent Shipments</h2>
            {/* Mobile card view */}
            <div className="md:hidden space-y-3 mt-2">
              {shipments.length === 0 ? (
                <p className="text-center text-base-content/50 py-4">No shipments found.</p>
              ) : shipments.slice(0,5).map(s => (
                <div key={s.id} className="table-card-row bg-base-200/40 border border-base-200">
                  <div className="flex justify-between"><span className="table-card-row-label">Tracking ID</span><span className="text-sm font-mono">{s.trackingId}</span></div>
                  <div className="flex justify-between"><span className="table-card-row-label">Destination</span><span className="text-sm">{s.destination}</span></div>
                  <div className="flex justify-between items-center"><span className="table-card-row-label">Status</span>
                    <span className={`badge badge-sm ${s.status==='DELIVERED'?'badge-success':s.status==='IN_TRANSIT'?'badge-info':'badge-warning'}`}>{s.status}</span></div>
                  <div className="flex justify-between"><span className="table-card-row-label">ETA</span><span className="text-xs">{s.estimatedDelivery ? new Date(s.estimatedDelivery).toLocaleDateString() : 'Pending'}</span></div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table">
                <thead><tr><th>Tracking ID</th><th>Destination</th><th>Status</th><th>ETA</th></tr></thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No shipments found.</td></tr>
                  ) : shipments.map(shipment => (
                    <tr key={shipment.id}>
                      <td>{shipment.trackingId}</td>
                      <td>{shipment.destination}</td>
                      <td><span className={`badge ${shipment.status==='DELIVERED'?'badge-success':shipment.status==='IN_TRANSIT'?'badge-info':'badge-warning'}`}>{shipment.status}</span></td>
                      <td>{shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
};

export default LogisticsDashboard;
