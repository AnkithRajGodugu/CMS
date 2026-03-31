import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import { Clock, Play, Pause, Square, AlertTriangle } from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const TimeTrackingPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects]           = useState([]);
  const [running, setRunning]             = useState(false);
  const [elapsed, setElapsed]             = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [logs, setLogs]                   = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'content') {
      api.get('/content/projects')
        .then(res => setProjects(Array.isArray(res.data?.data) ? res.data.data : []))
        .catch(() => toast.error('Failed to load projects'));
    }
  }, [user]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleStop = () => {
    if (elapsed === 0) return;
    setRunning(false);
    const proj = projects.find(p => String(p.id) === selectedProject);
    setLogs(prev => [{ project: proj?.projectName || 'Unknown', duration: formatTime(elapsed), date: new Date().toLocaleDateString() }, ...prev]);
    setElapsed(0);
    toast.success('Session logged successfully!');
  };

  const totalHrs = logs.reduce((sum, l) => {
    const parts = l.duration.split(':').map(Number);
    return sum + parts[0] + parts[1] / 60;
  }, 0);

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
        <section className="mb-12 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
            <span className="text-[#46484d]">/</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Time Tracking</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Time Tracking</h1>
          <p className="text-[#aaabb0] max-w-lg">Accurate billable hour tracking linked to your client projects.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer */}
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-8 flex flex-col items-center text-center">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-6">
              <Clock className="w-8 h-8 text-amber-300" />
            </div>
            <h2 className="font-bold text-[#f6f6fc] text-xl mb-2">Active Timer</h2>
            <p className="text-[#aaabb0] text-sm mb-8">Select a project and start tracking</p>

            {/* Clock face */}
            <div className={cx(
              'font-mono font-black tracking-widest text-7xl mb-8 transition-colors',
              running ? 'text-amber-300' : 'text-[#46484d]'
            )}>
              {formatTime(elapsed)}
            </div>

            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              className="w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] focus:outline-none focus:border-[#99a8ff]/50 transition-all mb-6 appearance-none"
            >
              <option value="">— Select Project —</option>
              {projects.map(p => <option key={p.id} value={String(p.id)}>{p.projectName}</option>)}
            </select>

            <div className="flex gap-4 w-full">
              {!running ? (
                <button
                  onClick={() => setRunning(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-emerald-400 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4" /> Start
                </button>
              ) : (
                <button
                  onClick={() => setRunning(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-amber-900 bg-amber-300 hover:bg-amber-400 active:scale-95 transition-all"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              )}
              <button
                onClick={handleStop}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-red-200 bg-red-500/15 border border-red-500/20 hover:bg-red-500/25 active:scale-95 transition-all"
              >
                <Square className="w-4 h-4" /> Stop & Log
              </button>
            </div>
          </div>

          {/* Summary & History */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2">Total Hours</p>
                <p className="text-3xl font-extrabold text-amber-300">{totalHrs.toFixed(1)}h</p>
              </div>
              <div className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2">Sessions</p>
                <p className="text-3xl font-extrabold text-[#f6f6fc]">{logs.length}</p>
              </div>
            </div>

            {/* Session history */}
            <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
              <div className="px-6 py-5 border-b border-[#46484d]/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#aaabb0]">Session History</h2>
              </div>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <Clock className="w-10 h-10 text-[#46484d]" />
                  <p className="text-[#46484d] italic text-sm">No sessions recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#46484d]/10">
                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">Project</th>
                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">Duration</th>
                        <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((l, i) => (
                        <tr key={i} className="border-b border-[#46484d]/5 hover:bg-[#171a1f] transition-colors">
                          <td className="px-6 py-4 font-bold text-[#f6f6fc]">{l.project}</td>
                          <td className="px-6 py-4 font-mono text-amber-300">{l.duration}</td>
                          <td className="px-6 py-4 text-[#aaabb0]">{l.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeTrackingPage;
