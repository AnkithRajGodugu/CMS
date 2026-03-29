import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaChartLine, FaEye, FaUsers, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaChartPie, FaBolt } from 'react-icons/fa';
import { toast } from 'sonner';

const CreatorAnalyticPage = () => {
  const { user, sector } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content/analytics/summary');
      if (response.data && response.data.success) {
        setAnalytics(response.data.data?.content || response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'content') {
      fetchAnalytics();
    }
  }, [user, sector]);

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <p className="mb-6 text-base-content/70">Please log in with your content creator credentials to view performance analytics.</p>
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
                <FaChartLine className="text-success" />
                Performance Analytics
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">In-depth insights into your content's reach, engagement, and audience growth across all channels.</p>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stats shadow bg-base-100">
              <div className="stat">
                 <div className="stat-figure text-primary"><FaEye className="text-3xl" /></div>
                 <div className="stat-title">Total Impressions</div>
                 <div className="stat-value">{analytics?.totalViews || '0'}</div>
                 <div className="stat-desc flex items-center gap-1 text-success"><FaArrowUp /> 21% from last month</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                 <div className="stat-figure text-secondary"><FaChartPie className="text-3xl" /></div>
                 <div className="stat-title">Engagement Rate</div>
                 <div className="stat-value">{analytics?.avgEngagement || '0%'}</div>
                 <div className="stat-desc flex items-center gap-1 text-success"><FaArrowUp /> 5.4% increase</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                 <div className="stat-figure text-success"><FaUsers className="text-3xl" /></div>
                 <div className="stat-title">New Audiences</div>
                 <div className="stat-value">{analytics?.growthRate || '0%'}</div>
                 <div className="stat-desc flex items-center gap-1 text-error"><FaArrowDown /> 2% retention drop</div>
              </div>
            </div>
            <div className="stats shadow bg-base-100">
              <div className="stat">
                 <div className="stat-figure text-warning"><FaBolt className="text-3xl" /></div>
                 <div className="stat-title">Top Project</div>
                 <div className="stat-value text-lg mt-2 truncate max-w-[150px]">{analytics?.topPerformingProject || 'N/A'}</div>
                 <div className="stat-desc">Primary growth driver</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="card bg-base-100 shadow-xl border border-success/20">
                <div className="card-body">
                   <h2 className="card-title mb-6 border-b pb-2">Audience Demographics</h2>
                   <div className="space-y-6">
                      <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                            <span>NORTH AMERICA</span>
                            <span>45%</span>
                         </div>
                         <div className="bg-base-200 h-2 w-full rounded-full overflow-hidden">
                            <div className="bg-primary h-full w-[45%]"></div>
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                            <span>EUROPE / EMEA</span>
                            <span>30%</span>
                         </div>
                         <div className="bg-base-200 h-2 w-full rounded-full overflow-hidden">
                            <div className="bg-secondary h-full w-[30%]"></div>
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                            <span>ASIA PACIFIC</span>
                            <span>15%</span>
                         </div>
                         <div className="bg-base-200 h-2 w-full rounded-full overflow-hidden">
                            <div className="bg-success h-full w-[15%]"></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="card bg-base-100 shadow-xl overflow-hidden p-0">
                <div className="bg-success/10 p-6 flex items-center justify-between border-b border-success/10">
                   <h2 className="font-bold text-lg">Real-Time Performance Feed</h2>
                   <span className="badge badge-success badge-sm animate-pulse">LIVE DATA</span>
                </div>
                <div className="p-6 h-[250px] flex items-center justify-center bg-base-200/20 italic opacity-40">
                   <FaChartLine className="text-6xl mr-4" />
                   Performance Graph Component Placeholder
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorAnalyticPage;
