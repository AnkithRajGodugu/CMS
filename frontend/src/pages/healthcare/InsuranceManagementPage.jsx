import React, { useState, useEffect } from 'react';
import {
  DollarSign, CheckCircle2, Clock, XCircle, BarChart2, Filter, Eye
} from 'lucide-react';
import { getAllInsuranceClaims, getInsuranceClaimStats } from '../../services/healthcareService';
import { useAuth } from '../../hooks/useAuth';
import HealthcareKPICard from '../../components/healthcare/HealthcareKPICard';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

const STATUS_BADGE = {
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  PENDING:  'bg-amber-50 text-amber-700 border border-amber-200',
  DENIED:   'bg-red-50 text-red-700 border border-red-200',
};

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

const InsuranceManagementPage = () => {
  const { sector } = useAuth();

  // Derive sector from URL path as an authoritative fallback so the page
  // always works when navigating directly to /dashboard/healthcare/insurance
  const isHealthcareSector =
    sector?.code?.toLowerCase() === 'healthcare' ||
    window.location.pathname.toLowerCase().includes('/healthcare');

  const [claims, setClaims]   = useState([]);
  const [stats, setStats]     = useState({ approved: 0, pending: 0, denied: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');

  useEffect(() => {
    if (isHealthcareSector) {
      Promise.all([getAllInsuranceClaims(), getInsuranceClaimStats()])
        .then(([claimsRes, statsRes]) => {
          setClaims(claimsRes.data ?? []);
          const s = statsRes.data ?? {};
          setStats({
            approved:    s.approvedClaims ?? 0,
            pending:     s.pendingClaims  ?? 0,
            denied:      s.deniedClaims   ?? 0,
            successRate: s.successRate    ?? 0,
          });
        })
        .catch(err => console.error('Could not load insurance data:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHealthcareSector]);

  if (!isHealthcareSector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-6xl mb-4">🏥</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">This area is restricted to Healthcare sector personnel.</p>
        <button className="px-5 py-2 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const filtered = filter === 'ALL' ? claims : claims.filter(c => c.status === filter);
  const fmtDate  = iso => iso ? new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—';
  const fmtUSD   = n   => `$${(+n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const radialData = [{ value: stats.successRate, fill: stats.successRate >= 75 ? '#0d9488' : '#f59e0b' }];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 md:p-6 space-y-5 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Insurance Management</h1>
            <p className="text-teal-200 text-sm mt-0.5">Track and process all insurance claims</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthcareKPICard title="Approved Claims" value={loading ? '—' : fmtUSD(stats.approved)} icon={CheckCircle2} accentColor="border-emerald-500" bgAccent="bg-emerald-50" iconColor="text-emerald-600" loading={loading} />
        <HealthcareKPICard title="Pending Claims"  value={loading ? '—' : fmtUSD(stats.pending)}  icon={Clock}        accentColor="border-amber-500"   bgAccent="bg-amber-50"   iconColor="text-amber-600" loading={loading} />
        <HealthcareKPICard title="Denied Claims"   value={loading ? '—' : fmtUSD(stats.denied)}   icon={XCircle}      accentColor="border-red-500"     bgAccent="bg-red-50"     iconColor="text-red-600" loading={loading} />
        <HealthcareKPICard title="Success Rate"    value={loading ? '—' : `${stats.successRate}%`} icon={BarChart2}   accentColor="border-teal-500"    bgAccent="bg-teal-50"    iconColor="text-teal-600" loading={loading} />
      </div>

      {/* ── Approval Rate Ring + Breakdown ── */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Claim Success Rate</p>
            <div className="relative w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={14} data={radialData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" angleAxisId={0} cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-800">{stats.successRate}%</span>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${stats.successRate >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {stats.successRate >= 75 ? '✓ Good Rate' : '⚠ Needs Improvement'}
            </span>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-800">Claims Breakdown</h2>
            {[
              { label: 'Approved', value: claims.filter(c => c.status === 'APPROVED').length, total: claims.length, color: '#10b981' },
              { label: 'Pending',  value: claims.filter(c => c.status === 'PENDING').length,  total: claims.length, color: '#f59e0b' },
              { label: 'Denied',   value: claims.filter(c => c.status === 'DENIED').length,   total: claims.length, color: '#ef4444' },
            ].map(row => {
              const pct = row.total > 0 ? Math.round((row.value / row.total) * 100) : 0;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{row.label}</span>
                    <span className="font-bold text-slate-800">{row.value} claims <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: row.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filter Pills ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex gap-2 flex-wrap items-center">
        <Filter className="w-4 h-4 text-slate-400 ml-1" />
        {['ALL', 'APPROVED', 'PENDING', 'DENIED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === s ? 'bg-teal-600 text-white border-teal-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600'
            }`}
          >{s === 'ALL' ? 'All Claims' : s}</button>
        ))}
        <span className="ml-auto text-xs text-slate-400">{filtered.length} claims</span>
      </div>

      {/* ── Claims Table / Cards ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Insurance Claims</h2>
        </div>
        <div className="p-4">
          <ResponsiveTable
            loading={loading}
            data={filtered}
            rowKey="id"
            emptyText="No claims found"
            theadClass="bg-slate-50 border-b border-slate-100"
            rowHover="hover:bg-teal-50/40"
            columns={[
              { key: 'id',          label: 'Claim #',   render: (v) => <span className="font-mono text-xs text-slate-500">CLM-{String(v).padStart(4,'0')}</span> },
              { key: 'patientName', label: 'Patient',   render: (v) => <span className="font-semibold text-slate-800">{v || 'Unknown Patient'}</span> },
              { key: 'amount',      label: 'Amount',    className: 'text-right', render: (v) => <span className="font-bold text-slate-800 tabular-nums">{fmtUSD(v)}</span> },
              { key: 'submittedAt', label: 'Submitted', render: (v) => <span className="text-xs text-slate-400">{fmtDate(v)}</span> },
              {
                key: 'status',
                label: 'Status',
                render: (v) => (
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[v] ?? 'bg-slate-100 text-slate-600'}`}>
                    {v || 'PENDING'}
                  </span>
                ),
              },
            ]}
            getRowActions={(row) => (
              <>
                <button className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition">
                  <Eye className="w-3 h-3" />View
                </button>
                <button className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition">
                  Process
                </button>
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default InsuranceManagementPage;
