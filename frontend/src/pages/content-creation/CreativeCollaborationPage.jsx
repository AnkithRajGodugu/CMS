import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUsers, FaPlus, FaComments, FaCalendarCheck, FaExclamationTriangle, FaCheckCircle, FaProjectDiagram, FaVideo } from 'react-icons/fa';
import { toast } from 'sonner';

const CreativeCollaborationPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([
    { id: 1, title: 'Color Grading - Summer Brand Film', requestedBy: 'Mike (Lead Editor)', approved: false },
    { id: 2, title: 'Motion Graphics Pack v2', requestedBy: 'Sarah (Motion Designer)', approved: false },
    { id: 3, title: 'Voiceover - Product Launch Reel', requestedBy: 'Alex (Audio Engineer)', approved: false },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/projects');
      if (response.data && response.data.success) {
        setProjects(response.data.data?.content || response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects for collaboration', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      fetchData();
    }
  }, [user]);

  const handleApprove = (approvalId) => {
    setApprovals(prev => prev.filter(a => a.id !== approvalId));
    toast.success('Milestone approved! The team has been notified.');
  };

  const handleReject = (approvalId, title) => {
    setApprovals(prev => prev.filter(a => a.id !== approvalId));
    toast.error(`"${title}" sent back for revision.`);
  };

  const handleJoinMeeting = () => {
    toast.info('🎥 Opening meeting room... Redirecting to video conference.', { duration: 3000 });
    // In a real app: window.open(meetingUrl, '_blank');
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials for team collaboration.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaUsers className="text-primary" /> Creative Collaboration
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Work together in real-time, share feedback, and sync with your global creative team.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Active Project Forums */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm opacity-40 uppercase tracking-widest mb-4">Active Project Forums</h2>
                  {loading ? (
                    <span className="loading loading-dots loading-md text-primary"></span>
                  ) : projects.length === 0 ? (
                    <p className="italic opacity-30 py-10 text-center">No active project threads found.</p>
                  ) : (
                    <div className="space-y-4">
                      {projects.map(p => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl hover:bg-base-200 transition-colors cursor-pointer group"
                          onClick={() => toast.info(`Opening thread for "${p.projectName}"...`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="avatar placeholder">
                              <div className="bg-primary text-primary-content rounded-full w-10">
                                <span>{p.projectName.charAt(0)}</span>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold">{p.projectName}</p>
                              <p className="text-xs opacity-50">Last activity 2h ago · {p.clientName || 'No client'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="badge badge-sm">{Math.floor(Math.random() * 20) + 1} updates</div>
                            <FaComments className="text-primary group-hover:scale-110 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Milestone Approvals */}
              <div className="card bg-base-100 shadow-xl border-t-4 border-success">
                <div className="card-body">
                  <h2 className="card-title text-sm opacity-40 uppercase tracking-widest mb-4">
                    Milestone Approvals
                    {approvals.length > 0 && <span className="badge badge-warning badge-sm ml-2">{approvals.length} pending</span>}
                  </h2>
                  {approvals.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-3">
                      <FaCheckCircle className="text-success text-4xl" />
                      <p className="opacity-50 italic">All milestones approved! Great work. 🎉</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {approvals.map(a => (
                        <div key={a.id} className="flex items-start gap-4 p-4 border border-base-200 rounded-xl hover:bg-base-200/30 transition-colors">
                          <FaCheckCircle className="text-warning mt-1 flex-shrink-0" />
                          <div className="flex-grow">
                            <p className="font-bold">{a.title}</p>
                            <p className="text-sm opacity-60">Requested by {a.requestedBy}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              className="btn btn-sm btn-outline btn-error"
                              onClick={() => handleReject(a.id, a.title)}
                            >Reject</button>
                            <button
                              className="btn btn-sm btn-success text-white"
                              onClick={() => handleApprove(a.id)}
                            >Approve</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="card bg-primary text-primary-content shadow-2xl">
                <div className="card-body">
                  <h2 className="card-title"><FaCalendarCheck /> Sync Schedule</h2>
                  <p className="text-sm opacity-80">Next Creative Review:</p>
                  <p className="text-xl font-black">Tomorrow, 10:00 AM</p>
                  <div className="divider opacity-20 my-2"></div>
                  <button
                    className="btn btn-sm btn-outline btn-block text-white gap-2"
                    onClick={handleJoinMeeting}
                  >
                    <FaVideo /> Join Meeting
                  </button>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm opacity-40 uppercase tracking-widest mb-4">Online Members</h2>
                  <div className="flex -space-x-2 overflow-hidden py-4">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className="avatar border-2 border-base-100 rounded-full cursor-pointer hover:z-10 hover:scale-110 transition-transform tooltip"
                        data-tip={`Team Member ${i}`}
                        onClick={() => toast.info(`Viewing profile of Team Member ${i}`)}
                      >
                        <div className="w-10 rounded-full">
                          <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                        </div>
                      </div>
                    ))}
                    <div className="avatar placeholder border-2 border-base-100 rounded-full cursor-pointer" onClick={() => toast.info('3 more team members online')}>
                      <div className="bg-neutral text-neutral-content w-10 rounded-full">
                        <span>+3</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs italic opacity-40 text-center mt-2">Active in Content & Brand rooms</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm opacity-40 uppercase tracking-widest mb-4">This Week</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Comments Posted</span>
                      <span className="font-bold text-primary">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Milestones Approved</span>
                      <span className="font-bold text-success">{3 - approvals.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Projects Active</span>
                      <span className="font-bold text-info">{projects.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreativeCollaborationPage;
