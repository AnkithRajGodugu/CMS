import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaRobot, FaPlus, FaPlay, FaExclamationTriangle, FaCheckCircle, FaProjectDiagram, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'sonner';

const WorkflowAutomationPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/projects');
      if (response.data && response.data.success) {
        setProjects(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects for workflow', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'content') {
      fetchData();
    }
  }, [user]);

  if (!user || user.role !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <Header />
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials to manage automated workflows.</p>
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
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaRobot className="text-info" />
                Workflow Automation
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Streamline your creative pipeline with automated triggers, publishing rules, and asset syncing.</p>
            </div>
            <button className="btn btn-info btn-md shadow-lg gap-2 text-white">
              <FaPlus /> Create Automator
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                   <h2 className="card-title mb-6 border-b pb-2">Active Triggers</h2>
                   <div className="space-y-4">
                      {loading ? (
                         <span className="loading loading-dots loading-md text-info"></span>
                      ) : projects.length === 0 ? (
                         <p className="opacity-30 italic py-6 text-center">No active project automators.</p>
                      ) : (
                         projects.slice(0, 3).map((p, idx) => (
                           <div key={idx} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:bg-base-200/50">
                              <div className="flex items-center gap-4">
                                 <FaPlay className="text-success text-xs" />
                                 <div>
                                    <p className="font-bold font-mono text-sm uppercase">Auto-Sync: {p.projectName}</p>
                                    <p className="text-xs opacity-50">Event: Asset Upload → Trigger: YouTube Publish</p>
                                 </div>
                              </div>
                              <input type="checkbox" className="toggle toggle-info toggle-sm" defaultChecked />
                           </div>
                         ))
                      )}
                   </div>
                </div>
             </div>

             <div className="card bg-base-100 shadow-xl overflow-hidden">
                <div className="p-6 bg-info/5 flex items-center justify-between border-b border-info/20">
                   <h2 className="font-bold flex items-center gap-2">
                      <FaCheckCircle className="text-success" /> Automation History
                   </h2>
                   <button className="btn btn-ghost btn-xs">View Logs</button>
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
                         <tr>
                            <td>Today, 10:15</td>
                            <td className="font-bold">IG Distribution</td>
                            <td><span className="badge badge-success badge-xs">SUCCESS</span></td>
                            <td className="font-mono text-[10px]">1.2ms</td>
                         </tr>
                         <tr>
                            <td>Today, 09:30</td>
                            <td className="font-bold">YT Metadata Sync</td>
                            <td><span className="badge badge-success badge-xs">SUCCESS</span></td>
                            <td className="font-mono text-[10px]">0.8ms</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>

          <div className="card bg-gradient-to-r from-info/20 to-transparent mt-12 p-10 text-center border border-info/10">
             <FaRobot className="text-6xl text-info mx-auto mb-6 animate-bounce" />
             <h2 className="text-2xl font-black mb-2 uppercase tracking-widest">Master Automation Dashboard</h2>
             <p className="max-w-xl mx-auto opacity-60">You have saved <span className="font-bold text-info">124 hours</span> this month by using automated creative workflows. Keep optimizing your pipeline!</p>
             <button className="btn btn-info btn-wide text-white mt-8">Explore Templates</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WorkflowAutomationPage;
