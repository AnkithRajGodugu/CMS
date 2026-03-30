import { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import BulkImportButton from '../../components/shared/BulkImportButton';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      // Corrected endpoint and params for Sector-scoped Customer API
      const res = await api.get('/v1/sectors/customers/paged', { 
        params: { 
          search: search || null,
          page: page, 
          size: 15 
        } 
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-base-content/60 mt-1">Banking sector customer registry</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <BulkImportButton onComplete={fetchCustomers} />
          <ReportExportButtons sectorCode="BANKING" />
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or email…"
        className="input input-bordered w-full max-w-md"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-10"><span className="loading loading-spinner" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-base-content/50">No customers found</td></tr>
            ) : filtered.map((c, i) => (
              <tr key={c.id}>
                <td>{page * 15 + i + 1}</td>
                <td className="font-semibold">{c.firstName} {c.lastName}</td>
                <td>{c.email || '—'}</td>
                <td>{c.phone || '—'}</td>
                <td className="text-sm text-base-content/60">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
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

export default CustomersPage;
