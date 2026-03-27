import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaProjectDiagram, FaPlus, FaCalendarAlt, FaDollarSign, FaUserTie, FaExclamationTriangle, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'sonner';

const ProjectManagementPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setProjects(Array.isArray(response.data.data) ? response.data.data : []);
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
        setNewProject({
          projectName: '',
          clientName: '',
          status: 'PLANNING',
          startDate: '',
          deadline: '',
          budget: 0
        });
        fetchProjects();
      }
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IN_PROGRESS': return 'text-info';
      case 'COMPLETED': return 'text-success';
      case 'PLANNING': return 'text-warning';
      case 'ON_HOLD': return 'text-error';
      default: return 'text-base-content/50';
    }
  };

  const getProgressValue = (status) => {
     switch (status) {
       case 'COMPLETED': return 100;
       case 'IN_PROGRESS': return 65;
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
                <FaProjectDiagram className="text-primary" />
                Project Management
              </h1>
              <p className="text-base-content/70 mt-1">Orchestrate creative workflows, track milestones, and manage client budgets.</p>
            </div>
            <button 
              className="btn btn-primary gap-2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
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
                       <div className={`badge badge-sm font-bold ${getStatusColor(project.status).replace('text-', 'badge-')}`}>
                         {project.status.replace('_', ' ')}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
                      <FaUserTie className="text-xs" />
                      Client: <span className="font-semibold">{project.clientName}</span>
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
                        <span className="font-semibold text-success">${project.budget?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                      <button className="btn btn-ghost btn-sm">Details</button>
                      <button className="btn btn-primary btn-sm text-white">Manage Assets</button>
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
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3">
              <FaPlus className="text-primary" /> Create New Content Project
            </h3>
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
    </div>
  );
};

export default ProjectManagementPage;
