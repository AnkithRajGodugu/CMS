import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaBuilding, FaStar, FaExclamationTriangle, FaPlus, FaClock, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';

const perfBadge = (score) => {
  if (score >= 90) return 'badge-success';
  if (score >= 75) return 'badge-warning';
  return 'badge-error';
};

const contractBadge = (status) => {
  if (status === 'ACTIVE') return 'badge-success';
  if (status === 'EXPIRING_SOON') return 'badge-warning';
  return 'badge-error';
};

const contractLabel = (status) => {
  if (status === 'ACTIVE') return 'Active';
  if (status === 'EXPIRING_SOON') return 'Expiring Soon';
  if (status === 'EXPIRED') return 'Expired';
  return 'Pending';
};

const LogisticsVendorRelationsPage = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: '',
    category: '',
    performanceScore: 80,
    contractStatus: 'ACTIVE',
    contractRenewalDate: '',
    contactEmail: '',
    contactPhone: ''
  });

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/logistics/vendors');
      if (res.data?.success) setVendors(res.data.data ?? []);
    } catch (err) {
      console.error('Failed to fetch vendors', err);
      toast.error('Failed to load vendor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'logistics') fetchVendors();
  }, [sector]);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/logistics/vendors', newVendor);
      if (res.data?.success) {
        toast.success('Vendor added successfully');
        setIsModalOpen(false);
        setNewVendor({ name: '', category: '', performanceScore: 80, contractStatus: 'ACTIVE', contractRenewalDate: '', contactEmail: '', contactPhone: '' });
        fetchVendors();
      }
    } catch (err) {
      console.error('Failed to add vendor', err);
      toast.error('Failed to add vendor');
    }
  };

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const activeCount = vendors.filter(v => v.contractStatus === 'ACTIVE').length;
  const expiringCount = vendors.filter(v => v.contractStatus === 'EXPIRING_SOON').length;
  const avgPerformance = vendors.length > 0
    ? Math.round(vendors.reduce((s, v) => s + v.performanceScore, 0) / vendors.length)
    : 0;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaBuilding className="text-warning" /> Vendor Relations
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Manage supplier contracts, track performance ratings, and monitor renewal timelines.</p>
            </div>
            <button className="btn btn-warning text-white gap-2" onClick={() => setIsModalOpen(true)}><FaPlus /> Add Vendor</button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-success"><FaCheckCircle className="text-3xl" /></div>
                <div className="stat-title">Active Contracts</div>
                <div className="stat-value text-success">{loading ? '—' : activeCount}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-warning"><FaClock className="text-3xl" /></div>
                <div className="stat-title">Expiring Soon</div>
                <div className="stat-value text-warning">{loading ? '—' : expiringCount}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-info"><FaStar className="text-3xl" /></div>
                <div className="stat-title">Avg Performance</div>
                <div className="stat-value text-info">{loading ? '—' : `${avgPerformance}%`}</div>
              </div>
            </div>
          </div>

          {/* Vendor Table */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="card-body">
              <h2 className="card-title mb-4">Approved Vendors</h2>
              {loading ? (
                <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-warning" /></div>
              ) : vendors.length === 0 ? (
                <div className="text-center py-12 opacity-50 italic">No vendors registered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Vendor</th>
                        <th>Category</th>
                        <th>Performance Score</th>
                        <th>Contract Status</th>
                        <th>Renewal Date</th>
                        <th>Contact</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.map((v) => (
                        <tr key={v.id} className="hover">
                          <td className="font-bold flex items-center gap-2"><FaBuilding className="text-warning" />{v.name}</td>
                          <td><span className="badge badge-ghost badge-sm">{v.category}</span></td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="bg-base-200 h-2 w-24 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${v.performanceScore >= 90 ? 'bg-success' : v.performanceScore >= 75 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${v.performanceScore}%` }}></div>
                              </div>
                              <span className={`badge ${perfBadge(v.performanceScore)} badge-sm`}>{v.performanceScore}%</span>
                            </div>
                          </td>
                          <td><span className={`badge ${contractBadge(v.contractStatus)} badge-sm font-bold`}>{contractLabel(v.contractStatus)}</span></td>
                          <td className="font-mono text-sm">{v.contractRenewalDate ?? '—'}</td>
                          <td className="text-xs opacity-60">{v.contactEmail}</td>
                          <td><button className="btn btn-ghost btn-xs">Manage</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3"><FaBuilding className="text-warning" /> Add New Vendor</h3>
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Vendor Name</label>
                  <input type="text" className="input input-bordered" required value={newVendor.name} onChange={e => setNewVendor({...newVendor, name: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Category</label>
                  <input type="text" className="input input-bordered" required placeholder="e.g. Freight, Last-Mile" value={newVendor.category} onChange={e => setNewVendor({...newVendor, category: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Performance Score (%)</label>
                  <input type="number" min="0" max="100" className="input input-bordered" required value={newVendor.performanceScore} onChange={e => setNewVendor({...newVendor, performanceScore: parseInt(e.target.value)})} />
                </div>
                <div className="form-control">
                  <label className="label">Contract Status</label>
                  <select className="select select-bordered" value={newVendor.contractStatus} onChange={e => setNewVendor({...newVendor, contractStatus: e.target.value})}>
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRING_SOON">Expiring Soon</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label">Contract Renewal Date</label>
                <input type="date" className="input input-bordered" value={newVendor.contractRenewalDate} onChange={e => setNewVendor({...newVendor, contractRenewalDate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Contact Email</label>
                  <input type="email" className="input input-bordered" value={newVendor.contactEmail} onChange={e => setNewVendor({...newVendor, contactEmail: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Contact Phone</label>
                  <input type="text" className="input input-bordered" value={newVendor.contactPhone} onChange={e => setNewVendor({...newVendor, contactPhone: e.target.value})} />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-warning text-white px-8">Add Vendor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticsVendorRelationsPage;
