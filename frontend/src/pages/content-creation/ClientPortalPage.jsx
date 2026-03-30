import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUsers, FaCheckCircle, FaClock, FaCommentDots, FaEye, FaExclamationTriangle, FaTimes, FaCalendarAlt, FaDollarSign, FaUserTie, FaProjectDiagram } from 'react-icons/fa';
import { toast } from 'sonner';

const ClientPortalPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content/projects');
      if (res.data?.success) setProjects(res.data.data?.content || res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      fetchProjects();
    }
  }, [user]);

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Log in with content credentials to view the client portal.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const getFeedbackStatus = (status) => {
    switch (status) {
      case 'COMPLETED': return { label: 'Approved', cls: 'badge-success' };
      case 'IN_PROGRESS': return { label: 'In Review', cls: 'badge-info' };
      case 'REVIEW': return { label: 'Awaiting Feedback', cls: 'badge-warning' };
      default: return { label: 'Pending Start', cls: 'badge-ghost' };
    }
  };

  const getStatusStep = (status) => {
    const steps = ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
    return steps.indexOf(status) + 1;
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold flex items-center gap-4">
              <FaUsers className="text-success" /> Client Portal
            </h1>
            <p className="text-base-content/60 mt-2 text-lg">Dedicated workspace for client feedback, approvals, and project status visibility.</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-success"><FaCheckCircle className="text-3xl" /></div>
                <div className="stat-title">Approved Projects</div>
                <div className="stat-value text-success">{projects.filter(p => p.status === 'COMPLETED').length}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-warning"><FaClock className="text-3xl" /></div>
                <div className="stat-title">Awaiting Feedback</div>
                <div className="stat-value text-warning">{projects.filter(p => p.status === 'REVIEW').length}</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                <div className="stat-figure text-info"><FaCommentDots className="text-3xl" /></div>
                <div className="stat-title">Active Clients</div>
                <div className="stat-value text-info">{new Set(projects.map(p => p.clientName)).size}</div>
              </div>
            </div>
          </div>

          {/* Client-Project Table */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="card-body">
              <h2 className="card-title mb-4">Active Client Projects</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Project</th>
                      <th>Deadline</th>
                      <th>Feedback Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-10"><span className="loading loading-spinner loading-md text-success"></span></td></tr>
                    ) : projects.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-8 opacity-40 italic">No client projects found.</td></tr>
                    ) : (
                      projects.map(p => {
                        const fb = getFeedbackStatus(p.status);
                        return (
                          <tr key={p.id} className="hover">
                            <td className="font-bold">{p.clientName || 'N/A'}</td>
                            <td>{p.projectName}</td>
                            <td className="font-mono text-sm">{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                            <td><span className={`badge ${fb.cls} badge-sm font-bold`}>{fb.label}</span></td>
                            <td>
                              <button
                                className="btn btn-ghost btn-xs gap-1 text-success"
                                onClick={() => setSelectedProject(p)}
                              >
                                <FaEye /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <FaProjectDiagram className="text-success" /> Project Details
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setSelectedProject(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-base-200 rounded-xl p-5">
                <h2 className="text-2xl font-black">{selectedProject.projectName}</h2>
                <p className="text-base-content/50 text-sm mt-1">Project #{selectedProject.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2 flex items-center gap-1"><FaUserTie /> Client</p>
                  <p className="font-bold">{selectedProject.clientName || '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2">Status</p>
                  <span className={`badge font-bold ${getFeedbackStatus(selectedProject.status).cls}`}>
                    {getFeedbackStatus(selectedProject.status).label}
                  </span>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2 flex items-center gap-1"><FaCalendarAlt /> Deadline</p>
                  <p className="font-bold">{selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : '—'}</p>
                </div>
                <div className="bg-base-200 rounded-xl p-4">
                  <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-2 flex items-center gap-1"><FaDollarSign /> Budget</p>
                  <p className="font-bold text-success">{selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : '—'}</p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="bg-base-200 rounded-xl p-4">
                <p className="text-xs opacity-50 uppercase tracking-widest font-bold mb-3">Workflow Progress</p>
                <ul className="steps steps-horizontal w-full text-xs">
                  {['Planning', 'In Progress', 'Review', 'Completed'].map((step, i) => (
                    <li key={step} className={`step ${i < getStatusStep(selectedProject.status) ? 'step-success' : ''}`}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button className="btn btn-ghost" onClick={() => setSelectedProject(null)}>Close</button>
              <button className="btn btn-success text-white gap-2" onClick={() => { toast.success(`Feedback request sent for "${selectedProject.projectName}"`); setSelectedProject(null); }}>
                Request Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortalPage;
