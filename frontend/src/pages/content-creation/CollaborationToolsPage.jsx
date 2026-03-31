import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  MessageSquare, Plus, CheckCircle2, AlertTriangle,
  UserCircle, Layers, Send, ArrowRight
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const CollaborationToolsPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [comment, setComment]   = useState('');
  const [comments, setComments] = useState([
    { author: 'Sarah (Lead Designer)', text: 'Hero shot color grading approved — move to export.', time: '10 min ago' },
    { author: 'Mike (Editor)',          text: 'Revised the brand logo margins per client feedback.', time: '1 hour ago' },
  ]);

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      api.get('/content/projects')
        .then(res => setProjects(Array.isArray(res.data?.data) ? res.data.data : []))
        .catch(() => toast.error('Failed to load project data'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const postComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [{ author: user?.username || 'You', text: comment, time: 'Just now' }, ...prev]);
    setComment('');
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-white rounded-3xl border border-gray-200 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
          <h2 className="text-2xl font-bold text-[#1F2937]">Content Sector Access Only</h2>
          <Link to="/login" className="px-8 py-3 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9]">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937] font-sans">
      

      <main className="p-8 max-w-7xl mx-auto">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Content Creation</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Collaboration</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-3">Collaboration Hub</h1>
            <p className="text-gray-500 max-w-lg">Real-time team workspace for reviews, comments, and creative approvals.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comment Feed */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-[#1F2937] text-lg">Team Activity Feed</h2>
              <p className="text-gray-500 text-xs mt-0.5">{comments.length} comments</p>
            </div>

            <div className="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className={cx('flex items-start gap-3', i === 0 ? 'animate-fade-in' : '')}>
                  <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300 shrink-0">
                    <UserCircle className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="bg-[#F7F9FC] rounded-2xl p-4 flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#1F2937]">{c.author}</span>
                      <span className="text-[10px] text-gray-500">{c.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 transition-all"
                  placeholder="Leave a review comment..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && postComment()}
                />
                <button
                  onClick={postComment}
                  className="p-3 rounded-xl text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Project Reviews */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-5">Project Reviews</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-[#99a8ff] animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray-400 italic text-sm text-center py-10">No projects to review.</p>
            ) : (
              <div className="space-y-3">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-4 bg-[#F7F9FC] rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={cx('p-1.5 rounded-lg shrink-0', p.status === 'COMPLETED' ? 'bg-emerald-500/10' : 'bg-amber-500/10')}>
                      <Layers className={cx('w-3.5 h-3.5', p.status === 'COMPLETED' ? 'text-emerald-600' : 'text-amber-600')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#1F2937] truncate">{p.projectName}</p>
                      <p className="text-xs text-gray-500">{p.clientName}</p>
                    </div>
                    {p.status === 'COMPLETED'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      : <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaborationToolsPage;
