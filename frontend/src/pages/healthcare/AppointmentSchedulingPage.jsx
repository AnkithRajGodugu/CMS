import React, { useState, useEffect } from 'react';
import {
  CalendarDays, CheckCircle2, Clock, Siren, Filter, XCircle
} from 'lucide-react';
import { getAllAppointments } from '../../services/healthcareService';
import { useAuth } from '../../hooks/useAuth';
import HealthcareKPICard from '../../components/healthcare/HealthcareKPICard';

const TYPE_LABELS = {
  CONSULTATION: 'Consultation',
  FOLLOW_UP:    'Follow-up',
  CHECK_UP:     'Check-up',
  EMERGENCY:    'Emergency',
};

const STATUS_CONFIG = {
  CONFIRMED:  { classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  PENDING:    { classes: 'bg-amber-50 text-amber-700 border border-amber-200',       dot: 'bg-amber-500' },
  URGENT:     { classes: 'bg-red-50 text-red-700 border border-red-200',             dot: 'bg-red-500' },
  COMPLETED:  { classes: 'bg-slate-100 text-slate-600 border border-slate-200',      dot: 'bg-slate-400' },
  CANCELLED:  { classes: 'bg-slate-100 text-slate-500 border border-slate-200',      dot: 'bg-slate-300' },
};

const FILTERS = ['ALL', 'CONFIRMED', 'PENDING', 'URGENT', 'COMPLETED', 'CANCELLED'];

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + (i * 13) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

const AppointmentSchedulingPage = () => {
  const { sector } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('ALL');

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">This area is restricted to Healthcare sector personnel.</p>
        <button className="px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);
  const stats = {
    total:     appointments.length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    pending:   appointments.filter(a => a.status === 'PENDING').length,
    urgent:    appointments.filter(a => a.status === 'URGENT').length,
  };

  const fmtTime = iso => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Appointment Scheduling</h1>
              <p className="text-teal-200 text-sm mt-0.5">View and manage all patient appointments</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-teal-200 text-xs">Today</p>
            <p className="text-white font-bold text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthcareKPICard title="Total"     value={loading ? '—' : stats.total}     icon={CalendarDays}  accentColor="border-teal-500"    bgAccent="bg-teal-50"    iconColor="text-teal-600" loading={loading} />
        <HealthcareKPICard title="Confirmed" value={loading ? '—' : stats.confirmed} icon={CheckCircle2}  accentColor="border-emerald-500" bgAccent="bg-emerald-50" iconColor="text-emerald-600" loading={loading} />
        <HealthcareKPICard title="Pending"   value={loading ? '—' : stats.pending}   icon={Clock}         accentColor="border-amber-500"   bgAccent="bg-amber-50"   iconColor="text-amber-600" loading={loading} />
        <HealthcareKPICard title="Urgent"    value={loading ? '—' : stats.urgent}    icon={Siren}         accentColor="border-red-500"     bgAccent="bg-red-50"     iconColor="text-red-600" loading={loading} />
      </div>

      {/* ── Filter Pills ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-2 flex-wrap items-center">
        <Filter className="w-4 h-4 text-slate-400 ml-1" />
        {FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === s
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} shown</span>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">
            {filter === 'ALL' ? 'All Appointments' : `${filter} Appointments`} ({filtered.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['ID', 'Patient', 'Doctor', 'Scheduled Time', 'Type', 'Status', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No appointments found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(a => {
                  const sc = STATUS_CONFIG[a.status] || { classes: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
                  const isUrgent = a.status === 'URGENT';
                  return (
                    <tr key={a.id} className={`transition-colors duration-150 ${isUrgent ? 'bg-red-50/30 hover:bg-red-50/60' : 'hover:bg-teal-50/40'}`}>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{a.appointmentId}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{a.patientName}</td>
                      <td className="px-4 py-3 text-slate-600">{a.doctorName}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtTime(a.appointmentTime)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          {TYPE_LABELS[a.type] ?? a.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {a.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">{a.notes ?? '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSchedulingPage;
