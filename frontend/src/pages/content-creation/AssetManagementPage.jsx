import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  Upload, Plus, Download, AlertTriangle, Image, Video, FileText,
  FolderOpen, Copy, ExternalLink, X, Search, Filter, Layers, LayoutGrid, List
} from 'lucide-react';

/* ─── tiny utility ─────────────────────────────────────────────────── */
const cx = (...classes) => classes.filter(Boolean).join(' ');

/* ─── type badge colour map ─────────────────────────────────────────── */
const TYPE_META = {
  IMAGE:    { label: 'Image',    color: 'text-violet-700 bg-violet-50 border-violet-200', Icon: Image },
  VIDEO:    { label: 'Video',    color: 'text-red-600    bg-red-500/10    border-red-500/20',    Icon: Video },
  PDF:      { label: 'PDF',      color: 'text-amber-600  bg-amber-500/10  border-amber-500/20',  Icon: FileText },
  DOCUMENT: { label: 'Doc',      color: 'text-sky-600    bg-sky-500/10    border-sky-500/20',    Icon: FileText },
};

/* ─── Filter pill ────────────────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cx(
      'px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
      active
        ? 'bg-gray-100 text-violet-600 shadow-inner shadow-[#99a8ff]/10'
        : 'text-gray-500 hover:text-[#1F2937] hover:bg-[#1d2025]'
    )}
  >
    {label}
  </button>
);

/* ─── Asset Card ─────────────────────────────────────────────────────── */
const AssetCard = ({ asset, onDownload, onDetails, featured = false }) => {
  const meta  = TYPE_META[asset.type] || TYPE_META.DOCUMENT;
  const Icon  = meta.Icon;
  const isImg = asset.type === 'IMAGE' && asset.url;

  if (featured) {
    return (
      <div className="lg:col-span-2 group relative overflow-hidden bg-gray-50 rounded-3xl border border-gray-100 hover:border-[#99a8ff]/30 transition-all duration-500">
        <div className="aspect-[21/9] w-full overflow-hidden bg-white flex items-center justify-center">
          {isImg ? (
            <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-20">
              <Icon className="w-16 h-16 text-violet-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{asset.type}</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e12] via-transparent to-transparent opacity-90 pointer-events-none" />
        <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={cx('px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border', meta.color)}>{meta.label}</span>
              {asset.project && (
                <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
                  <FolderOpen className="w-3 h-3" /> {asset.project.projectName}
                </span>
              )}
            </div>
            <h3 className="font-bold text-2xl tracking-tight text-[#1F2937]">{asset.title}</h3>
          </div>
          <button
            onClick={() => onDownload(asset)}
            className="p-4 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-gray-200 text-[#1F2937] hover:bg-[#99a8ff] hover:text-[#000] transition-all"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white p-5 rounded-3xl border border-gray-100 hover:bg-[#1d2025] hover:border-violet-300 transition-all duration-300 flex flex-col">
      <div className="aspect-square w-full rounded-2xl overflow-hidden mb-5 bg-[#F7F9FC] flex items-center justify-center relative">
        {isImg ? (
          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
        ) : (
          <>
            <Icon className="w-10 h-10 text-violet-600/20" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#99a8ff]/5 to-transparent pointer-events-none" />
          </>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onDownload(asset)}
            className="p-2.5 bg-[#99a8ff] text-[#000] rounded-xl hover:scale-110 transition-transform"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDetails(asset)}
            className="p-2.5 bg-white/20 text-white rounded-xl hover:scale-110 transition-transform"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#1F2937] text-base leading-snug truncate pr-2">{asset.title}</h3>
          <span className={cx('px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-md border shrink-0', meta.color)}>{meta.label}</span>
        </div>
        {asset.project && (
          <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-2">
            <FolderOpen className="w-3 h-3" /> {asset.project.projectName}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">ID #{asset.id}</span>
        <button onClick={() => onDownload(asset)} className="text-violet-600 hover:text-[#879aff] transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ─── Upload Modal ────────────────────────────────────────────────────── */
const UploadModal = ({ onClose, onSubmit, projects }) => {
  const [form, setForm] = useState({ title: '', type: 'IMAGE', url: '', projectId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300">
              <Upload className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] text-lg">Register Digital Asset</h3>
              <p className="text-gray-500 text-xs">Add a new asset to the library</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Asset Title</label>
            <input
              type="text" required
              placeholder="e.g. Q4 Brand Campaign"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-violet-400 transition-all appearance-none"
              >
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Link Project</label>
              <select
                value={form.projectId}
                onChange={e => setForm({ ...form, projectId: e.target.value })}
                className="w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] focus:outline-none focus:border-violet-400 transition-all appearance-none"
              >
                <option value="">No Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">URL / Path</label>
            <input
              type="text" required
              placeholder="https://storage.provider.com/..."
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] hover:bg-[#2c3038] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all"
            >
              Confirm Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Details Modal ───────────────────────────────────────────────────── */
const DetailsModal = ({ asset, onClose, onDownload, onCopyUrl }) => {
  const meta = TYPE_META[asset.type] || TYPE_META.DOCUMENT;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-md shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1F2937] text-lg">Asset Details</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {asset.type === 'IMAGE' && asset.url && (
            <img src={asset.url} alt={asset.title} className="w-full h-48 object-cover rounded-2xl" />
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F9FC] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Asset ID</p>
              <p className="font-mono font-bold text-[#1F2937]">#{asset.id}</p>
            </div>
            <div className="bg-[#F7F9FC] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Type</p>
              <span className={cx('text-xs font-bold uppercase', meta.color.split(' ')[0])}>{meta.label}</span>
            </div>
          </div>
          <div className="bg-[#F7F9FC] rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Title</p>
            <p className="font-bold text-[#1F2937]">{asset.title}</p>
          </div>
          {asset.project && (
            <div className="bg-[#99a8ff]/5 rounded-xl p-4 border border-[#99a8ff]/10">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Linked Project</p>
              <p className="font-bold text-violet-600">{asset.project.projectName}</p>
            </div>
          )}
          {asset.url && (
            <div className="bg-[#F7F9FC] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">URL</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-gray-500 truncate flex-1">{asset.url}</p>
                <button onClick={() => onCopyUrl(asset.url)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-[#1F2937] transition-colors shrink-0">
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Close</button>
          <button
            onClick={() => onDownload(asset)}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────────────── */
const AssetManagementPage = () => {
  const { user, sector } = useAuth();
  const [assets, setAssets]           = useState([]);
  const [projects, setProjects]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterType, setFilterType]   = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  /* ── data fetching ── */
  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsRes, projectsRes] = await Promise.all([
        api.get('/content/assets'),
        api.get('/content/projects'),
      ]);
      setAssets(assetsRes.data?.data?.content || assetsRes.data?.data || []);
      setProjects(projectsRes.data?.data?.content || projectsRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch asset data', err);
      toast.error('Failed to load asset management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') fetchData();
  }, [user, sector]);

  /* ── handlers ── */
  const handleCreateAsset = async (form) => {
    try {
      const payload = {
        title: form.title,
        type:  form.type,
        url:   form.url,
        project: form.projectId ? { id: parseInt(form.projectId) } : null,
      };
      const res = await api.post('/content/assets', payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'Asset added successfully');
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create asset', err);
      toast.error('Failed to create asset');
    }
  };

  const handleDownload = (asset) => {
    if (!asset.url) { toast.error('No download URL available'); return; }
    window.open(asset.url, '_blank');
    toast.success(`Downloading "${asset.title}"…`);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('URL copied to clipboard!'))
      .catch(()  => toast.error('Failed to copy URL'));
  };

  /* ── filtering ── */
  const filteredAssets = assets.filter(a => {
    const typeMatch  = filterType === 'ALL' || a.type === filterType;
    const queryMatch = !searchQuery || a.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && queryMatch;
  });

  /* ── access guard ── */
  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-white rounded-3xl border border-gray-200 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
          <h2 className="text-2xl font-bold text-[#1F2937]">Content Sector Access Only</h2>
          <p className="text-gray-500">Please log in with your content creator credentials to manage digital assets.</p>
          <Link to="/login" className="px-8 py-3 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937] font-sans">
      {/* Ambient glow decorations */}
      
      <div className="fixed top-0 left-0 w-[300px] h-[300px] bg-[#929bfa]/5 blur-[100px] rounded-full pointer-events-none -z-10 -translate-x-1/2 -translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Content Creation</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Asset Library</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-3">Asset Library</h1>
            <p className="text-gray-500 max-w-lg">
              Manage your creative production assets from a single observatory. Organize, filter, and deploy your digital inventory.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap"
          >
            <Upload className="w-4 h-4" /> Upload Asset
          </button>
        </section>

        {/* ── Search + Filters ── */}
        <section className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search assets…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#000] border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#99a8ff]/40 focus:ring-1 focus:ring-[#99a8ff]/10 transition-all"
            />
          </div>
          {/* Filter pills */}
          <div className="inline-flex p-1.5 bg-[#000] rounded-2xl border border-gray-100 gap-1">
            {['ALL', 'IMAGE', 'VIDEO', 'PDF', 'DOCUMENT'].map(t => (
              <FilterPill
                key={t}
                label={t === 'ALL' ? 'All Assets' : t.charAt(0) + t.slice(1).toLowerCase() + 's'}
                active={filterType === t}
                onClick={() => setFilterType(t)}
              />
            ))}
          </div>
        </section>

        {/* ── Stats Row ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {['ALL', 'IMAGE', 'VIDEO', 'PDF'].map(type => {
            const count = type === 'ALL' ? assets.length : assets.filter(a => a.type === type).length;
            const meta  = TYPE_META[type] || { label: 'Total', color: 'text-violet-700 bg-violet-50 border-violet-200', Icon: Layers };
            const Icon  = meta.Icon || Layers;
            return (
              <div key={type} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                <div className={cx('p-2.5 rounded-xl', meta.color.split(' ').slice(1).join(' '))}>
                  <Icon className={cx('w-5 h-5', meta.color.split(' ')[0])} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#1F2937]">{count}</p>
                  <p className="text-xs text-gray-500 font-medium">{type === 'ALL' ? 'Total Assets' : meta.label + 's'}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-violet-300 border-t-[#99a8ff] animate-spin" />
            <p className="text-gray-500 text-sm">Loading asset library…</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 bg-white rounded-3xl border border-dashed border-gray-200">
            <Layers className="w-16 h-16 text-gray-400" />
            <p className="text-xl text-gray-500 font-semibold">No assets found</p>
            <p className="text-gray-400 text-sm">Upload your first asset to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Upload Asset
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAssets.map((asset, idx) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDownload={handleDownload}
                onDetails={setSelectedAsset}
                featured={idx === 0 && filterType === 'ALL' && !searchQuery}
              />
            ))}
          </section>
        )}
      </main>

      {/* ── Modals ── */}
      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAsset}
          projects={projects}
        />
      )}
      {selectedAsset && (
        <DetailsModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onDownload={handleDownload}
          onCopyUrl={handleCopyUrl}
        />
      )}
    </div>
  );
};

export default AssetManagementPage;
