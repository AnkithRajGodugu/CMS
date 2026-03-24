import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { FaServer, FaDatabase, FaBolt, FaExclamationTriangle } from 'react-icons/fa';

const SystemMetricsWidget = () => {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch if user is an ADMIN
        if (user?.role !== 'ADMIN') return;

        const fetchMetrics = async () => {
            try {
                const response = await api.get('/metrics/summary');
                setMetrics(response.data);
            } catch (error) {
                console.error('Failed to load system metrics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        // optionally poll every 30s
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, [user]);

    if (user?.role !== 'ADMIN') return null;
    if (loading) return <div className="skeleton h-32 w-full rounded-2xl"></div>;
    if (!metrics) return null;

    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 mb-6">
            <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FaServer className="text-secondary text-xl" />
                    <h2 className="card-title text-xl">System Performance (Live)</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* API Requests */}
                    <div className="stat bg-base-200/50 rounded-xl p-4 border border-base-300">
                        <div className="stat-figure text-primary">
                            <FaBolt className="text-2xl" />
                        </div>
                        <div className="stat-title text-sm font-semibold">Total Requests</div>
                        <div className="stat-value text-2xl">{metrics.totalRequests?.toLocaleString()}</div>
                        <div className="stat-desc text-xs mt-1">
                            <span className={metrics.slowRequestPercentage === "0.00%" ? "text-success" : "text-warning"}>
                                {metrics.slowRequestPercentage} slow
                            </span>
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div className="stat bg-base-200/50 rounded-xl p-4 border border-base-300">
                        <div className="stat-figure text-secondary">
                            <FaServer className="text-2xl" />
                        </div>
                        <div className="stat-title text-sm font-semibold">Tracked Endpoints</div>
                        <div className="stat-value text-2xl">{metrics.totalEndpoints}</div>
                        <div className="stat-desc text-xs mt-1">Actively monitored</div>
                    </div>

                    {/* Database Queries */}
                    <div className="stat bg-base-200/50 rounded-xl p-4 border border-base-300">
                        <div className="stat-figure text-accent">
                            <FaDatabase className="text-2xl" />
                        </div>
                        <div className="stat-title text-sm font-semibold">DB Queries</div>
                        <div className="stat-value text-2xl">{metrics.totalQueries?.toLocaleString()}</div>
                        <div className="stat-desc text-xs mt-1">
                            <span className={metrics.slowQueryPercentage === "0.00%" ? "text-success" : "text-warning"}>
                                {metrics.slowQueryPercentage} slow
                            </span>
                        </div>
                    </div>

                    {/* Query Types */}
                    <div className="stat bg-base-200/50 rounded-xl p-4 border border-base-300">
                        <div className="stat-figure text-error">
                            <FaExclamationTriangle className="text-2xl opacity-80" />
                        </div>
                        <div className="stat-title text-sm font-semibold">Slow Queries</div>
                        <div className="stat-value text-2xl">{metrics.totalSlowQueries?.toLocaleString() || 0}</div>
                        <div className="stat-desc text-xs mt-1">Exceeding 500ms</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemMetricsWidget;
