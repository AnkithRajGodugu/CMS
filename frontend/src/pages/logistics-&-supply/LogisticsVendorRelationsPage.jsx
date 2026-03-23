import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaBuilding, FaStar, FaExclamationTriangle, FaPlus, FaClock, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';

const HARDCODED_VENDORS = [
  { name: 'Acme Corp', category: 'Freight', performance: 94, contract: 'Active', renewal: '2026-12-01' },
  { name: 'Global Supplies', category: 'Warehousing', performance: 78, contract: 'Expiring Soon', renewal: '2026-04-15' },
  { name: 'LogiTech Partners', category: 'Last-Mile', performance: 86, contract: 'Active', renewal: '2027-01-10' },
  { name: 'FastTrack Ltd', category: 'Cold Chain', performance: 97, contract: 'Active', renewal: '2027-06-01' },
];

const perfBadge = (score) => {
  if (score >= 90) return 'badge-success';
  if (score >= 75) return 'badge-warning';
  return 'badge-error';
};

const contractBadge = (status) => {
  if (status === 'Active') return 'badge-success';
  if (status === 'Expiring Soon') return 'badge-warning';
  return 'badge-error';
};

const LogisticsVendorRelationsPage = () => {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    if (user?.role === 'logistics') {
      api.get('/logistics/shipments')
        .then(res => setShipments(res.data?.data ?? []))
        .catch(() => {});
    }
  }, [user]);

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <Header />
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Logistics Access Only</h2>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const avgPerformance = Math.round(HARDCODED_VENDORS.reduce((s, v) => s + v.performance, 0) / HARDCODED_VENDORS.length);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaBuilding className="text-warning" /> Vendor Relations
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Manage supplier contracts, track performance ratings, and monitor renewal timelines.</p>
            </div>
            <button className="btn btn-warning text-white gap-2"><FaPlus /> Add Vendor</button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-success"><FaCheckCircle className="text-3xl" /></div>
                <div className="stat-title">Active Contracts</div>
                <div className="stat-value text-success">{HARDCODED_VENDORS.filter(v => v.contract === 'Active').length}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-warning"><FaClock className="text-3xl" /></div>
                <div className="stat-title">Expiring Soon</div>
                <div className="stat-value text-warning">{HARDCODED_VENDORS.filter(v => v.contract === 'Expiring Soon').length}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-info"><FaStar className="text-3xl" /></div>
                <div className="stat-title">Avg Performance</div>
                <div className="stat-value text-info">{avgPerformance}%</div>
              </div>
            </div>
          </div>

          {/* Vendor Table */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="card-body">
              <h2 className="card-title mb-4">Approved Vendors</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Category</th>
                      <th>Performance Score</th>
                      <th>Contract Status</th>
                      <th>Renewal Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HARDCODED_VENDORS.map((v, i) => (
                      <tr key={i} className="hover">
                        <td className="font-bold flex items-center gap-2"><FaBuilding className="text-warning" />{v.name}</td>
                        <td><span className="badge badge-ghost badge-sm">{v.category}</span></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="bg-base-200 h-2 w-24 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${v.performance >= 90 ? 'bg-success' : v.performance >= 75 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${v.performance}%` }}></div>
                            </div>
                            <span className={`badge ${perfBadge(v.performance)} badge-sm`}>{v.performance}%</span>
                          </div>
                        </td>
                        <td><span className={`badge ${contractBadge(v.contract)} badge-sm font-bold`}>{v.contract}</span></td>
                        <td className="font-mono text-sm">{v.renewal}</td>
                        <td><button className="btn btn-ghost btn-xs">Manage</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogisticsVendorRelationsPage;
