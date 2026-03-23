import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/auth';
import api from '../../services/api';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const AuditLogsPage = () => {
    const { user } = useContext(AuthContext);

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [filterType, setFilterType] = useState('ALL');
    const [filterValue, setFilterValue] = useState('');

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchLogs();
        } else {
            setLoading(false);
            toast.error("Unauthorized to view audit logs.");
        }
    }, [page, filterType, filterValue]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            let url = `/audit-logs?page=${page}&size=20`;
            
            if (filterType === 'organizationId' && filterValue) {
                url += `&organizationId=${filterValue}`;
            } else if (filterType === 'sectorId' && filterValue) {
                url += `&sectorId=${filterValue}`;
            } else if (filterType === 'userId' && filterValue) {
                url += `&userId=${filterValue}`;
            }

            const response = await api.get(url);
            setLogs(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
            toast.error("Failed to load audit logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterReset = () => {
        setFilterType('ALL');
        setFilterValue('');
        setPage(0);
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="space-y-6">
                <div className="alert alert-error">Unauthorized</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-error" />
                        Audit Trail
                    </h1>
                    <p className="text-base-content/60 mt-2">
                        System-wide immutable ledger of administrative actions and security events.
                    </p>
                </div>

                {/* Filters */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body py-4 px-6 flex flex-row items-center gap-4">
                        <select 
                            className="select select-bordered select-sm w-full max-w-xs"
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setFilterValue(''); setPage(0); }}
                        >
                            <option value="ALL">Show All Events</option>
                            <option value="organizationId">Filter by Organization ID</option>
                            <option value="sectorId">Filter by Sector ID</option>
                            <option value="userId">Filter by User ID</option>
                        </select>

                        {filterType !== 'ALL' && (
                            <input 
                                type="number" 
                                placeholder="Enter ID..." 
                                className="input input-bordered input-sm w-full max-w-xs"
                                value={filterValue}
                                onChange={(e) => { setFilterValue(e.target.value); setPage(0); }}
                            />
                        )}

                        {(filterType !== 'ALL' || filterValue !== '') && (
                            <button onClick={handleFilterReset} className="btn btn-sm btn-outline btn-error">
                                Clear Filters
                            </button>
                        )}
                        
                        <div className="flex-1"></div>
                        <button onClick={fetchLogs} className="btn btn-sm btn-ghost" disabled={loading}>
                            {loading ? <span className="loading loading-spinner text-primary loading-xs" /> : "Refresh"}
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full table-sm">
                            <thead className="bg-base-200 text-base-content font-bold">
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                    <th>User ID</th>
                                    <th>Target Resource</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12">
                                            <span className="loading loading-spinner loading-md text-primary"></span>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-base-content/40">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((logItem) => (
                                        <tr key={logItem.id} className="hover">
                                            <td className="whitespace-nowrap font-mono text-xs">
                                                {new Date(logItem.timestamp).toLocaleString()}
                                            </td>
                                            <td className="font-semibold text-xs">
                                                <div className="badge badge-neutral badge-sm">{logItem.action}</div>
                                            </td>
                                            <td>
                                                {logItem.status === 'SUCCESS' ? (
                                                    <span className="text-success text-xs font-bold">SUCCESS</span>
                                                ) : (
                                                    <div className="tooltip tooltip-right" data-tip={logItem.errorMessage || 'Failure'}>
                                                        <span className="text-error text-xs font-bold cursor-help border-b border-dashed border-error">
                                                            FAILURE
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="font-mono text-xs">{logItem.userId || 'System'}</td>
                                            <td className="text-xs">
                                                {logItem.resourceType && logItem.resourceId ? (
                                                    <>{logItem.resourceType}: <span className="font-mono">{logItem.resourceId}</span></>
                                                ) : '-'}
                                                {logItem.organizationId && ` (Org: ${logItem.organizationId})`}
                                            </td>
                                            <td className="font-mono text-xs text-base-content/60">{logItem.ipAddress || 'unknown'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="p-4 bg-base-100 border-t border-base-200 flex justify-between items-center">
                            <span className="text-sm text-base-content/60">
                                Page {page + 1} of {totalPages}
                            </span>
                            <div className="join">
                                <button 
                                    className="join-item btn btn-sm" 
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    « Prev
                                </button>
                                <button className="join-item btn btn-sm btn-disabled">
                                    {page + 1}
                                </button>
                                <button 
                                    className="join-item btn btn-sm" 
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next »
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditLogsPage;
