import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaClock, FaPercent, FaHandshake } from 'react-icons/fa';
import { toast } from 'sonner';

const ServiceLevelAgreementPage = () => {
  const { user, sector } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/shipments');
      if (response.data && response.data.success) {
        setShipments(response.data.data?.content || response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch shipments for SLA', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') {
      fetchShipments();
    }
  }, [user, sector]);

  // Derive SLA metrics from shipments
  const delivered = shipments.filter(s => s.status === 'DELIVERED').length;
  const delayed = shipments.filter(s => s.status === 'DELAYED').length;
  const total = shipments.length || 1;
  const onTimeRate = Math.round(((delivered) / (delivered + delayed || 1)) * 100);

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your logistics credentials to view SLA compliance.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaShieldAlt className="text-secondary" />
                Service Level Agreements
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Compliance monitoring, performance targets, and contractual obligation tracking.</p>
            </div>
            <div className="badge badge-secondary badge-lg p-4 font-bold gap-2">
               <FaHandshake /> ACTIVE CONTRACTS
            </div>
          </div>

          {/* SLA Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <div className="stats shadow bg-base-100 overflow-hidden">
                <div className="stat">
                   <div className="stat-figure text-success"><FaPercent className="text-3xl" /></div>
                   <div className="stat-title">On-Time Delivery</div>
                   <div className="stat-value text-success">{onTimeRate}%</div>
                   <div className="stat-desc">Target: 98.5%</div>
                </div>
             </div>
             <div className="stats shadow bg-base-100">
                <div className="stat">
                   <div className="stat-figure text-warning"><FaClock className="text-3xl" /></div>
                   <div className="stat-title">Avg. Latency</div>
                   <div className="stat-value text-warning">4.2h</div>
                   <div className="stat-desc">Target: &lt; 2.0h</div>
                </div>
             </div>
             <div className="stats shadow bg-base-100">
                <div className="stat">
                   <div className="stat-figure text-error"><FaExclamationTriangle className="text-3xl" /></div>
                   <div className="stat-title">Open Breaches</div>
                   <div className="stat-value text-error">{delayed}</div>
                   <div className="stat-desc">Requiring resolution</div>
                </div>
             </div>
             <div className="stats shadow bg-base-100">
                <div className="stat">
                   <div className="stat-figure text-info"><FaCheckCircle className="text-3xl" /></div>
                   <div className="stat-title">Compliance Score</div>
                   <div className="stat-value text-info">94.8</div>
                   <div className="stat-desc">Quarterly average</div>
                </div>
             </div>
          </div>

          {/* Compliance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                   <h2 className="card-title mb-6 border-b pb-2">Active SLA Clauses</h2>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center group">
                         <div>
                            <p className="font-bold">Next Day Delivery (NDD)</p>
                            <p className="text-xs opacity-50">99% success rate required for Tier 1</p>
                         </div>
                         <div className="radial-progress text-success border-4 border-base-200" style={{ "--value": 92, "--size": "3rem" }} role="progressbar">92%</div>
                      </div>
                      <div className="flex justify-between items-center group">
                         <div>
                            <p className="font-bold">Carbon Neutral Routing</p>
                            <p className="text-xs opacity-50">80% of routes must be optimized</p>
                         </div>
                         <div className="radial-progress text-warning border-4 border-base-200" style={{ "--value": 65, "--size": "3rem" }} role="progressbar">65%</div>
                      </div>
                      <div className="flex justify-between items-center group">
                         <div>
                            <p className="font-bold">Damage-Free Rate</p>
                            <p className="text-xs opacity-50">Zero tolerance policy for hardware</p>
                         </div>
                         <div className="radial-progress text-info border-4 border-base-200" style={{ "--value": 100, "--size": "3rem" }} role="progressbar">100%</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                   <h2 className="card-title mb-6 border-b pb-2 text-error">Critical Breaches</h2>
                   <div className="overflow-x-auto">
                      <table className="table table-xs">
                         <thead>
                            <tr>
                               <th>Event ID</th>
                               <th>Contract</th>
                               <th>Threshold</th>
                               <th>Actual</th>
                               <th>Penalty</th>
                            </tr>
                         </thead>
                         <tbody>
                            {shipments.filter(s => s.status === 'DELAYED').map(s => (
                               <tr key={s.id}>
                                  <td className="font-mono text-error">BR-{s.id}</td>
                                  <td>Logistics G1</td>
                                  <td>24h</td>
                                  <td>31h</td>
                                  <td className="text-error font-bold">$150.00</td>
                               </tr>
                            ))}
                            {shipments.filter(s => s.status === 'DELAYED').length === 0 && (
                               <tr><td colSpan="5" className="text-center py-4 opacity-50">No SLA breaches detected. Well done!</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                   <div className="card-actions justify-end mt-4">
                      <button className="btn btn-sm btn-outline">Full Report</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceLevelAgreementPage;
