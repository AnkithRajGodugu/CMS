import { useEffect, useState, useCallback } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CreditCard,
  Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Activity, Filter
} from 'lucide-react';
import api from '../../services/api';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

const STATUS_CONFIG = {
  COMPLETED: { label: 'Completed', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle2 },
  PENDING:   { label: 'Pending',   classes: 'bg-amber-50 text-amber-700 border border-amber-200',    icon: Clock },
  FAILED:    { label: 'Failed',    classes: 'bg-red-50 text-red-700 border border-red-200',           icon: XCircle },
};

const TYPE_CONFIG = {
  DEPOSIT:    { label: 'Deposit',    icon: ArrowDownLeft,  color: 'text-emerald-600', bg: 'bg-emerald-50 text-emerald-700' },
  WITHDRAWAL: { label: 'Withdrawal', icon: ArrowUpRight,   color: 'text-red-600',     bg: 'bg-red-50 text-red-700' },
  TRANSFER:   { label: 'Transfer',   icon: ArrowLeftRight, color: 'text-blue-600',    bg: 'bg-blue-50 text-blue-700' },
  PAYMENT:    { label: 'Payment',    icon: CreditCard,     color: 'text-purple-600',  bg: 'bg-purple-50 text-purple-700' },
};

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${55 + (i * 11) % 35}%` }} />
        </td>
      ))}
    </tr>
  );
}

const FILTERS = ['ALL', 'COMPLETED', 'PENDING', 'FAILED'];

const TransactionTrackingPage = () => {
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
      const res = await api.get('/sectors/banking/transactions', { params: { page, size: 20 } });
      const payload = res.data?.data ?? res.data;
      setTransactions(payload?.content ?? []);
      setTotalPages(payload?.totalPages ?? 1);
    } catch {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const filtered = statusFilter === 'ALL' ? transactions : transactions.filter(t => t.status === statusFilter);

  const totalVolume = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 md:p-6 space-y-5 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Transaction Tracking</h1>
            <p className="text-blue-200 text-sm mt-0.5">All transactions across all accounts</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Total Transactions', value: transactions.length },
            { label: 'Completed',          value: completedCount },
            { label: 'Total Volume',       value: `$${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl px-4 py-3">
              <p className="text-blue-200 text-xs font-medium">{label}</p>
              <p className="text-white font-bold text-lg tabular-nums">{loading ? '—' : value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400" />
        {FILTERS.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              statusFilter === s
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {s === 'ALL' ? 'All' : STATUS_CONFIG[s]?.label ?? s}
          </button>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <XCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4">
          <ResponsiveTable
            loading={loading}
            data={filtered}
            rowKey="id"
            emptyText="No transactions found"
            theadClass="bg-slate-50 border-b border-slate-100"
            rowHover="hover:bg-blue-50/40"
            columns={[
              { key: 'transactionId', label: 'TXN ID', render: (v) => <span className="font-mono text-xs text-slate-500">{v}</span> },
              { key: 'accountNumber', label: 'Account', render: (v) => <span className="font-mono text-xs text-slate-600">{v}</span> },
              {
                key: 'type',
                label: 'Type',
                render: (v) => {
                  const tc = TYPE_CONFIG[v] || { label: v, icon: ArrowLeftRight, bg: 'bg-slate-100 text-slate-600' };
                  const TypeIcon = tc.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tc.bg}`}>
                      <TypeIcon className="w-3 h-3" />{tc.label}
                    </span>
                  );
                },
              },
              {
                key: 'amount',
                label: 'Amount',
                className: 'text-right',
                render: (v, row) => {
                  const tc = TYPE_CONFIG[row.type];
                  return <span className={`font-bold tabular-nums text-sm ${tc?.color || 'text-slate-700'}`}>${Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>;
                },
              },
              {
                key: 'status',
                label: 'Status',
                render: (v) => {
                  const sc = STATUS_CONFIG[v] || { label: v, classes: 'bg-slate-100 text-slate-600', icon: null };
                  const StatusIcon = sc.icon;
                  return (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                      {StatusIcon && <StatusIcon className="w-3 h-3" />}{sc.label}
                    </span>
                  );
                },
              },
              { key: 'description', label: 'Description', render: (v) => <span className="text-slate-500 text-xs line-clamp-1">{v || '—'}</span> },
              { key: 'createdAt', label: 'Date', render: (v) => <span className="text-xs text-slate-400 whitespace-nowrap">{v ? new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span> },
            ]}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTrackingPage;
