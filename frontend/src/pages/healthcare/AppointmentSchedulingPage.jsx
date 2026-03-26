import React, { useState, useEffect } from 'react';
import { getAllAppointments } from '../../services/healthcareService';
import { useAuth } from '../../context/AuthContext';

const TYPE_LABELS = { CONSULTATION: 'Consultation', FOLLOW_UP: 'Follow-up', CHECK_UP: 'Check-up', EMERGENCY: 'Emergency' };
const STATUS_BADGE = { CONFIRMED: 'badge-success', PENDING: 'badge-warning', URGENT: 'badge-error', COMPLETED: 'badge-ghost', CANCELLED: 'badge-ghost' };

const AppointmentSchedulingPage = () => {
  const { sector } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'healthcare') {
      getAllAppointments(0, 50)
        .then(res => {
          const list = res.data?.content ?? res.data ?? [];
          setAppointments(list);
        })
        .catch(err => console.error('Could not load appointments:', err))
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

  const filtered = filter === 'ALL'
    ? appointments
    : appointments.filter(a => a.status === filter);

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a?.status === 'CONFIRMED').length,
    pending: appointments.filter(a => a?.status === 'PENDING').length,
    urgent: appointments.filter(a => a?.status === 'URGENT').length,
  };

  const fmtTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">Appointment Scheduling</h1>
          <p className="text-green-700/70 mt-1">View and manage all patient appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: stats.total, icon: '📅', color: 'text-blue-600' },
            { label: "Confirmed", value: stats.confirmed, icon: '✅', color: 'text-green-600' },
            { label: "Pending", value: stats.pending, icon: '⏳', color: 'text-orange-600' },
            { label: "Urgent", value: stats.urgent, icon: '🚨', color: 'text-red-600' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-white rounded-xl shadow p-5">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{loading ? '—' : value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex gap-2 flex-wrap">
          {['ALL', 'CONFIRMED', 'PENDING', 'URGENT', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            {filter === 'ALL' ? 'All Appointments' : `${filter} Appointments`} ({filtered.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-green-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No appointments found</div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Time</th><th>Type</th><th>Status</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id}>
                    <td className="font-mono text-xs">{a.appointmentId}</td>
                    <td className="font-semibold">{a.patientName}</td>
                    <td>{a.doctorName}</td>
                    <td className="text-sm">{fmtTime(a.appointmentTime)}</td>
                    <td><span className="badge badge-outline badge-sm">{TYPE_LABELS[a.type] ?? a.type}</span></td>
                    <td><span className={`badge ${STATUS_BADGE[a.status] ?? 'badge-info'}`}>{a.status}</span></td>
                    <td className="text-sm text-gray-500 max-w-xs truncate">{a.notes ?? '—'}</td>
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

export default AppointmentSchedulingPage;
