import { useEffect, useState } from 'react';
import api from '../../services/api';

const MetricBar = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span className="font-bold">{value}%</span>
    </div>
    <div className="w-full bg-base-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const ComplianceToolsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/sectors/banking/compliance/metrics');
        setMetrics(res.data);
      } catch (e) {
        setError('Failed to load compliance metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const items = metrics ? [
    { label: 'AML Compliance',         value: metrics.amlCompliance,       color: 'bg-success' },
    { label: 'KYC Verification',        value: metrics.kycVerification,     color: 'bg-info' },
    { label: 'Risk Assessment Score',   value: metrics.riskAssessment,      color: 'bg-warning' },
    { label: 'Regulatory Reporting',    value: metrics.regulatoryReporting,  color: 'bg-primary' },
  ] : [];

  const overallScore = metrics
    ? Math.round((metrics.amlCompliance + metrics.kycVerification + metrics.riskAssessment + metrics.regulatoryReporting) / 4)
    : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Tools</h1>
        <p className="text-base-content/60 mt-1">Real-time regulatory compliance status</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Score */}
          <div className="lg:col-span-1 card bg-base-100 shadow-sm border border-base-200 p-6 flex flex-col items-center justify-center gap-3">
            <p className="text-base-content/60 text-sm font-medium uppercase tracking-wide">Overall Score</p>
            <div className={`radial-progress text-4xl font-extrabold ${overallScore >= 90 ? 'text-success' : overallScore >= 75 ? 'text-warning' : 'text-error'}`}
              style={{ '--value': overallScore, '--size': '9rem', '--thickness': '8px' }}>
              {overallScore}%
            </div>
            <span className={`badge ${overallScore >= 90 ? 'badge-success' : 'badge-warning'}`}>
              {overallScore >= 90 ? 'Compliant' : 'Needs Attention'}
            </span>
          </div>

          {/* Metric Bars */}
          <div className="lg:col-span-2 card bg-base-100 shadow-sm border border-base-200 p-6 space-y-5">
            <h2 className="text-lg font-bold">Metric Breakdown</h2>
            {items.map(item => (
              <MetricBar key={item.label} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Info Cards */}
      {!loading && metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.label} className="card bg-base-100 border border-base-200 p-4 text-center shadow-sm">
              <p className="text-3xl font-extrabold">{item.value}%</p>
              <p className="text-xs text-base-content/60 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplianceToolsPage;
