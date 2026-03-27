import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaClock, FaPlay, FaPause, FaStop, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'sonner';

const TimeTrackingPage = () => {
  const { user, sector } = useAuth();
  const [projects, setProjects] = useState([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedProject, setSelectedProject] = useState('');
  const [logs, setLogs] = useState([]);
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
    setLogs(prev => [{
      project: proj?.projectName || 'Unknown',
      duration: formatTime(elapsed),
      date: new Date().toLocaleDateString()
    }, ...prev]);
    setElapsed(0);
    toast.success('Session logged successfully!');
  };

  const totalHrs = logs.reduce((sum, l) => {
    const parts = l.duration.split(':').map(Number);
    return sum + parts[0] + parts[1] / 60;
  }, 0);

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold flex items-center gap-4">
              <FaClock className="text-warning" /> Time Tracking
            </h1>
            <p className="text-base-content/60 mt-2 text-lg">Accurate billable hour tracking linked to your client projects.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Timer */}
            <div className="card bg-base-100 shadow-xl border-t-4 border-warning">
              <div className="card-body items-center text-center">
                <h2 className="card-title mb-6">Active Timer</h2>
                <div className="text-7xl font-mono font-black tracking-widest text-warning my-6">
                  {formatTime(elapsed)}
                </div>
                <select className="select select-bordered w-full max-w-sm mb-6" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                  <option value="">— Select Project —</option>
                  {projects.map(p => <option key={p.id} value={String(p.id)}>{p.projectName}</option>)}
                </select>
                <div className="flex gap-4">
                  {!running ? (
                    <button className="btn btn-success gap-2" onClick={() => setRunning(true)}><FaPlay /> Start</button>
                  ) : (
                    <button className="btn btn-warning gap-2" onClick={() => setRunning(false)}><FaPause /> Pause</button>
                  )}
                  <button className="btn btn-error gap-2" onClick={handleStop}><FaStop /> Stop & Log</button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="stats stats-vertical shadow bg-base-100 w-full">
                <div className="stat">
                  <div className="stat-title">Total Hours Logged</div>
                  <div className="stat-value text-warning">{totalHrs.toFixed(1)}h</div>
                  <div className="stat-desc">{logs.length} sessions recorded</div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-sm uppercase opacity-40 tracking-widest mb-4">Session History</h2>
                  {logs.length === 0 ? (
                    <p className="opacity-30 italic text-center py-6">No sessions recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead><tr><th>Project</th><th>Duration</th><th>Date</th></tr></thead>
                        <tbody>
                          {logs.map((l, i) => (
                            <tr key={i} className="hover">
                              <td className="font-bold">{l.project}</td>
                              <td className="font-mono text-warning">{l.duration}</td>
                              <td>{l.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimeTrackingPage;
