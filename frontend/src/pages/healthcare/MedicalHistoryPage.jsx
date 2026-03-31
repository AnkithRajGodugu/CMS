import React, { useState, useEffect } from 'react';
import {
  ClipboardList, FlaskConical, Hospital, Syringe,
  FileText, Scan, Pill, Search, X, Filter
} from 'lucide-react';
import { getAllHealthRecords, getAllPatients } from '../../services/healthcareService';
import { useAuth } from '../../hooks/useAuth';
import HealthcareKPICard from '../../components/healthcare/HealthcareKPICard';

const TYPE_CONFIG = {
  LAB_RESULT:    { label: 'Lab Result',    icon: FlaskConical, color: '#0891b2', bg: 'bg-cyan-50 text-cyan-700 border border-cyan-200' },
  VISIT_SUMMARY: { label: 'Visit',         icon: Hospital,     color: '#0d9488', bg: 'bg-teal-50 text-teal-700 border border-teal-200' },
  IMAGING:       { label: 'Imaging',       icon: Scan,         color: '#7c3aed', bg: 'bg-violet-50 text-violet-700 border border-violet-200' },
  VACCINATION:   { label: 'Vaccination',   icon: Syringe,      color: '#059669', bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  PRESCRIPTION:  { label: 'Prescription',  icon: Pill,         color: '#d97706', bg: 'bg-amber-50 text-amber-700 border border-amber-200' },
};

const PATIENT_STATUS = {
  CRITICAL:   { classes: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-500' },
  MONITORING: { classes: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-500' },
  STABLE:     { classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
};

const FILTER_TYPES = ['ALL', 'LAB_RESULT', 'VISIT_SUMMARY', 'IMAGING', 'VACCINATION', 'PRESCRIPTION'];

function PatientAvatar({ name }) {
  const parts = (name || '').split(' ').filter(Boolean);
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.[0] ?? '?');
  const colors = ['from-teal-600 to-emerald-600', 'from-cyan-600 to-teal-600', 'from-emerald-600 to-green-600', 'from-violet-600 to-purple-600'];
  const idx = (name || '').charCodeAt(0) % colors.length;
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none`}>
      {initials.toUpperCase()}
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + (i * 11) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

const MedicalHistoryPage = () => {
  const { sector } = useAuth();
  const [records, setRecords]       = useState([]);
  const [patients, setPatients]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'healthcare') {
      Promise.all([getAllHealthRecords(), getAllPatients(0, 50)])
        .then(([recRes, patRes]) => {
          const recs = Array.isArray(recRes.data) ? recRes.data : (recRes.data?.content ?? recRes.data ?? []);
          setRecords(recs);
          setPatients(patRes.data?.content ?? patRes.data ?? []);
        })
        .catch(err => console.error('Could not load health records:', err))
        .finally(() => setLoading(false));
    }
  }, [sector]);

  if (sector?.code?.toLowerCase() !== 'healthcare') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p4">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">This area is restricted to Healthcare sector personnel.</p>
        <button className="px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const filtered = records.filter(r => {
    const typeMatch = filterType === 'ALL' || r.type === filterType;
    const userMatch = !searchUser || (r.username ?? '').toLowerCase().includes(searchUser.toLowerCase());
    return typeMatch && userMatch;
  });

  const summary = {
    total:       records.length,
    labResults:  records.filter(r => r.type === 'LAB_RESULT').length,
    visits:      records.filter(r => r.type === 'VISIT_SUMMARY').length,
    vaccinations: records.filter(r => r.type === 'VACCINATION').length,
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—';

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Medical History</h1>
            <p className="text-teal-200 text-sm mt-0.5">All patient health records across the system</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthcareKPICard title="Total Records"  value={loading ? '—' : summary.total}        icon={ClipboardList}  accentColor="border-teal-500"    bgAccent="bg-teal-50"    iconColor="text-teal-600" loading={loading} />
        <HealthcareKPICard title="Lab Results"    value={loading ? '—' : summary.labResults}   icon={FlaskConical}   accentColor="border-cyan-500"    bgAccent="bg-cyan-50"    iconColor="text-cyan-600" loading={loading} />
        <HealthcareKPICard title="Visits"         value={loading ? '—' : summary.visits}       icon={Hospital}       accentColor="border-emerald-500" bgAccent="bg-emerald-50" iconColor="text-emerald-600" loading={loading} />
        <HealthcareKPICard title="Vaccinations"   value={loading ? '—' : summary.vaccinations} icon={Syringe}        accentColor="border-violet-500"  bgAccent="bg-violet-50"  iconColor="text-violet-600" loading={loading} />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter by username…"
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
            />
            {searchUser && (
              <button onClick={() => setSearchUser('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type pills */}
          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="w-4 h-4 text-slate-400" />
            {FILTER_TYPES.map(t => {
              const cfg = TYPE_CONFIG[t];
              const active = filterType === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600'
                  }`}
                >
                  {cfg && <cfg.icon className="w-3 h-3" />}
                  {t === 'ALL' ? 'All Types' : (cfg?.label ?? t.replace('_', ' '))}
                </button>
              );
            })}
          </div>

          <span className="ml-auto text-xs text-slate-400">{filtered.length} records</span>
        </div>
      </div>

      {/* ── Records Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Health Records ({filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Date', 'User', 'Type', 'Title', 'Provider', 'Status', 'Notes'].map(h => (
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
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No records found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(r => {
                  const tc = TYPE_CONFIG[r.type] || { label: r.type, icon: FileText, bg: 'bg-slate-100 text-slate-600' };
                  return (
                    <tr key={r.id} className="hover:bg-teal-50/40 transition-colors duration-150">
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{fmtDate(r.recordDate)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{r.username ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tc.bg}`}>
                          <tc.icon className="w-3 h-3" />
                          {tc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 max-w-[200px] truncate">{r.title}</td>
                      <td className="px-4 py-3 text-slate-600">{r.provider ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{r.status ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 max-w-[160px] truncate">{r.description ?? '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Patient Overview Cards ── */}
      {!loading && patients.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-4">Patient Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.slice(0, 6).map(p => {
              const sc = PATIENT_STATUS[p.status] || PATIENT_STATUS.STABLE;
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <PatientAvatar name={`${p.firstName} ${p.lastName}`} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate">{p.firstName} {p.lastName}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {p.status || 'STABLE'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5"><Hospital className="w-3 h-3 text-teal-500" />{p.condition || 'No condition listed'}</p>
                    <p className="flex items-center gap-1.5"><ClipboardList className="w-3 h-3 text-slate-400" />Last visit: {fmtDate(p.lastVisit)}</p>
                    {p.contactNumber && <p className="flex items-center gap-1.5"><span className="text-slate-400">📞</span>{p.contactNumber}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistoryPage;
