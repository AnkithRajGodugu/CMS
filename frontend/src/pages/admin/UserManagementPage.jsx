import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const UserManagementPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    sectorDistribution: {}
  });

  useEffect(() => {
    fetchUsersAndMetrics();
  }, []);

  const fetchUsersAndMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersRes = await api.get('/admin/users');
      if (usersRes.data && usersRes.data.users) {
        setUsers(usersRes.data.users);
      }

      // Fetch metrics
      const metricsRes = await api.get('/admin/metrics');
      if (metricsRes.data) {
        setStats({
          totalUsers: metricsRes.data.totalUsers,
          activeUsers: metricsRes.data.activeUsers,
          sectorDistribution: metricsRes.data.sectorDistribution || {}
        });
      }
      
    } catch (err) {
      setError('Failed to load user management data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex justify-center mt-20">
        <div className="alert alert-error shadow-lg w-auto">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Access Denied. Admin privileges required.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content tracking-tight">User Management</h1>
          <p className="text-base-content/60 mt-1">Manage users, view metrics, and adjust roles.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error shadow-sm rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow-md rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
          <div className="stat-title font-medium text-base-content/70">Total Users</div>
          <div className="stat-value text-primary">{loading ? <span className="loading loading-spinner text-primary"></span> : stats.totalUsers}</div>
          <div className="stat-desc mt-1">Registered accounts</div>
        </div>

        <div className="stat bg-base-100 shadow-md rounded-2xl border border-base-200">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div className="stat-title font-medium text-base-content/70">Active Users</div>
          <div className="stat-value text-success">{loading ? <span className="loading loading-spinner text-success"></span> : stats.activeUsers}</div>
          <div className="stat-desc mt-1">Enabled accounts</div>
        </div>

        <div className="bg-base-100 shadow-md rounded-2xl border border-base-200 p-6 flex flex-col justify-center">
           <h3 className="font-medium text-base-content/70 mb-4 tracking-wide text-sm uppercase">Sector Distribution</h3>
           
           {loading ? (
             <div className="flex justify-center py-4">
               <span className="loading loading-spinner text-primary"></span>
             </div>
           ) : (
             <div className="flex flex-col gap-3">
                {Object.keys(stats.sectorDistribution).length > 0 ? (
                  Object.entries(stats.sectorDistribution).map(([sector, count]) => (
                    <div key={sector} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{sector}</span>
                      <span className="badge badge-primary badge-outline font-semibold">{count}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-base-content/50 italic text-center">No assigned sectors yet</div>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden mt-2">
        <div className="p-6 border-b border-base-200 flex justify-between items-center bg-base-50">
          <h2 className="text-lg font-semibold text-base-content">User Directory</h2>
          
          <div className="join">
            <div>
              <div>
                <input className="input input-sm input-bordered join-item w-64 focus:outline-none focus:border-primary" placeholder="Search users by name..." />
              </div>
            </div>
            <button className="btn btn-sm btn-primary join-item hover:opacity-90 transition-opacity">Search</button>
          </div>
        </div>
        
        <div className="overflow-x-auto w-full">
          <table className="table table-zebra table-md w-full">
            <thead className="bg-base-200/50 text-base-content/80 text-sm">
              <tr>
                <th className="font-semibold uppercase tracking-wider pl-6 py-4">ID</th>
                <th className="font-semibold uppercase tracking-wider py-4">Username</th>
                <th className="font-semibold uppercase tracking-wider py-4">Role</th>
                <th className="font-semibold uppercase tracking-wider py-4">Sector</th>
                <th className="font-semibold uppercase tracking-wider pr-6 text-right py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                     <span className="loading loading-spinner loading-md text-primary"></span>
                     <p className="mt-2 text-base-content/60 text-sm font-medium">Loading user data...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-base-content/50">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                     </svg>
                     No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="font-mono text-xs pl-6 text-base-content/60">{u.id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 font-semibold text-xs border border-primary/20">
                            <span>{u.username.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="font-semibold">{u.username}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-sm font-medium px-2 py-3 ${
                        u.role === 'ADMIN' ? 'badge-primary' : 
                        u.role === 'USER' ? 'badge-ghost border-base-300' : 'badge-secondary'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-base-content/80">
                        {u.sector}
                      </span>
                    </td>
                    <td className="text-right pr-6">
                       <button className="btn btn-ghost btn-xs text-primary font-medium hover:bg-primary/10 uppercase tracking-wide">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
