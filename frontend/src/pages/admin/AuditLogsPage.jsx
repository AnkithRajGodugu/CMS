import { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { AuthContext } from '../../context/auth';
import api from '../../services/api';
import DataTable from '../../components/shared/DataTable';

const STATUS_COLORS = {
  SUCCESS: 'badge-success',
  FAILURE: 'badge-error',
  PENDING: 'badge-warning',
};

const AuditLogsPage = () => {
  const { isAdmin } = useContext(AuthContext);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const pageSize = 20;

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/sectors/audit/logs', {
        params: { page, size: pageSize },
      });
      const data = res.data;
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      !q ||
      String(log.userId).includes(q) ||
      (log.action || '').toLowerCase().includes(q) ||
      (log.resourceType || '').toLowerCase().includes(q) ||
      (log.status || '').toLowerCase().includes(q)
    );
  });

  const columns = [
    { 
      key: 'timestamp', 
      label: 'Timestamp', 
      render: (val) => val ? new Date(val).toLocaleString() : '—' 
    },
    { key: 'userId', label: 'User ID' },
    { key: 'action', label: 'Action', render: (val) => <span className="font-mono text-xs">{val}</span> },
    { key: 'resourceType', label: 'Resource' },
    { key: 'resourceId', label: 'Res ID', render: (val) => <span className="text-xs">{val}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (val) => (
        <span className={`badge badge-sm ${STATUS_COLORS[val] || 'badge-ghost'}`}>
          {val}
        </span>
      )
    },
    { key: 'ipAddress', label: 'IP Address', render: (val) => <span className="text-xs">{val}</span> },
  ];

  if (!isAdmin()) {
    return (
      <DashboardLayout>
        <div className="alert alert-error">
          <span>⛔ Access Denied — Admins only.</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Audit Trail</h1>
            <p className="text-base-content/70">Track all system events and user actions</p>
          </div>
          <button className="btn btn-outline" onClick={fetchLogs}>
            🔄 Refresh
          </button>
        </div>

        {/* Search */}
        <div className="form-control w-full max-w-sm">
          <input
            id="audit-search"
            type="text"
            placeholder="Search by user, action, resource, status…"
            className="input input-bordered w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DataTable
          data={logs}
          columns={columns}
          serverSide={true}
          totalItems={totalPages * pageSize} // Estimate total elements if not explicitly returned
          pageSize={pageSize}
          currentPage={page + 1}
          onPageChange={(p) => setPage(p - 1)}
          searchable={false} // We have a custom search bar above
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
};

export default AuditLogsPage;
