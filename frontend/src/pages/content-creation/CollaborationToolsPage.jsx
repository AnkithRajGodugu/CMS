import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaComments, FaPlus, FaCheckCircle, FaExclamationTriangle, FaUserCircle, FaProjectDiagram } from 'react-icons/fa';
import { toast } from 'sonner';

const CollaborationToolsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { author: 'Sarah (Lead Designer)', text: 'Hero shot color grading approved — move to export.', time: '10 min ago' },
    { author: 'Mike (Editor)', text: 'Revised the brand logo margins per client feedback.', time: '1 hour ago' },
  ]);

  useEffect(() => {
    if (user?.role === 'content') {
      api.get('/content/projects')
        .then(res => setProjects(res.data?.data ?? []))
        .catch(() => toast.error('Failed to load project data'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const postComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [{
      author: user?.username || 'You',
      text: comment,
      time: 'Just now'
    }, ...prev]);
    setComment('');
  };

  if (!user || user.role !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <Header />
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold flex items-center gap-4">
              <FaComments className="text-primary" /> Collaboration Hub
            </h1>
            <p className="text-base-content/60 mt-2 text-lg">Real-time team workspace for reviews, comments, and creative approvals.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comment Feed */}
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Team Activity Feed</h2>
                <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2">
                  {comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <FaUserCircle className="text-3xl text-primary mt-1 flex-shrink-0" />
                      <div className="bg-base-200 rounded-xl p-3 flex-grow">
                        <div className="flex justify-between text-xs opacity-50 mb-1">
                          <span className="font-bold">{c.author}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-sm">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 border-t pt-4">
                  <input
                    className="input input-bordered flex-grow"
                    placeholder="Leave a review comment..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && postComment()}
                  />
                  <button className="btn btn-primary gap-2" onClick={postComment}>
                    <FaPlus /> Post
                  </button>
                </div>
              </div>
            </div>

            {/* Project Checklist */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-sm opacity-40 uppercase tracking-widest mb-4">Project Reviews</h2>
                {loading ? (
                  <span className="loading loading-dots text-primary"></span>
                ) : projects.length === 0 ? (
                  <p className="opacity-30 italic py-8 text-center">No projects to review.</p>
                ) : (
                  <div className="space-y-3">
                    {projects.map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-base-200/70 rounded-lg hover:bg-base-200 transition-colors">
                        <FaProjectDiagram className={p.status === 'COMPLETED' ? 'text-success' : 'text-warning'} />
                        <div className="flex-grow">
                          <p className="font-bold text-sm">{p.projectName}</p>
                          <p className="text-xs opacity-40">{p.clientName}</p>
                        </div>
                        {p.status === 'COMPLETED' && <FaCheckCircle className="text-success" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollaborationToolsPage;
