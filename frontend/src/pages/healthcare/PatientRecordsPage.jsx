import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, AlertCircle, HeartPulse,
  Search, X
} from 'lucide-react';
import { getAllPatients, searchPatients } from '../../services/healthcareService';
import { useAuth } from '../../hooks/useAuth';
import HealthcareKPICard from '../../components/healthcare/HealthcareKPICard';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

function PatientInitials({ name }) {
  const parts = (name || '').split(' ').filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? '?');
  const colors = ['from-teal-600 to-emerald-600', 'from-cyan-600 to-teal-600', 'from-emerald-600 to-green-600'];
  const idx = (name || '').charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none`}>
      {initials.toUpperCase()}
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${55 + (i * 11) % 35}%` }} />
        </td>
      ))}
    </tr>
  );
}

const STATUS_CONFIG = {
  CRITICAL:   { classes: 'bg-red-50 text-red-700 border border-red-200',       dot: 'bg-red-500' },
  MONITORING: { classes: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
  STABLE:     { classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
  DISCHARGED: { classes: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

const PatientRecordsPage = () => {
  const { sector } = useAuth();
  const [patients, setPatients]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats]           = useState({ total: 0, active: 0, critical: 0, stable: 0 });

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'healthcare') loadPatients();
  }, [sector]);

  const loadPatients = async (query = '') => {
    setLoading(true);
    try {
      let list;
      if (query && query.trim().length > 1) {
        const res = await searchPatients(query);
        list = res.data ?? [];
        setPatients(Array.isArray(list) ? list : []);
      } else {
        const res = await getAllPatients(0, 50);
        list = res.data?.content ?? res.data ?? [];
        setPatients(list);
        setStats({
          total:    list.length,
          active:   list.filter(p => p.status !== 'DISCHARGED').length,
          critical: list.filter(p => p.status === 'CRITICAL').length,
          stable:   list.filter(p => p.status === 'STABLE').length,
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          This area is restricted to Healthcare sector personnel.
        </p>
        <button className="px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const handleSearch = e => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length === 0 || q.length > 1) loadPatients(q);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 md:p-6 space-y-5 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Patient Records</h1>
            <p className="text-teal-200 text-sm mt-0.5">Manage and review all registered patients</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthcareKPICard title="Total Patients" value={loading ? '—' : stats.total}    icon={Users}       accentColor="border-teal-500"    bgAccent="bg-teal-50"    iconColor="text-teal-600" loading={loading} />
        <HealthcareKPICard title="Active Cases"   value={loading ? '—' : stats.active}   icon={UserCheck}   accentColor="border-emerald-500" bgAccent="bg-emerald-50" iconColor="text-emerald-600" loading={loading} />
        <HealthcareKPICard title="Critical"       value={loading ? '—' : stats.critical} icon={AlertCircle} accentColor="border-red-500"     bgAccent="bg-red-50"     iconColor="text-red-600" loading={loading} />
        <HealthcareKPICard title="Stable"         value={loading ? '—' : stats.stable}   icon={HeartPulse}  accentColor="border-green-500"   bgAccent="bg-green-50"   iconColor="text-green-600" loading={loading} />
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by patient name…"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); loadPatients(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {!loading && <span className="text-sm text-slate-500">{patients.length} patient{patients.length !== 1 ? 's' : ''}</span>}
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Patient Directory</h2>
          <span className="text-sm text-slate-400">{patients.length} records</span>
        </div>
        <div className="p-4">
          <ResponsiveTable
            loading={loading}
            data={patients}
            rowKey="id"
            emptyText="No patients found"
            theadClass="bg-slate-50 border-b border-slate-100"
            rowHover="hover:bg-teal-50/40"
            columns={[
              {
                key: 'firstName',
                label: 'Patient',
                render: (v, row) => {
                  const name = `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim();
                  const colors = ['from-teal-600 to-emerald-600', 'from-cyan-600 to-teal-600', 'from-emerald-600 to-green-600'];
                  const idx = (name || '').charCodeAt(0) % colors.length;
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {name.split(' ').filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{name || '—'}</span>
                    </div>
                  );
                },
              },
              { key: 'patientId', label: 'ID', render: (v) => <span className="font-mono text-xs text-slate-500">{v}</span> },
              { key: 'age', label: 'Age', render: (v) => <span className="text-slate-600">{v ?? '—'}</span> },
              { key: 'condition', label: 'Condition', render: (v) => <span className="text-slate-600">{v || '—'}</span> },
              { key: 'lastVisit', label: 'Last Visit', render: (v) => <span className="text-xs text-slate-400">{v ?? '—'}</span> },
              { key: 'contactNumber', label: 'Contact', render: (v) => <span className="text-slate-600">{v ?? '—'}</span> },
              {
                key: 'status',
                label: 'Status',
                render: (v) => {
                  const sc = STATUS_CONFIG[v] || { classes: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' };
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {v || 'STABLE'}
                    </span>
                  );
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientRecordsPage;
