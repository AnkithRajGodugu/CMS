import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Percent, Handshake, TrendingUp, FileText
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const ServiceLevelAgreementPage = () => {
  const { user, sector } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/logistics/shipments');
      if (response.data && response.data.success) {
        setShipments(response.data.data?.content || response.data.data);
      }
    } catch (err) { console.error('Failed to fetch shipments for SLA', err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (user && sector?.code?.toLowerCase() === 'logistics') fetchShipments();
  }, [user, sector]);

  const delivered  = shipments.filter(s => s.status === 'DELIVERED').length;
  const delayed    = shipments.filter(s => s.status === 'DELAYED').length;
  const onTimeRate = Math.round(((delivered) / (delivered + delayed || 1)) * 100);

  if (!user || sector?.code?.toLowerCase() !== 'logistics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c0e12]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-[#111318] rounded-3xl border border-[#46484d]/20 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-400" />
          <h2 className="text-2xl font-bold text-[#f6f6fc]">Logistics Access Only</h2>
          <p className="text-[#aaabb0]">Please log in with your logistics credentials to view SLA compliance.</p>
          <Link to="/login" className="px-6 py-2.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9]">Go to Login</Link>
        </div>
      </div>
    );
  }

  const slaMetrics = [
    { label: 'On-Time Delivery', value: `${onTimeRate}%`, sub: 'Target: 98.5%', Icon: Percent,        color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', good: onTimeRate >= 98 },
    { label: 'Avg. Latency',     value: '4.2h',           sub: 'Target: < 2.0h', Icon: Clock,         color: 'text-amber-300 bg-amber-500/10 border-amber-500/20',    good: false },
    { label: 'Open Breaches',    value: loading ? '—' : delayed, sub: 'Requiring resolution', Icon: AlertTriangle, color: delayed > 0 ? 'text-red-300 bg-red-500/10 border-red-500/20' : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', good: delayed === 0 },
    { label: 'Compliance Score', value: '94.8',            sub: 'Quarterly average', Icon: TrendingUp, color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',            good: true },
  ];

  const slaClause = [
    { name: 'Next Day Delivery (NDD)',   desc: '99% success rate required for Tier 1', pct: 92,  color: 'text-emerald-400' },
    { name: 'Carbon Neutral Routing',    desc: '80% of routes must be optimized',       pct: 65,  color: 'text-amber-400' },
    { name: 'Damage-Free Rate',          desc: 'Zero tolerance policy for hardware',    pct: 100, color: 'text-sky-400' },
  ];

  const delayedShipments = shipments.filter(s => s.status === 'DELAYED');

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans p-8">
      <div className="fixed top-0 left-0 w-[600px] h-[400px] bg-[#4765f9]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Logistics</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">SLA</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-2">Service Level Agreements</h1>
            <p className="text-[#aaabb0] max-w-lg">Compliance monitoring, performance targets, and contractual obligation tracking.</p>
          </div>
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-sky-300 bg-sky-500/10 border border-sky-500/20 whitespace-nowrap">
            <Handshake className="w-4 h-4" /> ACTIVE CONTRACTS
          </span>
        </div>

        {/* SLA Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {slaMetrics.map(({ label, value, sub, Icon, color }) => (
            <div key={label} className="bg-[#111318] rounded-2xl border border-[#46484d]/10 p-6 flex flex-col gap-3">
              <div className={cx('p-2.5 rounded-xl border w-fit', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#f6f6fc]">{loading && label === 'Open Breaches' ? '—' : value}</p>
                <p className="text-xs text-[#aaabb0] font-medium mt-0.5">{label}</p>
                <p className="text-[10px] text-[#46484d] mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active SLA Clauses */}
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#46484d]/10 pb-4">
              <ShieldCheck className="w-5 h-5 text-[#99a8ff]" />
              <h2 className="font-bold text-[#f6f6fc]">Active SLA Clauses</h2>
            </div>
            <div className="space-y-5">
              {slaClause.map(clause => (
                <div key={clause.name} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-[#f6f6fc] text-sm">{clause.name}</p>
                    <p className="text-[10px] text-[#aaabb0] mt-0.5">{clause.desc}</p>
                    <div className="h-1.5 bg-[#0c0e12] rounded-full mt-2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#4765f9] to-[#99a8ff] transition-all duration-700" style={{ width: `${clause.pct}%` }} />
                    </div>
                  </div>
                  <span className={cx('font-bold text-lg font-mono shrink-0', clause.color)}>{clause.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Breaches */}
          <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
            <div className="flex items-center gap-3 p-6 border-b border-[#46484d]/10">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h2 className="font-bold text-[#f6f6fc]">Critical Breaches</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#46484d]/10">
                    {['Event ID', 'Contract', 'Threshold', 'Actual', 'Penalty'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#aaabb0]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-12"><div className="flex justify-center"><div className="w-7 h-7 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" /></div></td></tr>
                  ) : delayedShipments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm text-[#46484d]">No SLA breaches detected. Well done!</p>
                      </td>
                    </tr>
                  ) : delayedShipments.map(s => (
                    <tr key={s.id} className="border-b border-[#46484d]/5 hover:bg-[#171a1f] transition-colors">
                      <td className="px-5 py-3 font-mono text-red-400 text-xs">BR-{s.id}</td>
                      <td className="px-5 py-3 text-[#aaabb0]">Logistics G1</td>
                      <td className="px-5 py-3 text-[#aaabb0]">24h</td>
                      <td className="px-5 py-3 text-red-400">31h</td>
                      <td className="px-5 py-3 font-bold text-red-400">$150.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-5 flex justify-end">
              <button className="flex items-center gap-2 text-xs font-bold text-[#99a8ff] hover:text-[#f6f6fc] transition-colors border border-[#46484d]/20 px-4 py-2 rounded-xl hover:border-[#46484d]/40">
                <FileText className="w-3.5 h-3.5" /> Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLevelAgreementPage;
