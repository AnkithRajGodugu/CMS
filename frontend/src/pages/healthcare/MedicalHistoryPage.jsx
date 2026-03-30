import React, { useState, useEffect } from 'react';
import { getAllHealthRecords, getAllPatients } from '../../services/healthcareService';
import { useAuth } from '../../hooks/useAuth';

const TYPE_BADGE = {
  LAB_RESULT: 'badge-info',
  VISIT_SUMMARY: 'badge-success',
  IMAGING: 'badge-warning',
  VACCINATION: 'badge-primary',
  PRESCRIPTION: 'badge-secondary',
};

const MedicalHistoryPage = () => {
  const { sector } = useAuth();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'healthcare') {
      Promise.all([getAllHealthRecords(), getAllPatients(0, 50)])
        .then(([recRes, patRes]) => {
          const recs = Array.isArray(recRes.data) ? recRes.data
            : (recRes.data?.content ?? recRes.data ?? []);
          setRecords(recs);
          const list = patRes.data?.content ?? patRes.data ?? [];
          setPatients(list);
        })
        .catch(err => console.error('Could not load health records:', err))
        .finally(() => setLoading(false));
    }
  }, [sector]);

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

  const filtered = records.filter(r => {
    const typeMatch = filterType === 'ALL' || r.type === filterType;
    const userMatch = searchUser === '' ||
      (r.username ?? '').toLowerCase().includes(searchUser.toLowerCase());
    return typeMatch && userMatch;
  });

  const summary = {
    total: records.length,
    labResults: records.filter(r => r.type === 'LAB_RESULT').length,
    visits: records.filter(r => r.type === 'VISIT_SUMMARY').length,
    vaccinations: records.filter(r => r.type === 'VACCINATION').length,
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Medical History</h1>
          <p className="text-green-700/70 mt-1">All patient health records across the system</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Records', value: summary.total, icon: '📋', color: 'text-blue-600' },
            { label: 'Lab Results', value: summary.labResults, icon: '🔬', color: 'text-cyan-600' },
            { label: 'Visits', value: summary.visits, icon: '🏥', color: 'text-green-600' },
            { label: 'Vaccinations', value: summary.vaccinations, icon: '💉', color: 'text-purple-600' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Filter by username..."
            className="input input-bordered input-sm"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'LAB_RESULT', 'VISIT_SUMMARY', 'IMAGING', 'VACCINATION', 'PRESCRIPTION'].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`btn btn-xs ${filterType === t ? 'btn-primary' : 'btn-ghost'}`}>
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-green-800 mb-4">Health Records ({filtered.length})</h2>

          {loading ? (
            <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-green-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No records found</div>
          ) : (
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr><th>Date</th><th>User</th><th>Type</th><th>Title</th><th>Provider</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.recordDate)}</td>
                    <td className="font-mono">{r.username ?? '—'}</td>
                    <td>
                      <span className={`badge badge-sm ${TYPE_BADGE[r.type] ?? 'badge-ghost'}`}>
                        {(r.type ?? '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="font-semibold max-w-xs">{r.title}</td>
                    <td>{r.provider ?? '—'}</td>
                    <td>{r.status ?? '—'}</td>
                    <td className="text-gray-500 max-w-xs truncate">{r.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Patient Summary Cards */}
        {!loading && patients.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-green-800 mb-4">Patient Overview ({patients.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.slice(0, 6).map(p => {
                const patRecords = records.filter(r =>
                  r.user?.username && (p.firstName + ' ' + p.lastName).toLowerCase().includes(r.user.username.replace('_', ' ').toLowerCase())
                );
                return (
                  <div key={p.id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{p.firstName} {p.lastName}</h3>
                      <span className={`badge badge-sm ${
                        p.status === 'CRITICAL' ? 'badge-error' :
                        p.status === 'MONITORING' ? 'badge-warning' :
                        'badge-success'
                      }`}>{p.status || 'STABLE'}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">🩺 {p.condition || 'No Condition'}</p>
                    <p className="text-sm text-gray-500 mb-1">📞 {p.contactNumber || 'N/A'}</p>
                    <p className="text-sm text-gray-500">📅 Last visit: {fmtDate(p.lastVisit)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
