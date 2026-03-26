import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserLogisticsDashboardStats, getMyShipments } from '../../../services/logisticsService';

const LogisticsUserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, shipmentsRes] = await Promise.all([
                    getUserLogisticsDashboardStats(),
                    getMyShipments()
                ]);

                if (statsRes.data?.success) {
                    setStats(statsRes.data.data);
                }
                if (shipmentsRes.data?.success) {
                    setShipments(shipmentsRes.data.data.content || []);
                }
            } catch (err) {
                console.error('Error fetching logistics dashboard data:', err);
                setError('Failed to load logistics data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const outForDelivery = shipments.filter(s => s.status === 'OUT_FOR_DELIVERY' || s.status === 'out_for_delivery');
    const otherShipments = shipments.filter(s => s.status !== 'OUT_FOR_DELIVERY' && s.status !== 'out_for_delivery');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Logistics Dashboard</h1>
                    <p className="text-base-content/60">Manage your {shipments.length} active shipments and view recent orders.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="join w-full">
                        <input className="input input-bordered join-item flex-1" placeholder="Tracking ID..." />
                        <Link to="/user/logistics/track" className="btn btn-primary join-item">Track</Link>
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-figure text-primary">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="stat-title text-xs sm:text-sm">Active Shipments</div>
                    <div className="stat-value text-primary text-2xl sm:text-4xl">{stats?.totalShipments || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-figure text-success">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="stat-title text-xs sm:text-sm">Delivered</div>
                    <div className="stat-value text-success text-2xl sm:text-4xl">{stats?.delivered || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-figure text-warning">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="stat-title text-xs sm:text-sm">In Transit</div>
                    <div className="stat-value text-warning text-2xl sm:text-4xl">{stats?.inTransit || 0}</div>
                </div>
                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-figure text-info">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div className="stat-title text-xs sm:text-sm">Pending</div>
                    <div className="stat-value text-info text-2xl sm:text-4xl">{stats?.pending || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Out for Delivery Today */}
                <div className="card bg-gradient-to-br from-primary to-primary-focus text-primary-content shadow-xl h-fit">
                    <div className="card-body">
                        <h2 className="card-title text-sm opacity-90 uppercase tracking-widest font-semibold flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            Out for Delivery Today
                        </h2>
                        
                        {outForDelivery.length > 0 ? (
                            outForDelivery.map(s => (
                                <div key={s.id} className="mt-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{s.trackingId}</h3>
                                            <p className="text-sm opacity-80 mt-1">To: {s.destination || 'N/A'}</p>
                                        </div>
                                        <div className="badge border-white/40 bg-white/20 text-white gap-2 font-medium">
                                            Today
                                        </div>
                                    </div>
                                    <Link to={`/user/logistics/track?id=${s.trackingId}`} className="btn btn-sm w-full bg-white text-primary hover:bg-gray-100 border-none font-bold mt-4">
                                        View Live Map
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10 text-center opacity-70 italic text-sm">
                                No shipments out for delivery today.
                            </div>
                        )}
                    </div>
                </div>

                {/* Other Active Shipments List */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="card-title text-base sm:text-lg">Recent Shipments</h2>
                            <Link to="/user/logistics/track" className="btn btn-ghost btn-xs text-primary">View All</Link>
                        </div>
                        
                        <div className="space-y-3 mt-2">
                            {otherShipments.slice(0, 3).map((s) => (
                                <div key={s.id} className="flex justify-between items-center p-3 border border-base-200 rounded-lg bg-base-200/30 hover:bg-base-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{s.trackingId}</h4>
                                            <p className="text-xs text-base-content/60">Dest: {s.destination}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`badge badge-sm ${s.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {otherShipments.length === 0 && (
                                <p className="text-sm text-center opacity-40 py-10">No other active shipments.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsUserDashboard;
