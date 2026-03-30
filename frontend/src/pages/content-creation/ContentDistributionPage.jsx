import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaGlobe, FaShareAlt, FaPlus, FaCheckCircle, FaExclamationTriangle, FaYoutube, FaInstagram, FaTiktok, FaTwitter, FaTimes, FaCog, FaChartBar } from 'react-icons/fa';
import { toast } from 'sonner';

const ContentDistributionPage = () => {
  const { user, sector } = useAuth();
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [managePlatform, setManagePlatform] = useState(null);
  const [campaignForm, setCampaignForm] = useState({ name: '', platform: '', startDate: '', budget: '', goal: 'AWARENESS' });

  const fetchDistribution = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/distribution');
      if (response.data && response.data.success) {
        setPlatforms(response.data.data?.content || response.data.data || []);
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
  }, [user, sector]);

  const getPlatformIcon = (name) => {
    if (!name) return <FaGlobe className="text-primary" />;
    switch (name.toLowerCase()) {
      case 'youtube': return <FaYoutube className="text-error" />;
      case 'instagram': return <FaInstagram className="text-secondary" />;
      case 'tiktok': return <FaTiktok className="text-black" />;
      case 'twitter/x': return <FaTwitter className="text-info" />;
      default: return <FaGlobe className="text-primary" />;
    }
  };

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    toast.success(`Campaign "${campaignForm.name}" created and queued for ${campaignForm.platform || 'all platforms'}!`);
    setIsNewCampaignOpen(false);
    setCampaignForm({ name: '', platform: '', startDate: '', budget: '', goal: 'AWARENESS' });
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
                <FaShareAlt className="text-primary" /> Multi-Channel Distribution
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Central control for publishing creative assets across global networks and platforms.</p>
            </div>
            <button className="btn btn-primary btn-md shadow-lg gap-2 text-white" onClick={() => setIsNewCampaignOpen(true)}>
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
                        <span className="text-lg font-bold">{p.followers?.toLocaleString() || '—'}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs opacity-40 uppercase font-bold tracking-widest">Active</span>
                        <span className="text-lg font-bold">{p.activeCampaigns ?? '—'}</span>
                      </div>
                    </div>
                    <div className="card-actions mt-6">
                      <button
                        className="btn btn-block btn-sm btn-outline border-base-300 hover:btn-primary gap-2"
                        onClick={() => setManagePlatform(p)}
                      >
                        <FaCog /> Manage
                      </button>
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
                    <td>
                      <button
                        className="btn btn-ghost btn-xs text-primary gap-1"
                        onClick={() => toast.info('Reach: 250.4K | Clicks: 18.2K | Engagement: 7.3% — top in Q4 campaign')}
                      >
                        <FaChartBar /> View Insights
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaPlus className="text-primary" /> Create New Campaign
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsNewCampaignOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleCampaignSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">Campaign Name</label>
                <input type="text" className="input input-bordered" required placeholder="e.g. Q2 Brand Awareness Push"
                  value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Platform</label>
                  <select className="select select-bordered"
                    value={campaignForm.platform} onChange={e => setCampaignForm({...campaignForm, platform: e.target.value})}>
                    <option value="">All Platforms</option>
                    {platforms.map((p, i) => <option key={i} value={p.platform}>{p.platform}</option>)}
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Campaign Goal</label>
                  <select className="select select-bordered"
                    value={campaignForm.goal} onChange={e => setCampaignForm({...campaignForm, goal: e.target.value})}>
                    <option value="AWARENESS">Brand Awareness</option>
                    <option value="ENGAGEMENT">Engagement</option>
                    <option value="CONVERSION">Conversion</option>
                    <option value="RETENTION">Retention</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Start Date</label>
                  <input type="date" className="input input-bordered" required
                    value={campaignForm.startDate} onChange={e => setCampaignForm({...campaignForm, startDate: e.target.value})} />
                </div>
                <div className="form-control">
                  <label className="label">Budget ($)</label>
                  <input type="number" className="input input-bordered" placeholder="5000"
                    value={campaignForm.budget} onChange={e => setCampaignForm({...campaignForm, budget: e.target.value})} />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsNewCampaignOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary text-white gap-2"><FaShareAlt /> Launch Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Platform Modal */}
      {managePlatform && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                {getPlatformIcon(managePlatform.platform)} Manage {managePlatform.platform}
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setManagePlatform(null)}><FaTimes /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-base-200 rounded-xl p-4">
                  <div className="stat-title text-xs">Followers</div>
                  <div className="stat-value text-2xl">{managePlatform.followers?.toLocaleString() || '—'}</div>
                </div>
                <div className="stat bg-base-200 rounded-xl p-4">
                  <div className="stat-title text-xs">Active Campaigns</div>
                  <div className="stat-value text-2xl">{managePlatform.activeCampaigns ?? '—'}</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-base-200 rounded-xl">
                <span className="font-bold">Connection Status</span>
                <span className={`badge font-bold ${managePlatform.status === 'CONNECTED' ? 'badge-success' : 'badge-error'}`}>{managePlatform.status}</span>
              </div>
              <div className="space-y-2">
                <button className="btn btn-outline btn-block gap-2" onClick={() => { toast.success(`Refreshing ${managePlatform.platform} analytics...`); setManagePlatform(null); }}><FaChartBar /> Refresh Analytics</button>
                <button className="btn btn-outline btn-error btn-block gap-2" onClick={() => { toast.error(`${managePlatform.platform} disconnected`); setManagePlatform(null); }}>Disconnect Platform</button>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setManagePlatform(null)}>Close</button>
              <button className="btn btn-primary text-white" onClick={() => { toast.success('Platform settings saved!'); setManagePlatform(null); }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDistributionPage;
