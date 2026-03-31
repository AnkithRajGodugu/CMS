import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Globe, Share2, Plus, CheckCircle2, AlertTriangle,
  Youtube, Camera, Twitter, Settings, BarChart2, X, Radio
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');
const inputCls  = "w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all";
const labelCls  = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl">
      {children}
    </div>
  </div>
);

const getPlatformIcon = (name) => {
  if (!name) return <Globe className="w-6 h-6 text-violet-600" />;
  switch (name.toLowerCase()) {
    case 'youtube':    return <Youtube  className="w-6 h-6 text-red-600" />;
    case 'instagram':  return <Camera   className="w-6 h-6 text-pink-400" />;
    case 'twitter/x':  return <Twitter  className="w-6 h-6 text-sky-600" />;
    default:           return <Globe    className="w-6 h-6 text-violet-600" />;
  }
};

const ContentDistributionPage = () => {
  const { user, sector } = useAuth();
  const [platforms, setPlatforms]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [managePlatform, setManagePlatform]   = useState(null);
  const [campaignForm, setCampaignForm]       = useState({ name: '', platform: '', startDate: '', budget: '', goal: 'AWARENESS' });

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      api.get('/content/distribution')
        .then(res => { if (res.data?.success) setPlatforms(res.data.data?.content || res.data.data || []); })
        .catch(err => console.error('Failed to fetch distribution data', err))
        .finally(() => setLoading(false));
    }
  }, [user, sector]);

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    toast.success(`Campaign "${campaignForm.name}" created and queued for ${campaignForm.platform || 'all platforms'}!`);
    setIsNewCampaignOpen(false);
    setCampaignForm({ name: '', platform: '', startDate: '', budget: '', goal: 'AWARENESS' });
  };

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
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Distribution</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-3">Multi-Channel Distribution</h1>
            <p className="text-gray-500 max-w-lg">Central control for publishing creative assets across global networks and platforms.</p>
          </div>
          <button onClick={() => setIsNewCampaignOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </section>

        {/* Platform cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {loading ? (
            <div className="col-span-full flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-violet-300 border-t-[#99a8ff] animate-spin" />
            </div>
          ) : platforms.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 italic py-10">No connected platforms found.</p>
          ) : (
            platforms.map((p, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:border-violet-300 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-2.5 bg-gray-100 rounded-xl">{getPlatformIcon(p.platform)}</div>
                  <span className={cx('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border', p.status === 'CONNECTED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-gray-500 bg-gray-100 border-gray-200')}>
                    {p.status || 'UNKNOWN'}
                  </span>
                </div>
                <h2 className="font-black text-lg text-[#1F2937] mb-4">{p.platform}</h2>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Followers</p>
                    <p className="font-bold text-[#1F2937]">{p.followers?.toLocaleString() || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Active</p>
                    <p className="font-bold text-[#1F2937]">{p.activeCampaigns ?? '—'}</p>
                  </div>
                </div>
                <button onClick={() => setManagePlatform(p)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-gray-500 bg-[#F7F9FC] hover:text-[#1F2937] hover:bg-gray-50 transition-all border border-gray-100">
                  <Settings className="w-3.5 h-3.5" /> Manage
                </button>
              </div>
            ))
          )}
        </section>

        {/* Deliverables table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-[#1F2937]">Recent Deliverables</h2>
            </div>
            <span className="text-xs text-gray-500">Last synced 5 mins ago</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Deliverable', 'Platforms', 'Published', 'Status', 'Reach', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1F2937]">Organic Growth 2026 - Master Cut</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <Camera  className="w-4 h-4 text-pink-400" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">Oct 24, 2026</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[#1F2937]">250.4K</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-[#1F2937] transition-colors"
                      onClick={() => toast.info('Reach: 250.4K | Clicks: 18.2K | Engagement: 7.3% — top in Q4 campaign')}>
                      <BarChart2 className="w-3.5 h-3.5" /> View Insights
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Campaign Modal */}
      {isNewCampaignOpen && (
        <Modal onClose={() => setIsNewCampaignOpen(false)}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300"><Share2 className="w-5 h-5 text-violet-600" /></div>
              <h3 className="font-bold text-[#1F2937] text-lg">Create New Campaign</h3>
            </div>
            <button onClick={() => setIsNewCampaignOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleCampaignSubmit} className="p-6 space-y-5">
            <div>
              <label className={labelCls}>Campaign Name</label>
              <input type="text" required placeholder="e.g. Q2 Brand Awareness Push" className={inputCls}
                value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Platform</label>
                <select className={inputCls} value={campaignForm.platform} onChange={e => setCampaignForm({...campaignForm, platform: e.target.value})}>
                  <option value="">All Platforms</option>
                  {platforms.map((p, i) => <option key={i} value={p.platform}>{p.platform}</option>)}
                  <option value="YouTube">YouTube</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Campaign Goal</label>
                <select className={inputCls} value={campaignForm.goal} onChange={e => setCampaignForm({...campaignForm, goal: e.target.value})}>
                  <option value="AWARENESS">Brand Awareness</option>
                  <option value="ENGAGEMENT">Engagement</option>
                  <option value="CONVERSION">Conversion</option>
                  <option value="RETENTION">Retention</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Date</label>
                <input type="date" required className={inputCls} value={campaignForm.startDate} onChange={e => setCampaignForm({...campaignForm, startDate: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>Budget ($)</label>
                <input type="number" placeholder="5000" className={inputCls} value={campaignForm.budget} onChange={e => setCampaignForm({...campaignForm, budget: e.target.value})} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsNewCampaignOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg active:scale-95 transition-all">Launch Campaign</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Manage Platform Modal */}
      {managePlatform && (
        <Modal onClose={() => setManagePlatform(null)}>
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl">{getPlatformIcon(managePlatform.platform)}</div>
              <h3 className="font-bold text-[#1F2937] text-lg">Manage {managePlatform.platform}</h3>
            </div>
            <button onClick={() => setManagePlatform(null)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F7F9FC] rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Followers</p>
                <p className="text-2xl font-extrabold text-[#1F2937]">{managePlatform.followers?.toLocaleString() || '—'}</p>
              </div>
              <div className="bg-[#F7F9FC] rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Active Campaigns</p>
                <p className="text-2xl font-extrabold text-[#1F2937]">{managePlatform.activeCampaigns ?? '—'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-[#F7F9FC] rounded-xl p-4">
              <span className="font-bold text-[#1F2937] text-sm">Connection Status</span>
              <span className={cx('px-3 py-1 rounded-full text-xs font-bold uppercase border', managePlatform.status === 'CONNECTED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-700 bg-red-50 border-red-200')}>{managePlatform.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { toast.success(`Refreshing ${managePlatform.platform} analytics...`); setManagePlatform(null); }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-violet-600 bg-[#F7F9FC] border border-gray-100 hover:border-[#99a8ff]/30 transition-all">
                <Radio className="w-3.5 h-3.5" /> Refresh Analytics
              </button>
              <button onClick={() => { toast.error(`${managePlatform.platform} disconnected`); setManagePlatform(null); }}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-red-600 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all">
                Disconnect
              </button>
            </div>
          </div>
          <div className="flex gap-3 p-6 pt-0">
            <button onClick={() => setManagePlatform(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Close</button>
            <button onClick={() => { toast.success('Platform settings saved!'); setManagePlatform(null); }} className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg active:scale-95 transition-all">Save Changes</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ContentDistributionPage;
