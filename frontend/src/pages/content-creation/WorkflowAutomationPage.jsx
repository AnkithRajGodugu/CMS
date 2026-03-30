import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaRobot, FaPlus, FaPlay, FaExclamationTriangle, FaCheckCircle, FaTimes, FaList, FaLightbulb } from 'react-icons/fa';
import { toast } from 'sonner';

const AUTOMATION_TEMPLATES = [
  { name: 'Auto-Publish to YouTube', trigger: 'Asset Upload (VIDEO)', action: 'Publish to YouTube', icon: '📹' },
  { name: 'Instagram Story Push', trigger: 'Asset Upload (IMAGE)', action: 'Post to Instagram Stories', icon: '📸' },
  { name: 'Slack Notify on Approval', trigger: 'Milestone Approved', action: 'Send Slack Message', icon: '💬' },
  { name: 'Auto-Archive Completed Projects', trigger: 'Project COMPLETED', action: 'Move to Archive folder', icon: '📦' },
  { name: 'Weekly Performance Report', trigger: 'Every Monday 9AM', action: 'Email Analytics Summary', icon: '📊' },
  { name: 'Asset Sync to Cloud Drive', trigger: 'Asset Upload (ANY)', action: 'Sync to Google Drive', icon: '☁️' },
];

const WorkflowAutomationPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [automatorForm, setAutomatorForm] = useState({ name: '', trigger: 'ASSET_UPLOAD', action: 'PUBLISH_YOUTUBE', projectId: '' });
  const [activeAutomators, setActiveAutomators] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/content/projects');
      setProjects(Array.isArray(response.data?.data) ? response.data.data : response.data?.data?.content || []);
    } catch (err) {
      console.error('Failed to fetch projects for workflow', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      fetchData();
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

  const toggleAutomator = (id) => {
    setActiveAutomators(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const applyTemplate = (template) => {
    const newAutomator = {
      id: Date.now(),
      name: template.name,
      trigger: template.trigger,
      action: template.action,
      enabled: true,
      projectName: 'All Projects'
    };
    setActiveAutomators(prev => [...prev, newAutomator]);
    toast.success(`Template "${template.name}" applied and activated!`);
    setIsTemplatesModalOpen(false);
  };

  const mockLogs = [
    { date: 'Today, 10:15', action: 'IG Distribution', status: 'SUCCESS', latency: '1.2ms' },
    { date: 'Today, 09:30', action: 'YT Metadata Sync', status: 'SUCCESS', latency: '0.8ms' },
    { date: 'Today, 08:00', action: 'Cloud Drive Sync', status: 'SUCCESS', latency: '3.1ms' },
    { date: 'Yesterday, 22:00', action: 'Weekly Report Email', status: 'SUCCESS', latency: '120ms' },
    { date: 'Yesterday, 18:45', action: 'Slack Notification', status: 'FAILED', latency: 'timeout' },
  ];

  const allTriggers = [...(projects.slice(0, 3).map(p => ({
    id: p.id,
    label: `Auto-Sync: ${p.projectName}`,
    desc: 'Event: Asset Upload → Trigger: YouTube Publish',
    enabled: true
  }))), ...activeAutomators];

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials to manage automated workflows.</p>
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
                <FaRobot className="text-info" /> Workflow Automation
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Streamline your creative pipeline with automated triggers, publishing rules, and asset syncing.</p>
            </div>
            <button className="btn btn-info btn-md shadow-lg gap-2 text-white" onClick={() => setIsCreateModalOpen(true)}>
              <FaPlus /> Create Automator
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Triggers */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6 border-b pb-2">Active Triggers</h2>
                <div className="space-y-4">
                  {loading ? (
                    <span className="loading loading-dots loading-md text-info"></span>
                  ) : allTriggers.length === 0 ? (
                    <p className="opacity-30 italic py-6 text-center">No active automators. Create one to get started!</p>
                  ) : (
                    allTriggers.map((t, idx) => (
                      <div key={t.id || idx} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:bg-base-200/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <FaPlay className={`text-xs ${t.enabled !== false ? 'text-success' : 'text-base-content/30'}`} />
                          <div>
                            <p className="font-bold font-mono text-sm uppercase">{t.label || t.name}</p>
                            <p className="text-xs opacity-50">{t.desc || `${t.trigger} → ${t.action}`}</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="toggle toggle-info toggle-sm"
                          checked={t.enabled !== false}
                          onChange={() => toggleAutomator(t.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Automation History */}
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <div className="p-6 bg-info/5 flex items-center justify-between border-b border-info/20">
                <h2 className="font-bold flex items-center gap-2">
                  <FaCheckCircle className="text-success" /> Automation History
                </h2>
                <button className="btn btn-ghost btn-xs gap-1" onClick={() => setIsLogsModalOpen(true)}>
                  <FaList /> View Logs
                </button>
              </div>
              <div className="p-0">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th>Date</th>
                      <th>Action</th>
                      <th>Status</th>
                      <th>Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockLogs.slice(0, 3).map((log, i) => (
                      <tr key={i} className="hover">
                        <td className="text-xs opacity-60">{log.date}</td>
                        <td className="font-bold text-sm">{log.action}</td>
                        <td><span className={`badge badge-xs ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>{log.status}</span></td>
                        <td className="font-mono text-[10px]">{log.latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="card bg-gradient-to-r from-info/20 to-transparent mt-12 p-10 text-center border border-info/10">
            <FaRobot className="text-6xl text-info mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-widest">Master Automation Dashboard</h2>
            <p className="max-w-xl mx-auto opacity-60">
              You have saved <span className="font-bold text-info">124 hours</span> this month by using automated creative workflows. Keep optimizing your pipeline!
            </p>
            <button className="btn btn-info btn-wide text-white mt-8 gap-2" onClick={() => setIsTemplatesModalOpen(true)}>
              <FaLightbulb /> Explore Templates
            </button>
          </div>
        </div>
      </main>

      {/* Create Automator Modal */}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><FaRobot className="text-info" /> Create Automator</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsCreateModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreateAutomator} className="space-y-4">
              <div className="form-control">
                <label className="label">Automator Name</label>
                <input type="text" className="input input-bordered" placeholder="e.g. Auto-Publish to YouTube"
                  value={automatorForm.name} onChange={e => setAutomatorForm({...automatorForm, name: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label">Linked Project</label>
                <select className="select select-bordered"
                  value={automatorForm.projectId} onChange={e => setAutomatorForm({...automatorForm, projectId: e.target.value})}>
                  <option value="">All Projects</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                </select>
              </div>
              <div className="form-control">
                <label className="label">Trigger Event</label>
                <select className="select select-bordered"
                  value={automatorForm.trigger} onChange={e => setAutomatorForm({...automatorForm, trigger: e.target.value})}>
                  <option value="ASSET_UPLOAD">Asset Upload</option>
                  <option value="MILESTONE_APPROVED">Milestone Approved</option>
                  <option value="PROJECT_COMPLETED">Project Completed</option>
                  <option value="SCHEDULE_WEEKLY">Weekly Schedule</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">Automated Action</label>
                <select className="select select-bordered"
                  value={automatorForm.action} onChange={e => setAutomatorForm({...automatorForm, action: e.target.value})}>
                  <option value="PUBLISH_YOUTUBE">Publish to YouTube</option>
                  <option value="POST_INSTAGRAM">Post to Instagram</option>
                  <option value="SYNC_DRIVE">Sync to Cloud Drive</option>
                  <option value="NOTIFY_SLACK">Send Slack Notification</option>
                  <option value="EMAIL_REPORT">Send Email Report</option>
                </select>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-info text-white gap-2"><FaRobot /> Activate Automator</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {isLogsModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><FaList className="text-info" /> Automation Logs</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsLogsModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Automation Action</th>
                    <th>Status</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLogs.map((log, i) => (
                    <tr key={i} className="hover">
                      <td className="font-mono text-xs">{log.date}</td>
                      <td className="font-bold">{log.action}</td>
                      <td><span className={`badge badge-sm font-bold ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>{log.status}</span></td>
                      <td className="font-mono text-xs">{log.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setIsLogsModalOpen(false)}>Close</button>
              <button className="btn btn-outline gap-2" onClick={() => { toast.success('Log export started...'); }}>Export CSV</button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {isTemplatesModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2"><FaLightbulb className="text-warning" /> Automation Templates</h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsTemplatesModalOpen(false)}><FaTimes /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AUTOMATION_TEMPLATES.map((t, i) => (
                <div key={i} className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer border border-base-300">
                  <div className="card-body p-4">
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <h3 className="font-bold text-sm">{t.name}</h3>
                    <p className="text-xs opacity-50">Trigger: {t.trigger}</p>
                    <p className="text-xs opacity-50">Action: {t.action}</p>
                    <button className="btn btn-sm btn-info text-white mt-3 gap-1" onClick={() => applyTemplate(t)}>
                      Apply Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setIsTemplatesModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomationPage;
