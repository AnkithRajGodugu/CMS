import { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import BankingKPICard from '../../components/banking/BankingKPICard';

const RISK_CONFIG = [
  {
    key:    'lowRisk',
    label:  'Low Risk',
    color:  '#10b981',
    bgFrom: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-400',
    badge:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
    icon:   ShieldCheck,
  },
  {
    key:    'mediumRisk',
    label:  'Medium Risk',
    color:  '#f59e0b',
    bgFrom: 'from-amber-500 to-orange-500',
    border: 'border-amber-400',
    badge:  'bg-amber-50 text-amber-700 border border-amber-200',
    icon:   Shield,
  },
  {
    key:    'highRisk',
    label:  'High Risk',
    color:  '#ef4444',
    bgFrom: 'from-red-500 to-rose-600',
    border: 'border-red-400',
    badge:  'bg-red-50 text-red-700 border border-red-200',
    icon:   AlertTriangle,
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-white shadow-lg rounded-xl px-4 py-2 border border-slate-100 text-sm">
      <p className="font-bold text-slate-800">{name}</p>
      <p className="text-slate-500">{value} accounts</p>
    </div>
  );
};

const RiskAssessmentPage = () => {
  const [risk, setRisk]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get('/sectors/banking/risk-assessment')
      .then(res => setRisk(res.data))
      .catch(() => setError('Failed to load risk data.'))
      .finally(() => setLoading(false));
  }, []);

  const pct = n => risk?.total > 0 ? Math.round((n / risk.total) * 100) : 0;

  const categories = risk ? RISK_CONFIG.map(c => ({
    ...c,
    count: risk[c.key] ?? 0,
    pct:   pct(risk[c.key] ?? 0),
  })) : [];

  const pieData = categories.map(c => ({ name: c.label, value: c.count }));

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Risk Assessment</h1>
            <p className="text-blue-200 text-sm mt-0.5">Account portfolio risk distribution overview</p>
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : risk ? (
        <>
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <BankingKPICard title="Total Accounts" value={risk.total} icon={PieIcon}      iconBg="from-blue-600 to-indigo-700" />
            {categories.map(c => (
              <BankingKPICard
                key={c.label}
                title={c.label}
                value={c.count}
                icon={c.icon}
                iconBg={c.bgFrom}
                subtitle={`${c.pct}% of portfolio`}
              />
            ))}
          </div>

          {/* ── Chart + Distribution ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-base font-bold text-slate-800 mb-4">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={3} dataKey="value">
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={RISK_CONFIG[idx]?.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => <span className="text-sm text-slate-600">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Bars */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <h2 className="text-base font-bold text-slate-800">Portfolio Breakdown</h2>
              {categories.map(c => (
                <div key={c.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <c.icon className="w-4 h-4" style={{ color: c.color }} />
                      <span className="font-medium text-slate-700">{c.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{c.count}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{c.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Detail Table ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Detailed Breakdown</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Risk Category', 'Account Count', 'Portfolio Share', 'Risk Level'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories.map(c => (
                  <tr key={c.label} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="font-medium text-slate-700">{c.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">{c.count}</td>
                    <td className="px-4 py-3 text-slate-600">{c.pct}%</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
                        <c.icon className="w-3 h-3" />
                        {c.label.split(' ')[0]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default RiskAssessmentPage;
