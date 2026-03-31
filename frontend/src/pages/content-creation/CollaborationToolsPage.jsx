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
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-[#111318] rounded-3xl border border-[#46484d]/20 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400" />
          <h2 className="text-2xl font-bold text-[#f6f6fc]">Content Sector Access Only</h2>
          <Link to="/login" className="px-8 py-3 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9]">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Collaboration</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Collaboration Hub</h1>
            <p className="text-[#aaabb0] max-w-lg">Real-time team workspace for reviews, comments, and creative approvals.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Comment Feed */}
          <div className="lg:col-span-2 bg-[#111318] rounded-3xl border border-[#46484d]/10 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-[#46484d]/10">
              <h2 className="font-bold text-[#f6f6fc] text-lg">Team Activity Feed</h2>
              <p className="text-[#aaabb0] text-xs mt-0.5">{comments.length} comments</p>
            </div>

            <div className="flex-1 p-6 space-y-4 max-h-96 overflow-y-auto">
              {comments.map((c, i) => (
                <div key={i} className={cx('flex items-start gap-3', i === 0 ? 'animate-fade-in' : '')}>
                  <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20 shrink-0">
                    <UserCircle className="w-5 h-5 text-[#99a8ff]" />
                  </div>
                  <div className="bg-[#0c0e12] rounded-2xl p-4 flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-[#f6f6fc]">{c.author}</span>
                      <span className="text-[10px] text-[#aaabb0]">{c.time}</span>
                    </div>
                    <p className="text-sm text-[#aaabb0] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#46484d]/10">
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none focus:border-[#99a8ff]/50 transition-all"
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
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-5">Project Reviews</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-[#46484d] italic text-sm text-center py-10">No projects to review.</p>
            ) : (
              <div className="space-y-3">
                {projects.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-4 bg-[#0c0e12] rounded-xl hover:bg-[#171a1f] transition-colors group">
                    <div className={cx('p-1.5 rounded-lg shrink-0', p.status === 'COMPLETED' ? 'bg-emerald-500/10' : 'bg-amber-500/10')}>
                      <Layers className={cx('w-3.5 h-3.5', p.status === 'COMPLETED' ? 'text-emerald-300' : 'text-amber-300')} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#f6f6fc] truncate">{p.projectName}</p>
                      <p className="text-xs text-[#aaabb0]">{p.clientName}</p>
                    </div>
                    {p.status === 'COMPLETED'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <ArrowRight className="w-4 h-4 text-[#46484d] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
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
