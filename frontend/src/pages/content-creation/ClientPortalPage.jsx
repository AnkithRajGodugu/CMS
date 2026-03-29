import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUsers, FaCheckCircle, FaClock, FaCommentDots, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';

const ClientPortalPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content/projects');
      if (res.data?.success) setProjects(res.data.data?.content || res.data.data);
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
                              <button className="btn btn-ghost btn-xs gap-1 text-success"><FaEye /> View</button>
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
    </div>
  );
};

export default ClientPortalPage;
