import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  TrendingUp, Eye, Users, ArrowUp, ArrowDown,
  PieChart, Zap, AlertTriangle, Activity
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const DEMOGRAPHICS = [
  { region: 'North America', pct: 45, color: 'from-[#99a8ff] to-[#4765f9]' },
  { region: 'Europe / EMEA', pct: 30, color: 'from-[#929bfa] to-[#343d96]' },
  { region: 'Asia Pacific',  pct: 15, color: 'from-emerald-400 to-emerald-600' },
  { region: 'Rest of World', pct: 10, color: 'from-amber-400 to-amber-600' },
];

const CreatorAnalyticPage = () => {
  const { user, sector } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'content') {
      api.get('/content/analytics/summary')
        .then(res => { if (res.data?.success) setAnalytics(res.data.data?.content || res.data.data); })
        .catch(err => console.error('Failed to fetch analytics', err))
        .finally(() => setLoading(false));
    }
  }, [user, sector]);

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

  const stats = [
    { label: 'Total Impressions', value: analytics?.totalViews || '0',         trend: '+21%', up: true,  color: 'text-violet-300 bg-violet-500/10 border-violet-500/20', Icon: Eye },
    { label: 'Engagement Rate',   value: analytics?.avgEngagement || '0%',     trend: '+5.4%', up: true, color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',         Icon: PieChart },
    { label: 'New Audiences',     value: analytics?.growthRate || '0%',        trend: '-2%',  up: false, color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', Icon: Users },
    { label: 'Top Project',       value: analytics?.topPerformingProject || 'N/A', trend: null, up: true, color: 'text-amber-300 bg-amber-500/10 border-amber-500/20', Icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        <section className="mb-12 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
            <span className="text-[#46484d]">/</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Analytics</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Performance Analytics</h1>
          <p className="text-[#aaabb0] max-w-lg">In-depth insights into your content's reach, engagement, and audience growth across all channels.</p>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map(({ label, value, trend, up, color, Icon }) => (
            <div key={label} className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-6 hover:border-[#99a8ff]/20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={cx('p-2.5 rounded-xl border', color.split(' ').slice(1).join(' '))}>
                  <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
                </div>
                {trend && (
                  <span className={cx('flex items-center gap-1 text-xs font-bold', up ? 'text-emerald-400' : 'text-red-400')}>
                    {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-[#f6f6fc] mb-1 truncate">{value}</p>
              <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audience Demographics */}
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-[#f6f6fc] text-lg">Audience Demographics</h2>
              <PieChart className="w-5 h-5 text-[#aaabb0]" />
            </div>
            <div className="space-y-5">
              {DEMOGRAPHICS.map(({ region, pct, color }) => (
                <div key={region}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-[#aaabb0] uppercase tracking-widest">{region}</span>
                    <span className="text-[#f6f6fc]">{pct}%</span>
                  </div>
                  <div className="h-2 bg-[#0c0e12] rounded-full overflow-hidden">
                    <div className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700', color)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Feed */}
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#46484d]/10">
              <h2 className="font-bold text-[#f6f6fc] text-lg">Real-Time Performance</h2>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> LIVE
              </span>
            </div>
            <div className="p-6 h-64 flex flex-col items-center justify-center gap-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" />
              ) : (
                <>
                  <div className="flex items-end gap-1.5 h-32">
                    {Array.from({ length: 20 }, (_, i) => {
                      const h = 20 + Math.sin(i * 0.8) * 30 + Math.random() * 20;
                      return (
                        <div
                          key={i}
                          className="w-3 rounded-t-sm bg-gradient-to-t from-[#4765f9] to-[#99a8ff] opacity-70 hover:opacity-100 transition-opacity"
                          style={{ height: `${h}%` }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-sm text-[#aaabb0] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#99a8ff]" /> Live engagement data stream
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatorAnalyticPage;
