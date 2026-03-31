import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';
import { FaProjectDiagram, FaPlus, FaCalendarAlt, FaDollarSign, FaUserTie, FaFilter, FaTimes, FaChartBar } from 'react-icons/fa';
import { toast } from 'sonner';

const STATUS_FILTERS = ['ALL', 'PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'ON_HOLD'];

const getStatusBadge = (status) => {
  switch (status) {
    case 'On Track':
    case 'COMPLETED': return 'badge-success badge-outline';
    case 'At Risk':
    case 'ON_HOLD': return 'badge-error badge-outline';
    case 'Delayed': return 'badge-warning badge-outline';
    case 'IN_PROGRESS': return 'badge-info badge-outline';
    case 'PLANNING': return 'badge-warning badge-outline';
    case 'REVIEW': return 'badge-secondary badge-outline';
    default: return 'badge-ghost';
  }
};

const getProgressValue = (status) => {
  switch (status) {
    case 'COMPLETED': return 100;
    case 'REVIEW': return 80;
    case 'IN_PROGRESS': return 60;
    case 'PLANNING': return 15;
    default: return 0;
  }
};

const getProgressColor = (status) => {
  switch (status) {
    case 'COMPLETED': return 'progress-success';
    case 'REVIEW': return 'progress-secondary';
    case 'IN_PROGRESS': return 'progress-info';
    default: return 'progress-warning';
  }
};

const MyProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [newProject, setNewProject] = useState({
    projectName: '', clientName: '', status: 'PLANNING', startDate: '', deadline: '', budget: 0
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content/my-projects');
      setProjects(res.data?.data?.content || res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch my projects', err);
      // Fallback to all projects if my-projects not available
      try {
        const res2 = await api.get('/content/projects');
        setProjects(res2.data?.data?.content || res2.data?.data || []);
      } catch {
        toast.error('Failed to load projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/content/projects', newProject);
      if (res.data?.success) {
        toast.success('Project created successfully!');
        setIsNewProjectOpen(false);
        setNewProject({ projectName: '', clientName: '', status: 'PLANNING', startDate: '', deadline: '', budget: 0 });
        fetchProjects();
      }
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const filteredProjects = projects.filter(p =>
    filterStatus === 'ALL' || p.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-base-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-base-content/60">Track high-level progress of your assigned initiatives.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              className={`btn btn-outline btn-sm gap-1 ${filterStatus !== 'ALL' ? 'btn-primary' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FaFilter /> Filter {filterStatus !== 'ALL' && `(${filterStatus})`}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-10 z-50 bg-base-100 border border-base-200 rounded-xl shadow-2xl p-3 w-48 space-y-1">
                {STATUS_FILTERS.map(s => (
                  <button
                    key={s}
                    className={`btn btn-ghost btn-sm w-full justify-start ${filterStatus === s ? 'bg-primary/10 text-primary' : ''}`}
                    onClick={() => { setFilterStatus(s); setIsFilterOpen(false); }}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-primary btn-sm gap-1" onClick={() => setIsNewProjectOpen(true)}>
            <FaPlus /> New Project
          </button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card bg-base-100 shadow-xl p-16 text-center">
          <FaProjectDiagram className="text-5xl opacity-10 mx-auto mb-4" />
          <p className="opacity-40 italic">No projects found{filterStatus !== 'ALL' ? ` with status "${filterStatus}"` : ''}.</p>
          <button className="btn btn-primary btn-sm mt-4 mx-auto" onClick={() => setIsNewProjectOpen(true)}>Create your first project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="card bg-base-100 shadow-xl border border-base-200 hover:border-primary/30 hover:shadow-2xl transition-all cursor-pointer group"
              onClick={() => setDetailProject(project)}
            >
              <div className="card-body p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono font-bold opacity-50">#{project.id}</div>
                  <span className={`badge badge-sm font-medium ${getStatusBadge(project.status)}`}>{project.status?.replace('_', ' ') || 'Unknown'}</span>
                </div>

                <h2 className="card-title text-xl mb-1 group-hover:text-primary transition-colors">{project.projectName}</h2>
                <p className="text-sm text-base-content/70 mb-4 flex items-center gap-1">
                  <FaUserTie className="text-xs opacity-50" /> {project.clientName || 'No client'}
                </p>

                <div className="my-4">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-semibold">Progress</span>
                    <span className="text-sm font-bold text-base-content/70">{getProgressValue(project.status)}%</span>
                  </div>
                  <progress className={`progress ${getProgressColor(project.status)} w-full`} value={getProgressValue(project.status)} max="100"></progress>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-base-200">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-50 flex items-center gap-1"><FaCalendarAlt className="text-xs" /> Deadline</span>
                    <span className="text-sm font-medium">{project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-50 flex items-center gap-1"><FaDollarSign className="text-xs" /> Budget</span>
                    <span className="text-sm font-bold text-success">{project.budget ? `$${project.budget.toLocaleString()}` : '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {isNewProjectOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2"><FaPlus className="text-primary" /> New Project</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsNewProjectOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="form-control">
                <label className="label">Project Title</label>
                <input type="text" className="input input-bordered" required
                  placeholder="e.g. Summer Brand Campaign"
                  value={newProject.projectName} onChange={e => setNewProject({...newProject, projectName: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">Client Name</label>
                <input type="text" className="input input-bordered" required
                  placeholder="e.g. Acme Corporation"
                  value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Start Date</label>
                  <input type="date" className="input input-bordered" required
                    value={newProject.startDate} onChange={e => setNewProject({...newProject, startDate: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Deadline</label>
                  <input type="date" className="input input-bordered" required
                    value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})} />
                </div>
              </div>
              <div className="form-control">
                <label className="label">Total Budget ($)</label>
                <input type="number" className="input input-bordered" min="0"
                  value={newProject.budget} onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value) || 0})} />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsNewProjectOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary text-white gap-1"><FaPlus /> Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {detailProject && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2"><FaChartBar className="text-primary" /> Project Details</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setDetailProject(null)}><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-base-200 rounded-xl p-5">
                <h2 className="text-2xl font-black">{detailProject.projectName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge font-bold ${getStatusBadge(detailProject.status)}`}>{detailProject.status?.replace('_', ' ')}</span>
                  <span className="text-xs font-mono opacity-40">#{detailProject.id}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaUserTie /> Client</p>
                  <p className="font-bold">{detailProject.clientName || '—'}</p>
                </div>
                <div className="bg-success/10 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaDollarSign /> Budget</p>
                  <p className="font-black text-success">{detailProject.budget ? `$${detailProject.budget.toLocaleString()}` : '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaCalendarAlt /> Start Date</p>
                  <p className="font-bold">{detailProject.startDate ? new Date(detailProject.startDate).toLocaleDateString() : '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaCalendarAlt /> Deadline</p>
                  <p className="font-bold">{detailProject.deadline ? new Date(detailProject.deadline).toLocaleDateString() : '—'}</p>
                </div>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-xs opacity-50 uppercase font-bold mb-2">Progress</p>
                <div className="flex justify-between text-sm mb-1">
                  <span>{detailProject.status?.replace('_', ' ')}</span>
                  <span className="font-bold">{getProgressValue(detailProject.status)}%</span>
                </div>
                <progress className={`progress w-full ${getProgressColor(detailProject.status)}`} value={getProgressValue(detailProject.status)} max="100"></progress>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDetailProject(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
