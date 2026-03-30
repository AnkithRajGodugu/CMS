import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

// Status badge style helper
const statusBadge = (status) => {
  const map = { ACTIVE: 'badge-success', SUSPENDED: 'badge-warning', CLOSED: 'badge-error' };
  return `badge ${map[status] || 'badge-neutral'}`;
};

const AccountManagementPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [page, setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]   = useState('');

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sectors/banking/accounts', { params: { page, size: 15 } });
      const payload = res.data?.data ?? res.data;
      setAccounts(payload?.content ?? []);
      setTotalPages(payload?.totalPages ?? 1);
    } catch (e) {
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  const filtered = accounts.filter(a =>
    a.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    a.accountNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Account Management</h1>
          <p className="text-base-content/60 mt-1">All customer bank accounts across the system</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or account number…"
        className="input input-bordered w-full max-w-md"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8"><span className="loading loading-spinner loading-md" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-base-content/50">No accounts found</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td className="font-mono text-sm">{a.accountNumber}</td>
                <td className="font-semibold">{a.customerName}</td>
                <td><span className="badge badge-outline">{a.accountType}</span></td>
                <td className={`font-bold ${a.balance >= 0 ? 'text-success' : 'text-error'}`}>
                  ${Math.abs(a.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td><span className={statusBadge(a.status)}>{a.status}</span></td>
                <td className="text-sm text-base-content/60">
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default AccountManagementPage;
