import { useEffect, useState, useCallback } from 'react';
import {
  Users, CreditCard, CheckCircle, AlertTriangle, XCircle,
  Search, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import api from '../../services/api';
import BankingKPICard from '../../components/banking/BankingKPICard';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

const statusConfig = {
  ACTIVE:    { label: 'Active',    classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle },
  SUSPENDED: { label: 'Suspended', classes: 'bg-amber-50 text-amber-700 border border-amber-200',    icon: AlertTriangle },
  CLOSED:    { label: 'Closed',    classes: 'bg-red-50 text-red-700 border border-red-200',           icon: XCircle },
};

const accountTypeColors = {
  SAVINGS:  'bg-blue-50 text-blue-700',
  CHECKING: 'bg-purple-50 text-purple-700',
  LOAN:     'bg-orange-50 text-orange-700',
  BUSINESS: 'bg-indigo-50 text-indigo-700',
};

function Initials({ name }) {
  const parts = (name || '').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0]?.[0] ?? '?');
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
      {initials.toUpperCase()}
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + (i * 13) % 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

const AccountManagementPage = () => {
  const [accounts, setAccounts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]         = useState('');

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/sectors/banking/accounts', { params: { page, size: 15 } });
      const payload = res.data?.data ?? res.data;
      setAccounts(payload?.content ?? []);
      setTotalPages(payload?.totalPages ?? 1);
    } catch {
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

  // KPI counts
  const kpis = {
    total:     accounts.length,
    active:    accounts.filter(a => a.status === 'ACTIVE').length,
    suspended: accounts.filter(a => a.status === 'SUSPENDED').length,
    closed:    accounts.filter(a => a.status === 'CLOSED').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 md:p-6 space-y-5 animate-fade-in-up">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Account Management</h1>
            <p className="text-blue-200 text-sm mt-0.5">All customer bank accounts across the system</p>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BankingKPICard title="Total Accounts"  value={loading ? '—' : kpis.total}     icon={Users}         iconBg="from-blue-600 to-indigo-700" />
        <BankingKPICard title="Active"          value={loading ? '—' : kpis.active}    icon={CheckCircle}   iconBg="from-emerald-500 to-teal-600" />
        <BankingKPICard title="Suspended"       value={loading ? '—' : kpis.suspended} icon={AlertTriangle} iconBg="from-amber-500 to-orange-500" />
        <BankingKPICard title="Closed"          value={loading ? '—' : kpis.closed}    icon={XCircle}       iconBg="from-red-500 to-rose-600" />
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or account number…"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {!loading && (
          <span className="text-sm text-slate-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <ResponsiveTable
          loading={loading}
          data={filtered}
          rowKey="id"
          emptyText="No accounts found"
          theadClass="bg-slate-50 border-b border-slate-100"
          rowHover="hover:bg-blue-50/40"
          columns={[
            {
              key: 'accountNumber',
              label: 'Account',
              render: (v) => <span className="font-mono text-xs text-slate-600">{v}</span>,
            },
            {
              key: 'customerName',
              label: 'Customer',
              render: (v) => (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(v || '?').split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">{v}</span>
                </div>
              ),
            },
            {
              key: 'accountType',
              label: 'Type',
              render: (v) => {
                const cls = { SAVINGS: 'bg-blue-50 text-blue-700', CHECKING: 'bg-purple-50 text-purple-700', LOAN: 'bg-orange-50 text-orange-700', BUSINESS: 'bg-indigo-50 text-indigo-700' }[v] || 'bg-slate-100 text-slate-600';
                return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{v}</span>;
              },
            },
            {
              key: 'balance',
              label: 'Balance',
              className: 'text-right',
              render: (v) => {
                const isNeg = (v ?? 0) < 0;
                return <span className={`font-bold tabular-nums text-sm ${isNeg ? 'text-red-600' : 'text-emerald-600'}`}>{isNeg ? '-' : ''}${Math.abs(v ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>;
              },
            },
            {
              key: 'status',
              label: 'Status',
              render: (v) => {
                const sc = statusConfig[v] || { label: v, classes: 'bg-slate-100 text-slate-600 border border-slate-200', icon: null };
                const StatusIcon = sc.icon;
                return (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                    {StatusIcon && <StatusIcon className="w-3 h-3" />}
                    {sc.label}
                  </span>
                );
              },
            },
            {
              key: 'createdAt',
              label: 'Created',
              render: (v) => <span className="text-slate-500 text-xs">{v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</span>,
            },
          ]}
        />

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagementPage;
