import { useEffect, useState, useCallback } from 'react';
import { Users, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import BankingKPICard from '../../components/banking/BankingKPICard';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import BulkImportButton from '../../components/shared/BulkImportButton';
import ResponsiveTable from '../../components/shared/ResponsiveTable';

function Initials({ name }) {
  const parts = (name || '').split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : (parts[0]?.[0] ?? '?');
  const colors = ['from-blue-600 to-indigo-700', 'from-violet-600 to-purple-700', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-teal-600'];
  const colorIdx = (name || '').charCodeAt(0) % colors.length;
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none`}>
      {initials.toUpperCase()}
    </div>
  );
}

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-slate-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${55 + (i * 13) % 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

const CustomersPage = () => {
  const [customers, setCustomers]   = useState([]);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/sectors/customers/paged', {
        params: { search: search || null, page, size: 15 }
      });
      const payload = res.data?.data ?? res.data;
      setCustomers(payload?.content ?? []);
      setTotalPages(payload?.totalPages ?? 1);
    } catch (e) {
      console.error('Error fetching customers:', e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-5 md:p-6 space-y-5 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Customers</h1>
              <p className="text-blue-200 text-sm mt-0.5">Banking sector customer registry</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <BulkImportButton onComplete={fetchCustomers} />
            <ReportExportButtons sectorCode="BANKING" />
          </div>
        </div>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BankingKPICard title="Total Customers" value={loading ? '—' : customers.length} icon={Users} iconBg="from-blue-600 to-indigo-700" />
        <BankingKPICard title="Showing" value={loading ? '—' : filtered.length} icon={Search} iconBg="from-cyan-500 to-blue-600" subtitle="Results on this page" />
        <BankingKPICard title="Page" value={`${page + 1} / ${totalPages}`} icon={ChevronRight} iconBg="from-violet-600 to-purple-700" />
      </div>

      {/* ── Search ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email…"
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
      </div>

      {/* ── Table / Cards ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4">
          <ResponsiveTable
            loading={loading}
            data={filtered}
            rowKey="id"
            emptyText="No customers found"
            theadClass="bg-slate-50 border-b border-slate-100"
            rowHover="hover:bg-blue-50/40"
            columns={[
              {
                key: 'firstName',
                label: 'Name',
                render: (v, row) => {
                  const name = `${row.firstName ?? ''} ${row.lastName ?? ''}`.trim();
                  const colors = ['from-blue-600 to-indigo-700', 'from-violet-600 to-purple-700', 'from-cyan-500 to-blue-600', 'from-emerald-500 to-teal-600'];
                  const idx = (name || '').charCodeAt(0) % colors.length;
                  return (
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {name.split(' ').filter(Boolean).map(p => p[0]).slice(0,2).join('').toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{name}</span>
                    </div>
                  );
                },
              },
              { key: 'email',     label: 'Email',  render: (v) => <span className="text-slate-600 text-sm">{v || '—'}</span> },
              { key: 'phone',     label: 'Phone',  render: (v) => <span className="text-slate-600">{v || '—'}</span> },
              { key: 'createdAt', label: 'Joined', render: (v) => <span className="text-xs text-slate-400">{v ? new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</span> },
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

export default CustomersPage;
