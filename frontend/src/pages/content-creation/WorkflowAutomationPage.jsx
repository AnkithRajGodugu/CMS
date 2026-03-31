import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Bot, Plus, Play, AlertTriangle, CheckCircle2, X,
  List, Lightbulb, Zap, ChevronRight
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls = "w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all";
const labelCls = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      {children}
    </div>
  </div>
);

const AUTOMATION_TEMPLATES = [
  { name: 'Auto-Publish to YouTube',        trigger: 'Asset Upload (VIDEO)',   action: 'Publish to YouTube',       icon: '📹' },
  { name: 'Instagram Story Push',           trigger: 'Asset Upload (IMAGE)',   action: 'Post to Instagram Stories', icon: '📸' },
  { name: 'Slack Notify on Approval',       trigger: 'Milestone Approved',     action: 'Send Slack Message',        icon: '💬' },
  { name: 'Auto-Archive Completed Projects', trigger: 'Project COMPLETED',    action: 'Move to Archive folder',    icon: '📦' },
  { name: 'Weekly Performance Report',      trigger: 'Every Monday 9AM',       action: 'Email Analytics Summary',   icon: '📊' },
  { name: 'Asset Sync to Cloud Drive',      trigger: 'Asset Upload (ANY)',     action: 'Sync to Google Drive',      icon: '☁️' },
];

const MOCK_LOGS = [
  { date: 'Today, 10:15',      action: 'IG Distribution',    status: 'SUCCESS', latency: '1.2ms' },
  { date: 'Today, 09:30',      action: 'YT Metadata Sync',   status: 'SUCCESS', latency: '0.8ms' },
  { date: 'Today, 08:00',      action: 'Cloud Drive Sync',   status: 'SUCCESS', latency: '3.1ms' },
  { date: 'Yesterday, 22:00',  action: 'Weekly Report Email', status: 'SUCCESS', latency: '120ms' },
  { date: 'Yesterday, 18:45',  action: 'Slack Notification', status: 'FAILED',  latency: 'timeout' },
];

const WorkflowAutomationPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen]       = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen]           = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [automatorForm, setAutomatorForm]   = useState({ name: '', trigger: 'ASSET_UPLOAD', action: 'PUBLISH_YOUTUBE', projectId: '' });
  const [activeAutomators, setActiveAutomators]         = useState([]);

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      api.get('/content/projects')
        .then(res => setProjects(Array.isArray(res.data?.data) ? res.data.data : res.data?.data?.content || []))
        .catch(err => console.error('Failed to fetch projects for workflow', err))
        .finally(() => setLoading(false));
    }
  }, [user, sector]);

  const handleCreateAutomator = (e) => {
    e.preventDefault();
    const proj = projects.find(p => String(p.id) === automatorForm.projectId);
    const newAutomator = {
      id: Date.now(),
      name: automatorForm.name || `Auto-Sync: ${proj?.projectName || 'All Projects'}`,
      trigger: automatorForm.trigger,
      action: automatorForm.action,
      enabled: true,
      projectName: proj?.projectName || 'All Projects'
    };
    setActiveAutomators(prev => [...prev, newAutomator]);
    toast.success(`Automator "${newAutomator.name}" created and activated!`);
    setIsCreateModalOpen(false);
    setAutomatorForm({ name: '', trigger: 'ASSET_UPLOAD', action: 'PUBLISH_YOUTUBE', projectId: '' });
  };

  const toggleAutomator = (id) => setActiveAutomators(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));

  const applyTemplate = (template) => {
    const newAutomator = { id: Date.now(), name: template.name, trigger: template.trigger, action: template.action, enabled: true, projectName: 'All Projects' };
    setActiveAutomators(prev => [...prev, newAutomator]);
    toast.success(`Template "${template.name}" applied and activated!`);
    setIsTemplatesModalOpen(false);
  };

  const allTriggers = [...(projects.slice(0, 3).map(p => ({ id: p.id, label: `Auto-Sync: ${p.projectName}`, desc: 'Event: Asset Upload → Trigger: YouTube Publish', enabled: true }))), ...activeAutomators];

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
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Workflow Automation</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-3">Workflow Automation</h1>
            <p className="text-gray-500 max-w-lg">Streamline your creative pipeline with automated triggers, publishing rules, and asset syncing.</p>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> Create Automator
          </button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Active Triggers */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-[#1F2937]">Active Triggers</h2>
              <span className="text-xs text-gray-500">{allTriggers.length} automators</span>
            </div>
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-[#99a8ff] animate-spin" /></div>
              ) : allTriggers.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Bot className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-400 italic text-sm">No active automators. Create one to get started!</p>
                </div>
              ) : (
                allTriggers.map((t, idx) => (
                  <div key={t.id || idx} className="flex items-center justify-between p-4 bg-[#F7F9FC] rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cx('p-1.5 rounded-lg', t.enabled !== false ? 'bg-emerald-500/10' : 'bg-gray-100')}>
                        <Play className={cx('w-3 h-3', t.enabled !== false ? 'text-emerald-600' : 'text-gray-400')} />
                      </div>
                      <div>
                        <p className="font-bold font-mono text-xs uppercase text-[#1F2937]">{t.label || t.name}</p>
                        <p className="text-[10px] text-gray-500">{t.desc || `${t.trigger} → ${t.action}`}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAutomator(t.id)}
                      className={cx('relative w-10 h-5 rounded-full transition-colors duration-300', t.enabled !== false ? 'bg-[#99a8ff]' : 'bg-gray-100')}
                    >
                      <span className={cx('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300', t.enabled !== false ? 'translate-x-5' : 'translate-x-0.5')} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-[#1F2937]">Automation History</h2>
              </div>
              <button onClick={() => setIsLogsModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-[#1F2937] transition-colors">
                <List className="w-3.5 h-3.5" /> View Logs
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Date', 'Action', 'Status', 'Latency'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LOGS.slice(0, 3).map((log, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5 text-xs text-gray-500 font-mono">{log.date}</td>
                      <td className="px-6 py-3.5 font-bold text-sm text-[#1F2937]">{log.action}</td>
                      <td className="px-6 py-3.5">
                        <span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', log.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-500/10' : 'text-red-600 bg-red-500/10')}>{log.status}</span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[10px] text-gray-500">{log.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#99a8ff]/10 to-[#4765f9]/5 rounded-3xl border border-[#99a8ff]/10 p-10 text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#99a8ff]/10 rounded-full blur-2xl" />
          <Bot className="w-14 h-14 text-violet-600 mx-auto mb-5 animate-bounce" />
          <h2 className="text-2xl font-black mb-2 uppercase tracking-widest text-[#1F2937]">Master Automation Dashboard</h2>
          <p className="max-w-xl mx-auto text-gray-500 text-sm">
            You have saved <span className="font-bold text-violet-600">124 hours</span> this month by using automated creative workflows. Keep optimizing your pipeline!
          </p>
          <button onClick={() => setIsTemplatesModalOpen(true)}
            className="mt-8 flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] mx-auto hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all">
            <Lightbulb className="w-4 h-4" /> Explore Templates
          </button>
        </div>
      </main>

      {/* Create Automator Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300"><Bot className="w-5 h-5 text-violet-600" /></div>
              <h3 className="font-bold text-[#1F2937] text-lg">Create Automator</h3>
            </div>
            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleCreateAutomator} className="p-6 space-y-5">
            <div>
              <label className={labelCls}>Automator Name</label>
              <input type="text" placeholder="e.g. Auto-Publish to YouTube" className={inputCls}
                value={automatorForm.name} onChange={e => setAutomatorForm({...automatorForm, name: e.target.value})} />
            </div>
            <div>
              <label className={labelCls}>Linked Project</label>
              <select className={inputCls} value={automatorForm.projectId} onChange={e => setAutomatorForm({...automatorForm, projectId: e.target.value})}>
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Trigger Event</label>
                <select className={inputCls} value={automatorForm.trigger} onChange={e => setAutomatorForm({...automatorForm, trigger: e.target.value})}>
                  <option value="ASSET_UPLOAD">Asset Upload</option>
                  <option value="MILESTONE_APPROVED">Milestone Approved</option>
                  <option value="PROJECT_COMPLETED">Project Completed</option>
                  <option value="SCHEDULE_WEEKLY">Weekly Schedule</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Automated Action</label>
                <select className={inputCls} value={automatorForm.action} onChange={e => setAutomatorForm({...automatorForm, action: e.target.value})}>
                  <option value="PUBLISH_YOUTUBE">Publish to YouTube</option>
                  <option value="POST_INSTAGRAM">Post to Instagram</option>
                  <option value="SYNC_DRIVE">Sync to Cloud Drive</option>
                  <option value="NOTIFY_SLACK">Send Slack Notification</option>
                  <option value="EMAIL_REPORT">Send Email Report</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg active:scale-95 transition-all">Activate Automator</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Logs Modal */}
      {isLogsModalOpen && (
        <Modal onClose={() => setIsLogsModalOpen(false)}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300"><List className="w-5 h-5 text-violet-600" /></div>
              <h3 className="font-bold text-[#1F2937] text-lg">Automation Logs</h3>
            </div>
            <button onClick={() => setIsLogsModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#F7F9FC]">
                    {['Date & Time', 'Action', 'Status', 'Latency'].map(h => <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LOGS.map((log, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.date}</td>
                      <td className="px-4 py-3 font-bold text-[#1F2937]">{log.action}</td>
                      <td className="px-4 py-3"><span className={cx('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', log.status === 'SUCCESS' ? 'text-emerald-600 bg-emerald-500/10' : 'text-red-600 bg-red-500/10')}>{log.status}</span></td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setIsLogsModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Close</button>
              <button onClick={() => toast.success('Log export started...')} className="flex-1 py-3 rounded-xl text-sm font-bold text-violet-600 bg-[#99a8ff]/10 border border-violet-300 hover:bg-[#99a8ff]/20 transition-all">Export CSV</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Templates Modal */}
      {isTemplatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200"><Lightbulb className="w-5 h-5 text-amber-600" /></div>
                <h3 className="font-bold text-[#1F2937] text-lg">Automation Templates</h3>
              </div>
              <button onClick={() => setIsTemplatesModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {AUTOMATION_TEMPLATES.map((t, i) => (
                <div key={i} className="bg-[#F7F9FC] rounded-2xl p-5 border border-gray-100 hover:border-violet-300 transition-all group">
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h3 className="font-bold text-sm text-[#1F2937] mb-1">{t.name}</h3>
                  <p className="text-xs text-gray-500 mb-0.5">Trigger: {t.trigger}</p>
                  <p className="text-xs text-gray-500 mb-4">Action: {t.action}</p>
                  <button onClick={() => applyTemplate(t)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-md active:scale-95 transition-all">
                    <Zap className="w-3 h-3" /> Apply Template
                  </button>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0">
              <button onClick={() => setIsTemplatesModalOpen(false)} className="w-full py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomationPage;
