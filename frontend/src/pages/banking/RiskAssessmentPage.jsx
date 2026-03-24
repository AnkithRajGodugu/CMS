import { useEffect, useState } from 'react';
import api from '../../services/api';

const RiskAssessmentPage = () => {
  const [risk, setRisk]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/sectors/banking/risk-assessment');
        setRisk(res.data);
      } catch (e) {
        setError('Failed to load risk data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const pct = (n) => risk?.total > 0 ? Math.round((n / risk.total) * 100) : 0;

  const categories = risk ? [
    { label: 'Low Risk',    count: risk.lowRisk,    pct: pct(risk.lowRisk),    color: 'bg-success', badge: 'badge-success' },
    { label: 'Medium Risk', count: risk.mediumRisk, pct: pct(risk.mediumRisk), color: 'bg-warning', badge: 'badge-warning' },
    { label: 'High Risk',   count: risk.highRisk,   pct: pct(risk.highRisk),   color: 'bg-error',   badge: 'badge-error'   },
  ] : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Risk Assessment</h1>
        <p className="text-base-content/60 mt-1">Account portfolio risk distribution</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg" /></div>
      ) : risk ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card bg-base-100 shadow-sm border border-base-200 p-5 text-center">
              <p className="text-4xl font-extrabold">{risk.total}</p>
              <p className="text-sm text-base-content/60 mt-1">Total Accounts</p>
            </div>
            {categories.map(c => (
              <div key={c.label} className="card bg-base-100 shadow-sm border border-base-200 p-5 text-center">
                <p className="text-4xl font-extrabold">{c.count}</p>
                <p className="text-sm text-base-content/60 mt-1">{c.label}</p>
                <span className={`badge mt-2 ${c.badge}`}>{c.pct}%</span>
              </div>
            ))}
          </div>

          {/* Visual Distribution Bar */}
          <div className="card bg-base-100 shadow-sm border border-base-200 p-6 space-y-4">
            <h2 className="text-lg font-bold">Risk Distribution</h2>
            <div className="w-full flex h-8 rounded-full overflow-hidden">
              {categories.map(c => (
                <div
                  key={c.label}
                  className={`${c.color} transition-all duration-700 flex items-center justify-center text-xs font-bold text-white`}
                  style={{ width: `${c.pct}%` }}
                  title={`${c.label}: ${c.count} (${c.pct}%)`}
                >
                  {c.pct > 10 ? `${c.pct}%` : ''}
                </div>
              ))}
            </div>
            <div className="flex gap-6 text-sm">
              {categories.map(c => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${c.color}`} />
                  <span>{c.label} ({c.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Breakdown Table */}
          <div className="card bg-base-100 shadow-sm border border-base-200 p-6">
            <h2 className="text-lg font-bold mb-4">Detailed Breakdown</h2>
            <table className="table w-full">
              <thead>
                <tr><th>Category</th><th>Count</th><th>Portfolio %</th><th>Risk Level</th></tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.label}>
                    <td>{c.label}</td>
                    <td className="font-bold">{c.count}</td>
                    <td>{c.pct}%</td>
                    <td><span className={`badge ${c.badge}`}>{c.label.split(' ')[0]}</span></td>
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
