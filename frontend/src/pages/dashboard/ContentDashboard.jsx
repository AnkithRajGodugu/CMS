import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaProjectDiagram, FaUsers, FaCalendarAlt, FaFileAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import { useAuth } from '../../hooks/useAuth';
import SystemMetricsWidget from '../../components/shared/SystemMetricsWidget';
import api from '../../services/api';
import { getContentAdminStats } from '../../services/contentService';

const ContentDashboard = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentData = async () => {
      setLoading(true);
      try {
        const [projectsRes, assetsRes, statsRes] = await Promise.all([
          api.get('/content/projects'),
          api.get('/content/assets'),
          getContentAdminStats().catch(() => ({ data: null }))
        ]);
        setProjects(projectsRes.data?.data?.content || projectsRes.data?.content || projectsRes.data?.data || projectsRes.data || []);
        setAssets(assetsRes.data?.data?.content || assetsRes.data?.content || assetsRes.data?.data || assetsRes.data || []);
        if (statsRes.data?.data) setAdminStats(statsRes.data.data);
        else if (statsRes.data) setAdminStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load content data', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch unconditionally — sector gate applied after loading
    fetchContentData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-6xl mb-4 text-warning"><FaExclamationTriangle /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          This area is restricted to Content Creation sector personnel.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }
  const stats = [
    { label: 'Active Projects', value: adminStats?.activeProjects ?? projects.filter(p => p.status === 'IN_PROGRESS').length, change: '+8%', icon: FaProjectDiagram, color: 'text-primary' },
    { label: 'Total Clients',   value: adminStats?.totalClients   ?? new Set(projects.map(p => p.clientName)).size, change: '+12%', icon: FaUsers, color: 'text-success' },
    { label: 'Content Assets',  value: adminStats?.totalAssets    ?? assets.length, change: '+25%', icon: FaFileAlt, color: 'text-info' },
    { label: 'Active Campaigns',value: adminStats?.activeCampaigns ?? 0, change: '+15%', icon: FaClock, color: 'text-warning' },
  ];

  const quickActions = [
    { title: 'Project Management', path: '/dashboard/content/projects', icon: FaProjectDiagram, color: 'bg-primary' },
    { title: 'Client Portal', path: '/dashboard/content/clients', icon: FaUsers, color: 'bg-success' },
    { title: 'Content Calendar', path: '/dashboard/content/calendar', icon: FaCalendarAlt, color: 'bg-info' },
    { title: 'Collaboration', path: '/dashboard/content/collaboration', icon: FaEdit, color: 'bg-warning' },
    { title: 'Asset Management', path: '/dashboard/content/assets', icon: FaFileAlt, color: 'bg-error' },
    { title: 'Time Tracking', path: '/dashboard/content/time', icon: FaClock, color: 'bg-secondary' },
  ];

  return (
    <div className="space-y-6">
        
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FaEdit className="text-2xl md:text-4xl text-primary" />
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">Content Dashboard</h1>
              </div>
              <p className="text-base-content/70 text-sm md:text-base">Manage projects, clients, and creative workflows</p>
            </div>
            <ReportExportButtons sectorCode="CONTENT" />
          </div>

        {user?.role === 'ADMIN' && <SystemMetricsWidget />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-xs md:text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`text-3xl md:text-4xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  <div className="card-body items-center text-center">
                    <div className={`p-4 rounded-full ${action.color} text-white mb-2`}>
                      <action.icon className="text-3xl" />
                    </div>
                    <h3 className="card-title text-lg">{action.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
          <h2 className="card-title">Recent Projects</h2>
            {/* Mobile card view */}
            <div className="md:hidden space-y-3 mt-2">
              {projects.length === 0 ? (
                <p className="text-center text-base-content/50 py-4">No projects found.</p>
              ) : projects.slice(0,5).map(p => (
                <div key={p.id} className="table-card-row bg-base-200/40 border border-base-200">
                  <div className="flex justify-between"><span className="table-card-row-label">Project</span><span className="text-sm font-medium">{p.projectName}</span></div>
                  <div className="flex justify-between"><span className="table-card-row-label">Client</span><span className="text-sm">{p.clientName}</span></div>
                  <div className="flex justify-between items-center"><span className="table-card-row-label">Status</span>
                    <span className={`badge badge-sm ${p.status==='COMPLETED'?'badge-success':p.status==='IN_PROGRESS'?'badge-info':'badge-warning'}`}>{(p.status||'PLANNING').replace('_',' ')}</span></div>
                  <div className="flex justify-between"><span className="table-card-row-label">Deadline</span><span className="text-xs">{p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No Deadline'}</span></div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table">
                <thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Deadline</th></tr></thead>
                <tbody>
                  {projects.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No projects found.</td></tr>
                  ) : projects.map(project => (
                    <tr key={project.id}>
                      <td>{project.projectName}</td>
                      <td>{project.clientName}</td>
                      <td><span className={`badge ${project.status==='COMPLETED'?'badge-success':project.status==='IN_PROGRESS'?'badge-info':'badge-warning'}`}>{(project.status||'PLANNING').replace('_',' ')}</span></td>
                      <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No Deadline'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ContentDashboard;
