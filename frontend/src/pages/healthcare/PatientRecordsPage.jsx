import React, { useState, useEffect } from 'react';
import { getAllPatients, searchPatients } from '../../services/healthcareService';
import { useAuth } from '../../context/AuthContext';

const PatientRecordsPage = () => {
  const { sector } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, critical: 0, stable: 0 });

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'healthcare') {
      loadPatients();
    }
  }, [sector]);

  const loadPatients = async (query = '') => {
    setLoading(true);
    try {
      let data;
      if (query && query.trim().length > 1) {
        const res = await searchPatients(query);
        data = res.data;
        setPatients(Array.isArray(data) ? data : []);
      } else {
        const res = await getAllPatients(0, 50);
        const list = res.data?.content ?? res.data ?? [];
        setPatients(list);
        setStats({
          total: list.length,
          active: list.filter(p => p.status !== 'DISCHARGED').length,
          critical: list.filter(p => p.status === 'CRITICAL').length,
          stable: list.filter(p => p.status === 'STABLE').length,
        });
      }
    } catch (err) {
      console.error('Could not load patients:', err);
    } finally {
      setLoading(false);
    }
  };

  if (sector?.code?.toLowerCase() !== 'healthcare') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          This area is restricted to Healthcare sector personnel. Your account does not have the required permissions.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length === 0 || q.length > 1) loadPatients(q);
  };

  const statusBadge = (status) => {
    if (!status) return 'badge-ghost';
    const map = { CRITICAL: 'badge-error', MONITORING: 'badge-warning', STABLE: 'badge-success', DISCHARGED: 'badge-ghost' };
    return map[status] ?? 'badge-info';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Patient Records</h1>
          <p className="text-green-700/70 mt-1">Manage and review all registered patients</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Patients', value: stats.total, icon: '👥', color: 'text-blue-600' },
            { label: 'Active Cases', value: stats.active, icon: '✅', color: 'text-green-600' },
            { label: 'Critical', value: stats.critical, icon: '⚠️', color: 'text-red-600' },
            { label: 'Stable', value: stats.stable, icon: '💚', color: 'text-emerald-600' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="bg-white rounded-xl shadow p-5 mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by name..."
            className="input input-bordered flex-1"
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="btn btn-primary" onClick={() => loadPatients(searchQuery)}>Search</button>
          <button className="btn btn-outline" onClick={() => { setSearchQuery(''); loadPatients(''); }}>Clear</button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-800">Patient Directory ({patients.length})</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-green-600" /></div>
          ) : patients.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No patients found</div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Age</th><th>Condition</th>
                  <th>Last Visit</th><th>Contact</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.patientId}</td>
                    <td className="font-semibold">{p.firstName} {p.lastName}</td>
                    <td>{p.age}</td>
                    <td>{p.condition}</td>
                    <td>{p.lastVisit ?? '—'}</td>
                    <td>{p.contactNumber ?? '—'}</td>
                    <td>
                      <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
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

export default PatientRecordsPage;
