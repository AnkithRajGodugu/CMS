import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserContentDashboardStats, getMyProjects } from '../../../services/contentService';

/* ── Creator Tools data ─────────────────────────────────────────────────── */
const CREATOR_TOOLS = [
    {
        id: 'projects',
        title: 'My Projects',
        description: 'View and manage all your assigned projects, track progress and deadlines.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        path: '/user/content/projects',
        badge: 'Active',
        color: 'bg-primary/10 text-primary border-primary/20',
        btnColor: 'btn-primary',
    },
    {
        id: 'tasks',
        title: 'My Tasks',
        description: 'See your task queue, mark deliverables complete, and stay on schedule.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        path: '/user/content/tasks',
        badge: 'Tasks',
        color: 'bg-warning/10 text-warning border-warning/20',
        btnColor: 'btn-warning',
    },
    {
        id: 'calendar',
        title: 'Content Calendar',
        description: 'Plan upcoming content, visualise deadlines and schedule publishing dates.',
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        path: '/user/content/calendar',
        badge: 'Schedule',
        color: 'bg-success/10 text-success border-success/20',
        btnColor: 'btn-success',
    },
];

/* ── Modal Component ────────────────────────────────────────────────────── */
const CreatorToolsModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    if (!open) return null;

    const handleOpen = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Creator Tools"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-lg bg-base-100 rounded-2xl shadow-2xl border border-base-200 animate-slide-up overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-bold text-base text-base-content">Creator Tools</h2>
                            <p className="text-xs text-base-content/50">Boost your creative workflow</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tools list */}
                <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
                    {CREATOR_TOOLS.map((tool) => (
                        <div
                            key={tool.id}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${tool.color} transition-all hover:shadow-md cursor-pointer group`}
                            onClick={() => handleOpen(tool.path)}
                        >
                            <div className="flex-shrink-0">
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm">{tool.title}</h3>
                                    <span className="badge badge-sm opacity-70">{tool.badge}</span>
                                </div>
                                <p className="text-xs opacity-70 mt-0.5 leading-relaxed">{tool.description}</p>
                            </div>
                            <svg
                                className="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    ))}

                    {/* Footer tip */}
                    <div className="flex items-start gap-2 mt-4 px-1 text-xs text-base-content/40">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Click any tool above or use the sidebar to navigate directly.</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 pb-5">
                    <button
                        onClick={onClose}
                        className="btn btn-outline btn-sm btn-block"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Main Dashboard ─────────────────────────────────────────────────────── */
const ContentUserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toolsOpen, setToolsOpen] = useState(false);

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
        <>
            <CreatorToolsModal open={toolsOpen} onClose={() => setToolsOpen(false)} />

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

                    {/* In-Progress Projects */}
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
                                                    <Link to="/user/content/projects" className="btn btn-sm w-full btn-outline">Check Status</Link>
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

                    {/* Sidebar: Recent Projects + Creator Tools */}
                    <div className="col-span-1 space-y-6">
                        {/* Recent Projects */}
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
                                            <progress
                                                className={`progress ${p.status === 'COMPLETED' ? 'progress-success' : 'progress-primary'} w-full`}
                                                value={p.status === 'COMPLETED' ? 100 : 40}
                                                max="100"
                                            />
                                        </div>
                                    ))}
                                    {projects.length === 0 && (
                                        <p className="opacity-40 text-center py-4">No projects yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Creator Tools card */}
                        <div className="card bg-neutral text-neutral-content shadow-xl">
                            <div className="card-body p-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <h2 className="card-title text-base">Creator Tools</h2>
                                </div>
                                <p className="text-xs opacity-70 mb-3">
                                    Manage projects, tasks and your content calendar — all in one place.
                                </p>
                                <button
                                    id="explore-creator-tools-btn"
                                    className="btn btn-sm btn-accent btn-block gap-2"
                                    onClick={() => setToolsOpen(true)}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Explore Tools
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContentUserDashboard;
