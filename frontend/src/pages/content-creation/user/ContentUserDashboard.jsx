import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserContentDashboardStats, getMyProjects } from '../../../services/contentService';

const ContentUserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, projectsRes] = await Promise.all([
                    getUserContentDashboardStats(),
                    getMyProjects()
                ]);

                if (statsRes.data?.success) {
                    setStats(statsRes.data.data);
                }
                if (projectsRes.data?.success) {
                    setProjects(projectsRes.data.data.content || []);
                }
            } catch (err) {
                console.error('Error fetching content dashboard data:', err);
                setError('Failed to load content data.');
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

    const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'in_progress');

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Content Dashboard</h1>
                    <p className="text-base-content/60">Manage your {projects.length} projects and upcoming deadlines.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="btn btn-primary sm:w-auto w-full shadow-lg shadow-primary/30">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        New Project
                    </button>
                </div>
            </div>

            {/* Top Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-base-100 shadow border border-base-200">
                    <div className="card-body p-4 sm:p-6 text-center">
                        <div className="text-3xl font-bold text-primary">{stats?.totalProjects || 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-70 mt-1">Total Projects</div>
                    </div>
                </div>
                <div className="card bg-base-100 shadow border border-base-200">
                    <div className="card-body p-4 sm:p-6 text-center">
                        <div className="text-3xl font-bold text-warning">{stats?.inProgress || 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-70 mt-1">In Progress</div>
                    </div>
                </div>
                <div className="card bg-base-100 shadow border border-base-200">
                    <div className="card-body p-4 sm:p-6 text-center">
                        <div className="text-3xl font-bold text-success">{stats?.completed || 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-70 mt-1">Completed</div>
                    </div>
                </div>
                <div className="card bg-base-100 shadow border border-base-200">
                    <div className="card-body p-4 sm:p-6 text-center">
                        <div className="text-3xl font-bold text-info">{stats?.archived || 0}</div>
                        <div className="text-xs uppercase tracking-wide opacity-70 mt-1">Archived</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Tasks Highlight */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-200">
                        <div className="card-body">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="card-title text-lg">In Progress Projects</h2>
                                <Link to="/user/content/projects" className="btn btn-ghost btn-xs text-primary">View All</Link>
                            </div>

                            <div className="space-y-3">
                                {inProgressProjects.length > 0 ? (
                                    inProgressProjects.slice(0, 3).map(p => (
                                        <div key={p.id} className="border border-base-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-base-200/50 transition-colors">
                                            <div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-base">{p.name}</h3>
                                                <p className="text-xs text-base-content/70 mt-1">{p.description || 'Working on this creative project.'}</p>
                                            </div>
                                            <div className="flex-shrink-0 w-full sm:w-auto">
                                                <button className="btn btn-sm w-full btn-outline">Check Status</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-40">
                                        <p>No projects currently in progress.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar area: Projects & Calendar */}
                <div className="col-span-1 space-y-6">
                    {/* Active Projects List */}
                    <div className="card bg-base-100 shadow-xl border border-base-200 text-sm">
                        <div className="card-body p-5">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="card-title text-base">Recent Projects</h2>
                                <Link to="/user/content/projects" className="link link-hover text-primary text-xs font-bold">All</Link>
                            </div>
                            
                            <div className="space-y-4 mt-2">
                                {projects.slice(0, 4).map(p => (
                                    <div key={p.id}>
                                        <div className="flex justify-between mb-1 font-medium">
                                            <span>{p.name}</span>
                                            <span className="text-xs opacity-60">{p.status}</span>
                                        </div>
                                        <progress className={`progress ${p.status === 'COMPLETED' ? 'progress-success' : 'progress-primary'} w-full`} value={p.status === 'COMPLETED' ? 100 : 40} max="100"></progress>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <p className="opacity-40 text-center py-4">No projects yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Promotion */}
                    <div className="card bg-neutral text-neutral-content shadow-xl">
                        <div className="card-body p-5">
                            <h2 className="card-title text-base mb-1">Creator Tools</h2>
                            <p className="text-xs opacity-70 mb-3">Optimize your workflow with our premium plugins.</p>
                            <button className="btn btn-sm btn-accent btn-block">Explore</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentUserDashboard;
