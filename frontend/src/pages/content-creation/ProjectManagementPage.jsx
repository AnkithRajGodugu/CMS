import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Layers, Plus, Calendar, DollarSign, User, AlertTriangle,
  X, FileText, BarChart2, ChevronRight, Clock, CheckCircle2,
  PauseCircle, Eye, FolderOpen
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

/* ─── Status config ─────────────────────────────────────────────────── */
const STATUS_META = {
  IN_PROGRESS: { label: 'In Progress', color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',     Icon: Clock,         progress: 65 },
  COMPLETED:   { label: 'Completed',   color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', Icon: CheckCircle2,  progress: 100 },
  PLANNING:    { label: 'Planning',    color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',  Icon: Layers,        progress: 15 },
  ON_HOLD:     { label: 'On Hold',     color: 'text-red-300 bg-red-500/10 border-red-500/20',        Icon: PauseCircle,   progress: 0 },
  REVIEW:      { label: 'Review',      color: 'text-violet-300 bg-violet-500/10 border-violet-500/20', Icon: Eye,           progress: 80 },
};

const getStatusMeta = (s) => STATUS_META[s] || { label: s, color: 'text-[#aaabb0] bg-[#23262c] border-[#46484d]/20', Icon: Layers, progress: 0 };

/* ─── Modal shell ────────────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-[#111318] rounded-3xl border border-[#46484d]/20 w-full max-w-lg shadow-2xl shadow-black/50 max-h-[90vh] overflow-y-auto">
      {children}
    </div>
  </div>
);

const ModalHeader = ({ icon: Icon, title, subtitle, onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10 sticky top-0 bg-[#111318] z-10">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20">
        <Icon className="w-5 h-5 text-[#99a8ff]" />
      </div>
      <div>
        <h3 className="font-bold text-[#f6f6fc] text-lg">{title}</h3>
        {subtitle && <p className="text-[#aaabb0] text-xs">{subtitle}</p>}
      </div>
    </div>
    <button onClick={onClose} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all">
      <X className="w-5 h-5" />
    </button>
  </div>
);

const inputCls = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none focus:border-[#99a8ff]/50 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2";

/* ─── Project Card ───────────────────────────────────────────────────── */
const ProjectCard = ({ project, onDetails, onManageAssets }) => {
  const status = getStatusMeta(project.status);
  const StatusIcon = status.Icon;

  return (
    <div className="group bg-[#111318] rounded-3xl border border-[#46484d]/10 hover:border-[#99a8ff]/20 hover:bg-[#171a1f] transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#99a8ff] to-[#4765f9] opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-bold text-[#f6f6fc] text-lg leading-snug flex-1 pr-3">{project.projectName}</h3>
          <span className={cx('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shrink-0', status.color)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>

        {/* Client */}
        <div className="flex items-center gap-2 text-sm text-[#aaabb0] mb-5">
          <User className="w-3.5 h-3.5" />
          <span>{project.clientName || '—'}</span>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#aaabb0] mb-2">
            <span>Milestone Progress</span>
            <span className="text-[#f6f6fc]">{status.progress}%</span>
          </div>
          <div className="h-1.5 bg-[#0c0e12] rounded-full overflow-hidden">
            <div
              className={cx('h-full rounded-full transition-all duration-700', project.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-gradient-to-r from-[#99a8ff] to-[#4765f9]')}
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#0c0e12] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-1">
              <Calendar className="w-3 h-3" /> Deadline
            </div>
            <p className="text-sm font-semibold text-[#f6f6fc]">
              {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
            </p>
          </div>
          <div className="bg-[#0c0e12] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-1">
              <DollarSign className="w-3 h-3" /> Budget
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              ${project.budget?.toLocaleString() || '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onDetails(project)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] hover:bg-[#2c3038] transition-all"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Details
          </button>
          <button
            onClick={() => onManageAssets(project)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5" /> Assets
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────── */
const ProjectManagementPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [detailsProject, setDetailsProject] = useState(null);
  const [assetsProject, setAssetsProject] = useState(null);
  const [projectAssets, setProjectAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '', clientName: '', status: 'PLANNING',
    startDate: '', deadline: '', budget: 0
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content/projects');
      if (res.data?.success) setProjects(res.data.data?.content || res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
      toast.error('Failed to load project data');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'content') fetchProjects();
  }, [user, sector]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/content/projects', newProject);
      if (res.data?.success) {
        toast.success(res.data.message || 'Project created successfully');
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
    } finally { setAssetsLoading(false); }
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-[#111318] rounded-3xl border border-[#46484d]/20 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400" />
          <h2 className="text-2xl font-bold text-[#f6f6fc]">Content Sector Access Only</h2>
          <p className="text-[#aaabb0]">Please log in with content creator credentials to manage projects.</p>
          <Link to="/login" className="px-8 py-3 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans">
      {/* Ambient glows */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Projects</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Project Management</h1>
            <p className="text-[#aaabb0] max-w-lg">
              Orchestrate creative workflows, track milestones, and manage client budgets from one observatory.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: projects.length, color: 'text-[#99a8ff] bg-[#99a8ff]/10 border-[#99a8ff]/20', Icon: Layers },
            { label: 'In Progress', value: projects.filter(p => p.status === 'IN_PROGRESS').length, color: 'text-sky-300 bg-sky-500/10 border-sky-500/20', Icon: Clock },
            { label: 'Completed', value: projects.filter(p => p.status === 'COMPLETED').length, color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', Icon: CheckCircle2 },
            { label: 'Planning', value: projects.filter(p => p.status === 'PLANNING').length, color: 'text-amber-300 bg-amber-500/10 border-amber-500/20', Icon: Eye },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-[#111318] rounded-2xl p-4 border border-[#46484d]/10 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#f6f6fc]">{value}</p>
                <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" />
            <p className="text-[#aaabb0] text-sm">Loading creative workspace…</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 bg-[#111318] rounded-3xl border border-dashed border-[#46484d]/20">
            <Layers className="w-16 h-16 text-[#46484d]" />
            <p className="text-xl text-[#aaabb0] font-semibold">No projects in the pipeline</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] active:scale-95 transition-all">
              <Plus className="w-4 h-4" /> Create First Project
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onDetails={setDetailsProject}
                onManageAssets={handleManageAssets}
              />
            ))}
          </section>
        )}
      </main>

      {/* ── Create Modal ── */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ModalHeader icon={Plus} title="Create New Project" subtitle="Launch a new creative workflow" onClose={() => setIsModalOpen(false)} />
          <form onSubmit={handleCreateProject} className="p-6 space-y-5">
            <div>
              <label className={labelCls}>Project Title</label>
              <input type="text" required placeholder="e.g. Q4 Brand Campaign" className={inputCls}
                value={newProject.projectName} onChange={e => setNewProject({ ...newProject, projectName: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Client Name</label>
              <input type="text" required placeholder="e.g. Acme Corp" className={inputCls}
                value={newProject.clientName} onChange={e => setNewProject({ ...newProject, clientName: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" required className={inputCls}
                  value={newProject.startDate} onChange={e => setNewProject({ ...newProject, startDate: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Deadline</label>
                <input type="date" required className={inputCls}
                  value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Total Budget ($)</label>
              <input type="number" required placeholder="0" className={inputCls}
                value={newProject.budget} onChange={e => setNewProject({ ...newProject, budget: parseInt(e.target.value) })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all">Launch Project</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Details Modal ── */}
      {detailsProject && (() => {
        const status = getStatusMeta(detailsProject.status);
        return (
          <Modal onClose={() => setDetailsProject(null)}>
            <ModalHeader icon={BarChart2} title="Project Details" onClose={() => setDetailsProject(null)} />
            <div className="p-6 space-y-4">
              <div className="bg-[#0c0e12] rounded-2xl p-5">
                <h2 className="text-2xl font-black text-[#f6f6fc]">{detailsProject.projectName}</h2>
                <p className="text-xs text-[#aaabb0] font-mono mt-1">Project #{detailsProject.id}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Client', value: detailsProject.clientName || '—', Icon: User },
                  { label: 'Status', value: null, badge: status },
                  { label: 'Start Date', value: detailsProject.startDate ? new Date(detailsProject.startDate).toLocaleDateString() : '—', Icon: Calendar },
                  { label: 'Deadline',   value: detailsProject.deadline   ? new Date(detailsProject.deadline).toLocaleDateString()   : '—', Icon: Calendar },
                ].map(({ label, value, Icon: Ic, badge }) => (
                  <div key={label} className="bg-[#0c0e12] rounded-xl p-4">
                    <p className="text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-1">{label}</p>
                    {badge ? (
                      <span className={cx('flex items-center gap-1.5 text-xs font-bold uppercase', badge.color.split(' ')[0])}>
                        {badge.label}
                      </span>
                    ) : (
                      <p className="font-bold text-[#f6f6fc] text-sm">{value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                <p className="text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-1">Budget</p>
                <p className="font-black text-2xl text-emerald-400">${detailsProject.budget?.toLocaleString() || '—'}</p>
              </div>
              <div className="bg-[#0c0e12] rounded-xl p-4">
                <div className="flex justify-between text-[10px] text-[#aaabb0] uppercase tracking-widest font-bold mb-2">
                  <span>Completion</span><span className="text-[#f6f6fc]">{status.progress}%</span>
                </div>
                <div className="h-1.5 bg-[#23262c] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#99a8ff] to-[#4765f9] rounded-full" style={{ width: `${status.progress}%` }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={() => setDetailsProject(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Close</button>
              <button onClick={() => { handleManageAssets(detailsProject); setDetailsProject(null); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> View Assets
              </button>
            </div>
          </Modal>
        );
      })()}

      {/* ── Assets Modal ── */}
      {assetsProject && (
        <Modal onClose={() => setAssetsProject(null)}>
          <ModalHeader icon={FolderOpen} title={`Assets — ${assetsProject.projectName}`} onClose={() => setAssetsProject(null)} />
          <div className="p-6">
            {assetsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" />
              </div>
            ) : projectAssets.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-[#46484d] mx-auto mb-3" />
                <p className="text-[#aaabb0] italic text-sm">No assets linked to this project yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectAssets.map(asset => (
                  <div key={asset.id} className="flex items-center gap-3 p-4 bg-[#0c0e12] rounded-xl hover:bg-[#171a1f] transition-colors">
                    <FileText className="w-5 h-5 text-[#99a8ff] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#f6f6fc] truncate">{asset.title}</p>
                      <p className="text-xs text-[#aaabb0]">{asset.type} · #{asset.id}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-[#23262c] text-[#aaabb0] rounded-md border border-[#46484d]/20">{asset.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 p-6 pt-0">
            <button onClick={() => setAssetsProject(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Close</button>
            <button onClick={() => { toast.success('Redirecting to Asset Library…'); setAssetsProject(null); }}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Asset
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectManagementPage;
