import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaGlobe, FaShareAlt, FaPlus, FaCheckCircle, FaExclamationTriangle, FaYoutube, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { toast } from 'sonner';

const ContentDistributionPage = () => {
  const { user, sector } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDistribution = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/distribution');
      if (response.data && response.data.success) {
        setPlatforms(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch distribution data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      fetchDistribution();
    }
  }, [user, sector]); // Added sector to dependency array

  const getPlatformIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'youtube': return <FaYoutube className="text-error" />;
      case 'instagram': return <FaInstagram className="text-secondary" />;
      case 'tiktok': return <FaTiktok className="text-black" />;
      case 'twitter/x': return <FaTwitter className="text-info" />;
      default: return <FaGlobe className="text-primary" />;
    }
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials for multi-channel distribution.</p>
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
                <FaShareAlt className="text-primary" />
                Multi-Channel Distribution
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Central control for publishing creative assets across global networks and platforms.</p>
            </div>
            <button className="btn btn-primary btn-md shadow-lg gap-2 text-white">
              <FaPlus /> New Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
               <div className="col-span-full flex justify-center py-20">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
               </div>
            ) : platforms.length === 0 ? (
               <p className="col-span-full text-center opacity-30 italic">No connected platforms found.</p>
            ) : (
              platforms.map((p, idx) => (
                <div key={idx} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow">
                   <div className="card-body">
                      <div className="flex justify-between items-center mb-4">
                         <div className="text-3xl">{getPlatformIcon(p.platform)}</div>
                         <div className={`badge badge-sm font-bold ${p.status === 'CONNECTED' ? 'badge-success' : 'badge-ghost'}`}>
                            {p.status}
                         </div>
                      </div>
                      <h2 className="card-title text-xl font-black">{p.platform}</h2>
                      <div className="flex justify-between items-center mt-4">
                         <div className="flex flex-col">
                            <span className="text-xs opacity-40 uppercase font-bold tracking-widest">Followers</span>
                            <span className="text-lg font-bold">{p.followers}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-xs opacity-40 uppercase font-bold tracking-widest">Active</span>
                            <span className="text-lg font-bold">{p.activeCampaigns}</span>
                         </div>
                      </div>
                      <div className="card-actions mt-6">
                         <button className="btn btn-block btn-sm btn-outline border-base-300 hover:bg-primary hover:border-primary">Manage</button>
                      </div>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="card bg-base-100 shadow-xl overflow-hidden border border-primary/20">
             <div className="p-6 bg-primary/5 flex justify-between items-center border-b border-primary/10">
                <h2 className="font-bold text-lg flex items-center gap-2">
                   <FaCheckCircle className="text-success" /> Recent Deliverables
                </h2>
                <span className="text-xs opacity-50">Last synced 5 mins ago</span>
             </div>
             <div className="overflow-x-auto">
                <table className="table table-zebra">
                   <thead>
                      <tr>
                         <th>Deliverable</th>
                         <th>Platforms</th>
                         <th>Published Date</th>
                         <th>Status</th>
                         <th>Reach</th>
                         <th>Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      <tr className="hover">
                         <td className="font-bold">Organic Growth 2026 - Master Cut</td>
                         <td>
                            <div className="flex gap-2">
                               <FaYoutube className="text-error" />
                               <FaInstagram className="text-secondary" />
                            </div>
                         </td>
                         <td>Oct 24, 2026</td>
                         <td><span className="badge badge-success badge-xs font-bold uppercase p-2">LIVE</span></td>
                         <td className="font-mono">250.4K</td>
                         <td><button className="btn btn-ghost btn-xs text-primary">View Insights</button></td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentDistributionPage;
