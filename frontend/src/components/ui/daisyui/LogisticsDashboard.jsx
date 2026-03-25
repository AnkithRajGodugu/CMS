import React from 'react';
import { useTheme } from '../../../context/SectorThemeProvider';

const LogisticsDashboard = () => {
  

  const shipments = [
    { id: 'SH001', destination: 'New York', status: 'In Transit', eta: '2 hours' },
    { id: 'SH002', destination: 'Los Angeles', status: 'Delivered', eta: 'Completed' },
    { id: 'SH003', destination: 'Chicago', status: 'Processing', eta: '1 day' },
    { id: 'SH004', destination: 'Miami', status: 'In Transit', eta: '4 hours' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'In Transit': return 'badge-warning';
      case 'Processing': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
            </svg>
          </div>
          <div className="stat-title">Active Shipments</div>
          <div className="stat-value text-primary">847</div>
          <div className="stat-desc">21% more than last month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">On-Time Delivery</div>
          <div className="stat-value text-secondary">94.2%</div>
          <div className="stat-desc">↗︎ 2.1% (30 days)</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-accent">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title">Revenue</div>
          <div className="stat-value text-accent">$2.4M</div>
          <div className="stat-desc">↗︎ 12% (30 days)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Shipments</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="font-mono">{shipment.id}</td>
                      <td>{shipment.destination}</td>
                      <td>
                        <div className={`badge ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </div>
                      </td>
                      <td>{shipment.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fleet Status */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Fleet Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Active Vehicles</span>
                <div className="badge badge-success">24/30</div>
              </div>
              <div className="flex justify-between items-center">
                <span>In Maintenance</span>
                <div className="badge badge-warning">4/30</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Out of Service</span>
                <div className="badge badge-error">2/30</div>
              </div>
              
              <div className="divider"></div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Fuel Efficiency</span>
                  <span className="text-sm font-semibold">8.2 MPG</span>
                </div>
                <progress className="progress progress-primary w-full" value="82" max="100"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Optimization */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Route Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Distance Saved</div>
              <div className="stat-value text-success">1,247 mi</div>
              <div className="stat-desc">This month</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Fuel Saved</div>
              <div className="stat-value text-success">$3,420</div>
              <div className="stat-desc">Cost reduction</div>
            </div>
            <div className="stat bg-base-200 rounded-lg">
              <div className="stat-title">Time Saved</div>
              <div className="stat-value text-success">127 hrs</div>
              <div className="stat-desc">Driver hours</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;