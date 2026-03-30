import { useEffect, useState } from 'react';
import {
  ShieldCheck, FileCheck, AlertOctagon, BarChart3,
  CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis
} from 'recharts';
import api from '../../services/api';

const METRIC_ITEMS = [
  { key: 'amlCompliance',       label: 'AML Compliance',       color: '#10b981', icon: ShieldCheck,  bgFrom: 'from-emerald-500 to-teal-600' },
  { key: 'kycVerification',     label: 'KYC Verification',     color: '#3b82f6', icon: FileCheck,    bgFrom: 'from-blue-500 to-cyan-600' },
  { key: 'riskAssessment',      label: 'Risk Assessment Score', color: '#f59e0b', icon: AlertOctagon, bgFrom: 'from-amber-500 to-orange-500' },
  { key: 'regulatoryReporting', label: 'Regulatory Reporting',  color: '#6366f1', icon: BarChart3,    bgFrom: 'from-indigo-500 to-purple-600' },
];

function StatusChip({ score }) {
  if (score >= 90) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" />Compliant</span>;
  if (score >= 75) return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><AlertTriangle className="w-3 h-3" />Needs Attention</span>;
  return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><XCircle className="w-3 h-3" />Non-Compliant</span>;
}

const ComplianceToolsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get('/sectors/banking/compliance/metrics')
      .then(res => setMetrics(res.data))
      .catch(() => setError('Failed to load compliance metrics.'))
      .finally(() => setLoading(false));
  }, []);

  const items = metrics
    ? METRIC_ITEMS.map(m => ({ ...m, value: metrics[m.key] ?? 0 }))
    : [];

  const overallScore = metrics
    ? Math.round((metrics.amlCompliance + metrics.kycVerification + metrics.riskAssessment + metrics.regulatoryReporting) / 4)
    : 0;

  const radialData = [{ name: 'Score', value: overallScore, fill: overallScore >= 90 ? '#10b981' : overallScore >= 75 ? '#f59e0b' : '#ef4444' }];

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Compliance Tools</h1>
            <p className="text-blue-200 text-sm mt-0.5">Real-time regulatory compliance status</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
          <div className="lg:col-span-2 bg-white rounded-2xl h-64 animate-pulse border border-slate-100" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Overall Score Radial ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Overall Compliance Score</p>
              <div className="relative w-44 h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="70%" outerRadius="100%"
                    barSize={14}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: '#f1f5f9' }} dataKey="value" angleAxisId={0} cornerRadius={8} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-extrabold text-slate-800">{overallScore}%</span>
                </div>
              </div>
              <StatusChip score={overallScore} />
            </div>

            {/* ── Metric Bars ── */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <h2 className="text-base font-bold text-slate-800">Metric Breakdown</h2>
              {items.map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Info Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className={`h-1.5 bg-gradient-to-r ${item.bgFrom}`} />
                <div className="p-4 flex flex-col items-center text-center gap-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}18` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{item.value}%</p>
                  <p className="text-xs text-slate-500 leading-snug">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ComplianceToolsPage;
