import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';

const statusClass = (s) => ({ COMPLETED: 'badge-success', PENDING: 'badge-warning', FAILED: 'badge-error' }[s] || 'badge-neutral');
const typeColor   = (t) => ({ DEPOSIT: 'text-success', WITHDRAWAL: 'text-error', TRANSFER: 'text-info', PAYMENT: 'text-warning' }[t] || '');

const BankingTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sectors/banking/my-transactions', { params: { page, size: 20 } });
      const payload = res.data?.data;
      setTransactions(payload?.content ?? []);
      setTotalPages(payload?.totalPages ?? 1);
    } catch (e) {
      setError('Failed to load your transactions.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filtered = statusFilter === 'ALL'
    ? transactions
    : transactions.filter(t => t.status === statusFilter);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Transactions</h1>
        <p className="text-base-content/60 mt-1">All activity across your linked accounts</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['ALL', 'COMPLETED', 'PENDING', 'FAILED'].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setStatusFilter(s); setPage(0); }}
          >{s}</button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr><th>TXN ID</th><th>Account</th><th>Type</th><th>Amount</th><th>Status</th><th>Description</th><th>Date</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10"><span className="loading loading-spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-base-content/40">No transactions found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id}>
                <td className="font-mono text-xs">{t.transactionId}</td>
                <td className="font-mono text-sm">{t.accountNumber}</td>
                <td className={`font-semibold ${typeColor(t.type)}`}>{t.type}</td>
                <td className="font-bold">${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td><span className={`badge badge-sm ${statusClass(t.status)}`}>{t.status}</span></td>
                <td className="text-sm max-w-[180px] truncate">{t.description}</td>
                <td className="text-sm text-base-content/60">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button className="btn btn-sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>«</button>
          <span className="btn btn-sm btn-disabled">Page {page + 1} / {totalPages}</span>
          <button className="btn btn-sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>»</button>
        </div>
      )}
    </div>
  );
};

export default BankingTransactionsPage;
