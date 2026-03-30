import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaProjectDiagram, FaPlus, FaCalendarAlt, FaDollarSign, FaUserTie, FaExclamationTriangle, FaTimes, FaFileAlt, FaChartBar } from 'react-icons/fa';
import { toast } from 'sonner';

const ProjectManagementPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsProject, setDetailsProject] = useState(null);
  const [assetsProject, setAssetsProject] = useState(null);
  const [projectAssets, setProjectAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    clientName: '',
    status: 'PLANNING',
    startDate: '',
    deadline: '',
    budget: 0
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/projects');
      if (response.data && response.data.success) {
        setProjects(response.data.data?.content || response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'content') {
      fetchProjects();
    }
  }, [user, sector]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/content/projects', newProject);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Project created successfully');
        setIsModalOpen(false);
        setNewProject({ projectName: '', clientName: '', status: 'PLANNING', startDate: '', deadline: '', budget: 0 });
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to create project', err);
      toast.error('Failed to create project');
    }
  };

  const handleManageAssets = async (project) => {
    setAssetsProject(project);
    setAssetsLoading(true);
    try {
      const res = await api.get(`/content/projects/${project.id}/assets`);
      setProjectAssets(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to load project assets');
      setProjectAssets([]);
    } finally {
      setAssetsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'badge-info';
      case 'COMPLETED': return 'badge-success';
      case 'PLANNING': return 'badge-warning';
      case 'ON_HOLD': return 'badge-error';
      case 'REVIEW': return 'badge-secondary';
      default: return 'badge-ghost';
    }
  };

  const getProgressValue = (status) => {
    switch (status) {
      case 'COMPLETED': return 100;
      case 'IN_PROGRESS': return 65;
      case 'REVIEW': return 80;
      case 'PLANNING': return 15;
      default: return 0;
    }
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials to manage projects.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <FaProjectDiagram className="text-primary" /> Project Management
              </h1>
              <p className="text-base-content/70 mt-1">Orchestrate creative workflows, track milestones, and manage client budgets.</p>
            </div>
            <button className="btn btn-primary gap-2 text-white" onClick={() => setIsModalOpen(true)}>
              <FaPlus /> New Project
            </button>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <span className="loading loading-dots loading-lg text-primary"></span>
                <p className="mt-4 font-semibold opacity-50">Fetching creative workspace...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full card bg-base-100 shadow-xl p-20 text-center italic text-base-content/40">
                No projects currently in the pipeline. Start by creating one!
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border-t-4 border-primary">
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="card-title text-xl font-bold text-base-content">{project.projectName}</h2>
                      <div className={`badge badge-sm font-bold ${getStatusBadgeClass(project.status)}`}>
                        {project.status?.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
                      <FaUserTie className="text-xs" />
                      Client: <span className="font-semibold">{project.clientName || '—'}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-60">
                        <span>Milestone Progress</span>
                        <span>{getProgressValue(project.status)}%</span>
                      </div>
                      <progress
                        className={`progress w-full ${project.status === 'COMPLETED' ? 'progress-success' : 'progress-primary'}`}
                        value={getProgressValue(project.status)}
                        max="100"
                      ></progress>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm bg-base-200/50 p-3 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-xs opacity-50 flex items-center gap-1"><FaCalendarAlt /> Deadline</span>
                        <span className="font-semibold">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs opacity-50 flex items-center gap-1"><FaDollarSign /> Budget</span>
                        <span className="font-semibold text-success">${project.budget?.toLocaleString() || '—'}</span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button
                        className="btn btn-ghost btn-sm gap-1"
                        onClick={() => setDetailsProject(project)}
                      >
                        <FaChartBar /> Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm text-white gap-1"
                        onClick={() => handleManageAssets(project)}
                      >
                        <FaFileAlt /> Manage Assets
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-3"><FaPlus className="text-primary" /> Create New Project</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="form-control">
                <label className="label">Project Title</label>
                <input type="text" className="input input-bordered" required
                  value={newProject.projectName} onChange={e => setNewProject({...newProject, projectName: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">Client Name</label>
                <input type="text" className="input input-bordered" required
                  value={newProject.clientName} onChange={e => setNewProject({...newProject, clientName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <input type="number" className="input input-bordered" required
                  value={newProject.budget} onChange={e => setNewProject({...newProject, budget: parseInt(e.target.value)})} />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary text-white">Launch Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {detailsProject && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2"><FaChartBar className="text-primary" /> Project Details</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setDetailsProject(null)}><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-base-200 rounded-xl p-5">
                <h2 className="text-2xl font-black">{detailsProject.projectName}</h2>
                <p className="text-xs opacity-40 font-mono mt-1">Project #{detailsProject.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaUserTie /> Client</p>
                  <p className="font-bold">{detailsProject.clientName || '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1">Status</p>
                  <span className={`badge font-bold ${getStatusBadgeClass(detailsProject.status)}`}>{detailsProject.status?.replace('_', ' ')}</span>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaCalendarAlt /> Start Date</p>
                  <p className="font-bold">{detailsProject.startDate ? new Date(detailsProject.startDate).toLocaleDateString() : '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaCalendarAlt /> Deadline</p>
                  <p className="font-bold">{detailsProject.deadline ? new Date(detailsProject.deadline).toLocaleDateString() : '—'}</p>
                </div>
              </div>
              <div className="bg-success/10 rounded-xl p-4">
                <p className="text-xs opacity-50 uppercase font-bold mb-1 flex items-center gap-1"><FaDollarSign /> Budget</p>
                <p className="font-black text-2xl text-success">${detailsProject.budget?.toLocaleString() || '—'}</p>
              </div>
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-xs opacity-50 uppercase font-bold mb-2">Milestone Progress</p>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion</span>
                  <span className="font-bold">{getProgressValue(detailsProject.status)}%</span>
                </div>
                <progress className="progress progress-primary w-full" value={getProgressValue(detailsProject.status)} max="100"></progress>
              </div>
            </div>
            <div className="modal-action mt-6">
              <button className="btn btn-ghost" onClick={() => setDetailsProject(null)}>Close</button>
              <button className="btn btn-primary text-white gap-1" onClick={() => { handleManageAssets(detailsProject); setDetailsProject(null); }}>
                <FaFileAlt /> View Assets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Assets Modal */}
      {assetsProject && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <FaFileAlt className="text-primary" /> Assets — {assetsProject.projectName}
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setAssetsProject(null)}><FaTimes /></button>
            </div>
            {assetsLoading ? (
              <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>
            ) : projectAssets.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="text-5xl opacity-10 mx-auto mb-3" />
                <p className="opacity-40 italic">No assets linked to this project yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectAssets.map(asset => (
                  <div key={asset.id} className="flex items-center gap-3 p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
                    <FaFileAlt className="text-primary text-lg flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm truncate">{asset.title}</p>
                      <p className="text-xs opacity-40">{asset.type} · #{asset.id}</p>
                    </div>
                    <span className="badge badge-xs badge-outline">{asset.type}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setAssetsProject(null)}>Close</button>
              <button className="btn btn-primary text-white gap-1" onClick={() => { toast.success('Redirecting to Asset Library...'); setAssetsProject(null); }}>
                <FaPlus /> Add Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagementPage;
