import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Users, CheckCircle2, Clock, MessageSquare, Eye,
  AlertTriangle, X, Calendar, DollarSign, User, Layers
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const FEEDBACK_META = {
  COMPLETED:   { label: 'Approved',          color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
  IN_PROGRESS: { label: 'In Review',         color: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
  REVIEW:      { label: 'Awaiting Feedback', color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
  PLANNING:    { label: 'Pending Start',     color: 'text-[#aaabb0] bg-[#23262c] border-[#46484d]/20' },
};
const getFeedbackMeta = (s) => FEEDBACK_META[s] || FEEDBACK_META.PLANNING;

const STATUS_STEPS = ['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
const getStatusStep = (s) => STATUS_STEPS.indexOf(s) + 1;

const ClientPortalPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      api.get('/content/projects')
        .then(res => { if (res.data?.success) setProjects(res.data.data?.content || res.data.data || []); })
        .catch(err => { console.error(err); toast.error('Failed to load client data'); })
        .finally(() => setLoading(false));
    }
  }, [user]);

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

  const approved   = projects.filter(p => p.status === 'COMPLETED').length;
  const awaitingFb = projects.filter(p => p.status === 'REVIEW').length;
  const activeClients = new Set(projects.map(p => p.clientName)).size;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        <section className="mb-12 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
            <span className="text-[#46484d]">/</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Client Portal</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Client Portal</h1>
          <p className="text-[#aaabb0] max-w-lg">Dedicated workspace for client feedback, approvals, and project status visibility.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Approved Projects',  value: approved,      color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', Icon: CheckCircle2 },
            { label: 'Awaiting Feedback',  value: awaitingFb,    color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',       Icon: Clock },
            { label: 'Active Clients',     value: activeClients, color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',             Icon: MessageSquare },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-6 flex items-center gap-5">
              <div className={cx('p-3 rounded-xl border', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-6 h-6', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#f6f6fc]">{value}</p>
                <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Table */}
        <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-[#46484d]/10 flex items-center justify-between">
            <h2 className="font-bold text-[#f6f6fc] text-lg">Active Client Projects</h2>
            <span className="text-xs text-[#aaabb0]">{projects.length} projects</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#46484d]/10">
                  {['Client', 'Project', 'Deadline', 'Feedback Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-16">
                    <div className="flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" /></div>
                  </td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-16 text-[#46484d] italic">No client projects found.</td></tr>
                ) : (
                  projects.map(p => {
                    const fb = getFeedbackMeta(p.status);
                    return (
                      <tr key={p.id} className="border-b border-[#46484d]/5 hover:bg-[#171a1f] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#f6f6fc]">{p.clientName || 'N/A'}</td>
                        <td className="px-6 py-4 text-[#aaabb0]">{p.projectName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-[#aaabb0]">{p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4">
                          <span className={cx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border', fb.color)}>{fb.label}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedProject(p)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#99a8ff] hover:text-[#f6f6fc] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
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
      </main>

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/20 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20">
                  <Layers className="w-5 h-5 text-[#99a8ff]" />
                </div>
                <h3 className="font-bold text-[#f6f6fc] text-lg">Project Details</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[#0c0e12] rounded-2xl p-5">
                <h2 className="text-2xl font-black text-[#f6f6fc]">{selectedProject.projectName}</h2>
                <p className="text-xs text-[#aaabb0] font-mono mt-1">Project #{selectedProject.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Client',   value: selectedProject.clientName || '—',   Icon: User },
                  { label: 'Deadline', value: selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : '—', Icon: Calendar },
                  { label: 'Budget',   value: selectedProject.budget ? `$${selectedProject.budget.toLocaleString()}` : '—', Icon: DollarSign, accent: 'text-emerald-400' },
                  { label: 'Status',   badge: getFeedbackMeta(selectedProject.status) },
                ].map(({ label, value, Icon: Ic, accent, badge }) => (
                  <div key={label} className="bg-[#0c0e12] rounded-xl p-4">
                    <p className="text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-1">{label}</p>
                    {badge
                      ? <span className={cx('text-xs font-bold uppercase', badge.color.split(' ')[0])}>{badge.label}</span>
                      : <p className={cx('font-bold text-sm', accent || 'text-[#f6f6fc]')}>{value}</p>
                    }
                  </div>
                ))}
              </div>
              {/* Progress Steps */}
              <div className="bg-[#0c0e12] rounded-xl p-4">
                <p className="text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-3">Workflow Progress</p>
                <div className="flex items-center gap-2">
                  {['Planning', 'In Progress', 'Review', 'Completed'].map((step, i) => {
                    const done = i < getStatusStep(selectedProject.status);
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1.5 flex-1">
                          <div className={cx('w-6 h-6 rounded-full flex items-center justify-center', done ? 'bg-emerald-400' : 'bg-[#23262c]')}>
                            {done && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                          </div>
                          <span className="text-[9px] text-center text-[#aaabb0] font-bold uppercase tracking-wide">{step}</span>
                        </div>
                        {i < 3 && <div className={cx('flex-none w-6 h-0.5 mb-5', done ? 'bg-emerald-400' : 'bg-[#23262c]')} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setSelectedProject(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Close</button>
              <button
                onClick={() => { toast.success(`Feedback request sent for "${selectedProject.projectName}"`); setSelectedProject(null); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all"
              >
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
