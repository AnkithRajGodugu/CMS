import { useState, useEffect } from 'react';
import { getMyInsurance } from '../../../services/healthcareService';
import { useAuth } from '../../../hooks/useAuth';

const STATUS_BADGE = {
  APPROVED: 'badge-success',
  PENDING:  'badge-warning',
  DENIED:   'badge-error',
};

const MyInsurancePage = () => {
  const { user } = useAuth();
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInsurance()
      .then(res => {
        const data = res.data ?? [];
        // Support both array and object with claims property
        setClaims(Array.isArray(data) ? data : (data.claims ?? []));
      })
      .catch(err => console.error('Failed to load insurance:', err))
      .finally(() => setLoading(false));
  }, []);

  const approved = claims.filter(c => c.status === 'APPROVED');
  const pending  = claims.filter(c => c.status === 'PENDING');
  const denied   = claims.filter(c => c.status === 'DENIED');
  const totalAmt   = claims.reduce((s, c) => s + (c.amount ?? 0), 0);
  const approvedAmt = approved.reduce((s, c) => s + (c.amount ?? 0), 0);

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—';
  const fmtCur  = (n)   => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Insurance & Billing</h1>
        <p className="text-base-content/60">Your personal coverage summary and claim history.</p>
      </div>

      {/* Policy Card (static display — per-user policy is a future upgrade) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl h-fit">
          <div className="card-body">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-sm uppercase tracking-wider opacity-80 font-semibold mb-1">Active Policy</h2>
                <h3 className="text-2xl font-bold">BlueCross BlueShield</h3>
                <p className="opacity-90">PPO Standard Plan</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs opacity-70 uppercase tracking-wider">Member ID</p>
                <p className="font-mono mt-1">MBR-{String(user?.id ?? '0000').padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-xs opacity-70 uppercase tracking-wider">Total Claims</p>
                <p className="font-mono mt-1">{loading ? '—' : claims.length}</p>
              </div>
            </div>
            <div className="divider bg-white/20 h-px my-4" />
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-80">Approved Amount</span>
              <span className="font-bold border border-white/30 px-3 py-1 rounded-full">
                {loading ? '—' : fmtCur(approvedAmt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          {[
            { label: 'Total Claims', value: loading ? '—' : claims.length, color: 'text-blue-600' },
            { label: 'Approved', value: loading ? '—' : `${approved.length} (${fmtCur(approvedAmt)})`, color: 'text-success' },
            { label: 'Pending Review', value: loading ? '—' : pending.length, color: 'text-warning' },
            { label: 'Denied', value: loading ? '—' : denied.length, color: 'text-error' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card bg-base-100 shadow-sm border border-base-200 p-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-base-content/60">{label}</p>
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Insurance Claims</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10">
                    <span className="loading loading-spinner loading-md" />
                  </td></tr>
                ) : claims.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-base-content/40">
                    No insurance claims found.
                  </td></tr>
                ) : claims.map(c => (
                  <tr key={c.id} className="hover">
                    <td className="font-mono text-xs">CLM-{String(c.id).padStart(4, '0')}</td>
                    <td className="font-medium">{c.description || c.claimType || 'General Claim'}</td>
                    <td className="font-bold">{fmtCur(c.amount)}</td>
                    <td>{fmtDate(c.submittedAt)}</td>
                    <td>
                      <span className={`badge badge-sm ${STATUS_BADGE[c.status] ?? 'badge-info'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInsurancePage;
