import React, { useState, useEffect } from 'react';
import { getAllInsuranceClaims, getInsuranceClaimStats } from '../../services/healthcareService';

const STATUS_BADGE = { APPROVED: 'badge-success', PENDING: 'badge-warning', DENIED: 'badge-error' };

const InsuranceManagementPage = () => {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, denied: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    Promise.all([
      getAllInsuranceClaims(),
      getInsuranceClaimStats(),
    ])
      .then(([claimsRes, statsRes]) => {
        const list = claimsRes.data ?? [];
        setClaims(list);
        const s = statsRes.data ?? {};
        setStats({
          approved: s.approvedClaims ?? 0,
          pending: s.pendingClaims ?? 0,
          denied: s.deniedClaims ?? 0,
          successRate: s.successRate ?? 0,
        });
      })
      .catch(err => console.error('Could not load insurance data:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? claims : claims.filter(c => c.status === filter);

  const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Insurance Management</h1>
          <p className="text-green-700/70 mt-1">Track and process all insurance claims</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Approved Claims', value: `$${(+stats.approved).toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: '✅', color: 'text-green-600' },
            { label: 'Pending Claims', value: `$${(+stats.pending).toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: '⏳', color: 'text-orange-600' },
            { label: 'Denied Claims', value: `$${(+stats.denied).toLocaleString('en-US', {minimumFractionDigits: 2})}`, icon: '❌', color: 'text-red-600' },
            { label: 'Success Rate', value: `${stats.successRate}%`, icon: '📊', color: 'text-blue-600' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-2">
          {['ALL', 'APPROVED', 'PENDING', 'DENIED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-green-800 mb-4">Insurance Claims ({filtered.length})</h2>

          {loading ? (
            <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-green-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No claims found</div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr><th>#</th><th>Patient</th><th>Amount</th><th>Submitted</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">CLM-{String(c.id).padStart(4, '0')}</td>
                    <td className="font-semibold">{c.patientName}</td>
                    <td className="font-bold">${(+c.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td>{fmtDate(c.submittedAt)}</td>
                    <td><span className={`badge ${STATUS_BADGE[c.status] ?? 'badge-info'}`}>{c.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-xs btn-outline">View</button>
                        <button className="btn btn-xs btn-primary">Process</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsuranceManagementPage;
