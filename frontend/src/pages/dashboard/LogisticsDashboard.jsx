import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaBoxes, FaRoute, FaWarehouse, FaUsers, FaShippingFast } from 'react-icons/fa';
import api from '../../services/api';

const LogisticsDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        const [shipmentsRes, inventoryRes] = await Promise.all([
          api.get('/logistics/shipments'),
          api.get('/logistics/inventory')
        ]);
        setShipments(shipmentsRes.data);
        setInventory(inventoryRes.data);
      } catch (err) {
        console.error('Failed to load logistics data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogisticsData();
  }, []);
  const stats = [
    { label: 'Active Shipments', value: shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'PENDING').length || 0, change: '+18%', icon: FaShippingFast, color: 'text-info' },
    { label: 'Inventory Items', value: inventory.length || 0, change: '+5%', icon: FaBoxes, color: 'text-success' },
    { label: 'Total Shipments', value: shipments.length || 0, change: '0%', icon: FaTruck, color: 'text-warning' },
    { label: 'Warehouses', value: '2', change: '0', icon: FaWarehouse, color: 'text-error' },
  ];

  const quickActions = [
    { title: 'Shipment Tracking', path: '/logistics-&-supply/LogisticsShipmentTrackingPage', icon: FaShippingFast, color: 'bg-info' },
    { title: 'Inventory', path: '/logistics-&-supply/LogisticsInventoryManagementPage', icon: FaBoxes, color: 'bg-success' },
    { title: 'Fleet Management', path: '/logistics-&-supply/LogisticsFleetManagementPage', icon: FaTruck, color: 'bg-warning' },
    { title: 'Route Optimization', path: '/logistics-&-supply/LogisticsRouteOptimizationPage', icon: FaRoute, color: 'bg-error' },
    { title: 'Warehouse', path: '/logistics-&-supply/LogisticsWarehouseManagementPage', icon: FaWarehouse, color: 'bg-primary' },
    { title: 'Vendor Relations', path: '/logistics-&-supply/LogisticsVendorRelationsPage', icon: FaUsers, color: 'bg-secondary' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaTruck className="text-4xl text-warning" />
            <h1 className="text-4xl font-bold">Logistics Dashboard</h1>
          </div>
          <p className="text-base-content/70">Manage shipments, inventory, and supply chain operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : shipments.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No shipments found.</td></tr>
                  ) : (
                    shipments.map(shipment => (
                      <tr key={shipment.id}>
                        <td>{shipment.trackingId}</td>
                        <td>{shipment.destination}</td>
                        <td>
                          <span className={`badge ${
                            shipment.status === 'DELIVERED' ? 'badge-success' : 
                            shipment.status === 'IN_TRANSIT' ? 'badge-info' : 
                            'badge-warning'
                          }`}>
                            {shipment.status}
                          </span>
                        </td>
                        <td>{shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'Pending'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
