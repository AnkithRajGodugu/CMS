import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const BankingStatementsPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [from, setFrom]           = useState(thirtyDaysAgo);
  const [to, setTo]               = useState(today);
  const [transactions, setTxns]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchStatements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sectors/banking/my-statements', { params: { from, to } });
      setTxns(res.data ?? []);
    } catch (e) {
      setError('Failed to load statements.');
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => { fetchStatements(); }, [fetchStatements]);

  const totalIn  = transactions.filter(t => ['DEPOSIT'].includes(t.type) && t.status === 'COMPLETED').reduce((s, t) => s + Number(t.amount), 0);
  const totalOut = transactions.filter(t => ['WITHDRAWAL', 'PAYMENT', 'TRANSFER'].includes(t.type) && t.status === 'COMPLETED').reduce((s, t) => s + Number(t.amount), 0);

  const typeColor = (t) => ({ DEPOSIT: 'text-success', WITHDRAWAL: 'text-error', TRANSFER: 'text-info', PAYMENT: 'text-warning' }[t] || '');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account Statements</h1>
        <p className="text-base-content/60 mt-1">Filter transactions by date range</p>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-end gap-4 card bg-base-100 border border-base-200 p-5 shadow-sm">
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">From</span></label>
          <input type="date" className="input input-bordered" value={from} onChange={e => setFrom(e.target.value)} max={to} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text font-medium">To</span></label>
          <input type="date" className="input input-bordered" value={to} onChange={e => setTo(e.target.value)} min={from} max={today} />
        </div>
        <button className="btn btn-primary" onClick={fetchStatements} disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm" /> : 'Apply'}
        </button>
      </div>

      {/* Summary */}
      {!loading && transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card bg-base-100 border border-base-200 shadow-sm p-4 text-center">
            <p className="text-sm text-base-content/60">Total Transactions</p>
            <p className="text-3xl font-extrabold">{transactions.length}</p>
          </div>
          <div className="card bg-base-100 border border-base-200 shadow-sm p-4 text-center">
            <p className="text-sm text-base-content/60">Money In</p>
            <p className="text-3xl font-extrabold text-success">+${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="card bg-base-100 border border-base-200 shadow-sm p-4 text-center">
            <p className="text-sm text-base-content/60">Money Out</p>
            <p className="text-3xl font-extrabold text-error">-${totalOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr><th>Date</th><th>TXN ID</th><th>Account</th><th>Type</th><th>Amount</th><th>Description</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10"><span className="loading loading-spinner" /></td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-base-content/40">No transactions in this period</td></tr>
            ) : transactions.map(t => (
              <tr key={t.id}>
                <td className="text-sm">{new Date(t.createdAt).toLocaleDateString()}</td>
                <td className="font-mono text-xs">{t.transactionId}</td>
                <td className="font-mono text-sm">{t.accountNumber}</td>
                <td className={`font-semibold ${typeColor(t.type)}`}>{t.type}</td>
                <td className="font-bold">${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td className="text-sm max-w-[180px] truncate">{t.description}</td>
                <td><span className={`badge badge-sm ${t.status === 'COMPLETED' ? 'badge-success' : t.status === 'PENDING' ? 'badge-warning' : 'badge-error'}`}>{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankingStatementsPage;
