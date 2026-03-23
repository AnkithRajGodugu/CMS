import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaFileAlt, FaPlus, FaFilter, FaDownload, FaExclamationTriangle, FaImage, FaVideo, FaFilePdf, FaProjectDiagram } from 'react-icons/fa';
import { toast } from 'sonner';

const AssetManagementPage = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: '',
    type: 'IMAGE',
    url: '',
    projectId: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assetsRes, projectsRes] = await Promise.all([
        api.get('/content/assets'),
        api.get('/content/projects')
      ]);
      
      if (assetsRes.data && assetsRes.data.success) {
        setAssets(assetsRes.data.data);
      }
      if (projectsRes.data && projectsRes.data.success) {
        setProjects(projectsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch asset data', err);
      toast.error('Failed to load asset management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'content') {
      fetchData();
    }
  }, [user]);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      // Backend createAsset expects Project object or similar structure if we want to link
      const payload = {
          title: newAsset.title,
          type: newAsset.type,
          url: newAsset.url,
          project: newAsset.projectId ? { id: parseInt(newAsset.projectId) } : null
      };

      const response = await api.post('/content/assets', payload);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Asset added successfully');
        setIsModalOpen(false);
        setNewAsset({ title: '', type: 'IMAGE', url: '', projectId: '' });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create asset', err);
    }
  };

  const getAssetIcon = (type) => {
    switch (type) {
      case 'IMAGE': return <FaImage className="text-info" />;
      case 'VIDEO': return <FaVideo className="text-error" />;
      case 'PDF': return <FaFilePdf className="text-warning" />;
      default: return <FaFileAlt className="text-primary" />;
    }
  };

  const filteredAssets = assets.filter(a => filterType === 'ALL' || a.type === filterType);

  if (!user || user.role !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials to manage digital assets.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaFileAlt className="text-primary" />
                Asset Library
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Central hub for high-fidelity media, documents, and project deliverables.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="join">
                <button 
                  className={`btn btn-sm join-item ${filterType === 'ALL' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                  onClick={() => setFilterType('ALL')}
                >All</button>
                <button 
                  className={`btn btn-sm join-item ${filterType === 'IMAGE' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                  onClick={() => setFilterType('IMAGE')}
                >Images</button>
                <button 
                  className={`btn btn-sm join-item ${filterType === 'VIDEO' ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
                  onClick={() => setFilterType('VIDEO')}
                >Videos</button>
              </div>
              <button 
                className="btn btn-primary btn-md shadow-lg gap-2 text-white"
                onClick={() => setIsModalOpen(true)}
              >
                <FaPlus /> Upload Asset
              </button>
            </div>
          </div>

          {/* Asset Grid */}
          {loading ? (
             <div className="flex justify-center py-40">
                <span className="loading loading-spinner loading-xl text-primary"></span>
             </div>
          ) : filteredAssets.length === 0 ? (
             <div className="card bg-base-100 shadow-xl p-20 text-center flex flex-col items-center">
                <FaFileAlt className="text-6xl opacity-10 mb-4" />
                <p className="text-xl opacity-40 italic">No assets found in the library.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map(asset => (
                <div key={asset.id} className="card bg-base-100 shadow-md hover:shadow-2xl transition-all group overflow-hidden border border-base-200">
                  <figure className="h-48 bg-base-300 relative group-hover:scale-105 transition-transform duration-500">
                    {asset.type === 'IMAGE' ? (
                      <img src={asset.url || 'https://via.placeholder.com/300x200?text=Preview'} alt={asset.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-base-200">
                        {getAssetIcon(asset.type)}
                        <span className="ml-2 font-bold opacity-30">{asset.type}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       <button className="btn btn-circle btn-primary btn-sm mx-1"><FaDownload /></button>
                       <button className="btn btn-circle btn-ghost bg-white/20 btn-sm mx-1">Details</button>
                    </div>
                  </figure>
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                       <h2 className="card-title text-sm font-bold truncate pr-2">{asset.title}</h2>
                       <div className="text-xs opacity-50 font-mono">#{asset.id}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                       <div className="badge badge-outline badge-xs opacity-60">{asset.type}</div>
                       {asset.project && (
                         <div className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                           <FaProjectDiagram className="scale-75" />
                           {asset.project.projectName}
                         </div>
                       )}
                    </div>

                    <div className="divider my-2 opacity-10"></div>
                    
                    <div className="flex justify-between items-center text-[10px] opacity-40 uppercase font-bold tracking-widest">
                       <span>Uploaded</span>
                       <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <FaPlus className="text-primary" /> Register Digital Asset
            </h3>
            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div className="form-control">
                <label className="label">Asset Title</label>
                <input type="text" className="input input-bordered" required
                  value={newAsset.title} onChange={e => setNewAsset({...newAsset, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Type</label>
                  <select className="select select-bordered" 
                    value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})}>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="PDF">PDF</option>
                    <option value="DOCUMENT">Document</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Link Project</label>
                  <select className="select select-bordered"
                    value={newAsset.projectId} onChange={e => setNewAsset({...newAsset, projectId: e.target.value})}>
                    <option value="">No Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label">URL / Path</label>
                <input type="text" className="input input-bordered" required
                  placeholder="https://storage.provider.com/..."
                  value={newAsset.url} onChange={e => setNewAsset({...newAsset, url: e.target.value})} />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary text-white px-8">Confirm Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagementPage;
