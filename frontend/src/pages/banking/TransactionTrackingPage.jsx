import { useEffect, useState, useCallback } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CreditCard,
  Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight,
  Activity, Filter
} from 'lucide-react';
import api from '../../services/api';

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
    <div className="min-h-screen bg-slate-50 p-6 space-y-6 animate-fade-in-up">

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

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['TXN ID', 'Account', 'Type', 'Amount', 'Status', 'Description', 'Date'].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${h === 'Amount' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                    <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">No transactions found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const sc = STATUS_CONFIG[t.status] || { label: t.status, classes: 'bg-slate-100 text-slate-600', icon: null };
                  const tc = TYPE_CONFIG[t.type] || { label: t.type, icon: ArrowLeftRight, color: 'text-slate-600', bg: 'bg-slate-100 text-slate-600' };
                  const StatusIcon = sc.icon;
                  const TypeIcon   = tc.icon;
                  const amount     = Number(t.amount || 0);
                  return (
                    <tr key={t.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{t.transactionId}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{t.accountNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tc.bg}`}>
                          <TypeIcon className="w-3 h-3" />
                          {tc.label}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-bold tabular-nums ${tc.color}`}>
                        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${sc.classes}`}>
                          {StatusIcon && <StatusIcon className="w-3 h-3" />}
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[180px] truncate">{t.description || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
              ><ChevronLeft className="w-4 h-4" /></button>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              ><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTrackingPage;
