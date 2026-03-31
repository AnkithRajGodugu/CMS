import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';
import {
  CalendarDays, Plus, AlertTriangle, Video, FileText,
  Newspaper, Image, ChevronLeft, ChevronRight, X, Clock
} from 'lucide-react';

const cx = (...c) => c.filter(Boolean).join(' ');

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TYPE_META = {
  VIDEO:    { color: 'text-red-300 bg-red-500/15',     Icon: Video },
  IMAGE:    { color: 'text-sky-300 bg-sky-500/15',     Icon: Image },
  DOCUMENT: { color: 'text-amber-300 bg-amber-500/15', Icon: FileText },
  BLOG:     { color: 'text-emerald-300 bg-emerald-500/15', Icon: Newspaper },
};
const getTypeMeta = (t) => TYPE_META[(t || '').toUpperCase()] || TYPE_META.BLOG;

const inputCls  = "w-full bg-[#0c0e12] border border-[#46484d]/20 rounded-xl px-4 py-3 text-sm text-[#f6f6fc] placeholder-[#46484d] focus:outline-none focus:border-[#99a8ff]/50 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all";
const labelCls  = "block text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-2";

/* ─── Modal shell ────────────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-[#111318] rounded-3xl border border-[#46484d]/20 w-full max-w-lg shadow-2xl shadow-black/50">
      {children}
    </div>
  </div>
);

/* ─── Main ───────────────────────────────────────────────────────────── */
const ContentCalendarPage = () => {
  const { user, sector } = useAuth();
  const [assets, setAssets]       = useState([]);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear]   = useState(new Date().getFullYear());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDay, setSelectedDay]     = useState(null);
  const [scheduleForm, setScheduleForm]   = useState({ title: '', type: 'IMAGE', projectId: '', notes: '' });
  const [scheduledItems, setScheduledItems] = useState({});

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      Promise.all([api.get('/content/assets'), api.get('/content/projects')])
        .then(([aRes, pRes]) => {
          setAssets(aRes.data?.data?.content   || aRes.data?.data   || []);
          setProjects(pRes.data?.data?.content || pRes.data?.data   || []);
        })
        .catch(() => toast.error('Failed to load content data'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const navigateMonth = (dir) => {
    let m = selectedMonth + dir, y = selectedYear;
    if (m < 0)  { m = 11; y--; }
    if (m > 11) { m = 0;  y++; }
    setSelectedMonth(m); setSelectedYear(y);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    const key = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    setScheduledItems(prev => ({ ...prev, [key]: [...(prev[key] || []), { ...scheduleForm, id: Date.now() }] }));
    toast.success(`Content scheduled for ${MONTHS_SHORT[selectedMonth]} ${selectedDay}!`);
    setIsScheduleModalOpen(false);
    setScheduleForm({ title: '', type: 'IMAGE', projectId: '', notes: '' });
    setSelectedDay(null);
  };

  const openScheduleForDay = (day) => { setSelectedDay(day); setIsScheduleModalOpen(true); };

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

  const firstDay      = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth   = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const cells         = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today         = new Date();
  const totalScheduled = Object.values(scheduledItems).flat().length;

  return (
    <div className="min-h-screen bg-[#0c0e12] text-[#f6f6fc] font-sans">
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[#99a8ff]/10 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 translate-y-1/2" />

      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] opacity-60">Content Creation</span>
              <span className="text-[#46484d]">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#99a8ff]">Calendar</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#f6f6fc] mb-3">Content Calendar</h1>
            <p className="text-[#aaabb0] max-w-lg">Plan, schedule, and track your content pipeline. Click any day to schedule content.</p>
          </div>
          <button
            onClick={() => { setSelectedDay(today.getDate()); setIsScheduleModalOpen(true); }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] shadow-xl shadow-[#99a8ff]/10 hover:shadow-[#99a8ff]/25 active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Schedule Content
          </button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Assets', value: assets.length,    color: 'text-violet-300 bg-violet-500/10 border-violet-500/20', Icon: Image },
            { label: 'Projects',     value: projects.length,  color: 'text-sky-300 bg-sky-500/10 border-sky-500/20',         Icon: FileText },
            { label: 'Scheduled',    value: totalScheduled,   color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20', Icon: Clock },
            { label: 'This Month',   value: MONTHS_SHORT[selectedMonth], color: 'text-amber-300 bg-amber-500/10 border-amber-500/20', Icon: CalendarDays },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-[#111318] rounded-2xl p-4 border border-[#46484d]/10 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#f6f6fc]">{value}</p>
                <p className="text-xs text-[#aaabb0] font-medium">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-[#111318] rounded-3xl border border-[#46484d]/10 overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#46484d]/10">
              <button onClick={() => navigateMonth(-1)} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black text-[#f6f6fc] tracking-tight">{MONTHS[selectedMonth]} {selectedYear}</h2>
              <button onClick={() => navigateMonth(1)} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-[#aaabb0] py-2">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, idx) => {
                  const key   = `${selectedYear}-${selectedMonth}-${day}`;
                  const items = scheduledItems[key] || [];
                  const isToday = day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
                  const hasContent = items.length > 0;
                  return (
                    <div
                      key={idx}
                      onClick={() => day && openScheduleForDay(day)}
                      className={cx(
                        'min-h-[72px] rounded-2xl p-2 text-xs transition-all duration-200',
                        day ? 'cursor-pointer' : '',
                        day && !isToday ? 'bg-[#0c0e12] hover:bg-[#171a1f]' : '',
                        isToday ? 'bg-[#99a8ff]/10 ring-1 ring-[#99a8ff]/30' : '',
                        hasContent ? 'border border-[#99a8ff]/20' : 'border border-transparent'
                      )}
                    >
                      {day && (
                        <>
                          <span className={cx('font-bold text-sm block mb-1', isToday ? 'text-[#99a8ff]' : 'text-[#aaabb0]')}>{day}</span>
                          {items.map((item, i) => {
                            const m = getTypeMeta(item.type);
                            return (
                              <div key={i} className={cx('rounded px-1 py-0.5 mb-0.5 truncate text-[9px] font-semibold', m.color)}>
                                {item.title}
                              </div>
                            );
                          })}
                          {assets.filter((_, ai) => day === (ai + 3) % daysInMonth + 1).slice(0, 1).map((a, i) => (
                            <div key={`a-${i}`} className="rounded px-1 py-0.5 truncate text-[9px] font-semibold text-violet-300 bg-violet-500/10">{a.title}</div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Scheduled this month */}
            <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-4">Scheduled This Month</h3>
              {Object.keys(scheduledItems).length === 0 ? (
                <p className="text-[#46484d] text-sm italic text-center py-6">Click a day to schedule content.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(scheduledItems).map(([key, items]) =>
                    items.map((item, i) => {
                      const m = getTypeMeta(item.type);
                      const Icon = m.Icon;
                      return (
                        <div key={`${key}-${i}`} className="flex items-center gap-3 p-3 bg-[#0c0e12] rounded-xl">
                          <div className={cx('p-1.5 rounded-lg', m.color.split(' ')[1])}>
                            <Icon className={cx('w-3.5 h-3.5', m.color.split(' ')[0])} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#f6f6fc] truncate">{item.title}</p>
                            <p className="text-xs text-[#aaabb0]">Day {key.split('-')[2]} · {MONTHS_SHORT[selectedMonth]}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Asset Library mini */}
            <div className="bg-[#111318] rounded-3xl border border-[#46484d]/10 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#aaabb0] mb-4">Asset Library</h3>
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 rounded-full border-2 border-[#99a8ff]/20 border-t-[#99a8ff] animate-spin" />
                </div>
              ) : assets.length === 0 ? (
                <p className="text-[#46484d] text-sm italic text-center py-6">No assets found.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {assets.map((a, idx) => {
                    const m = getTypeMeta(a.type);
                    const Icon = m.Icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-[#0c0e12] rounded-xl hover:bg-[#171a1f] transition-colors">
                        <div className={cx('p-1.5 rounded-lg', m.color.split(' ')[1])}>
                          <Icon className={cx('w-3.5 h-3.5', m.color.split(' ')[0])} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#f6f6fc] truncate">{a.title}</p>
                          <p className="text-xs text-[#aaabb0]">{a.project?.projectName || 'No Project'}</p>
                        </div>
                        <span className="text-[9px] font-bold uppercase text-[#aaabb0] bg-[#23262c] px-2 py-1 rounded-md shrink-0">{a.type}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <Modal onClose={() => setIsScheduleModalOpen(false)}>
          <div className="flex items-center justify-between p-6 border-b border-[#46484d]/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-[#99a8ff]/20">
                <CalendarDays className="w-5 h-5 text-[#99a8ff]" />
              </div>
              <div>
                <h3 className="font-bold text-[#f6f6fc] text-lg">Schedule Content</h3>
                {selectedDay && <p className="text-[#99a8ff] text-xs">{MONTHS_SHORT[selectedMonth]} {selectedDay}, {selectedYear}</p>}
              </div>
            </div>
            <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 rounded-xl text-[#aaabb0] hover:text-[#f6f6fc] hover:bg-[#23262c] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleScheduleSubmit} className="p-6 space-y-5">
            <div>
              <label className={labelCls}>Content Title</label>
              <input type="text" required placeholder="e.g. Summer Brand Campaign Reel" className={inputCls}
                value={scheduleForm.title} onChange={e => setScheduleForm({ ...scheduleForm, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Type</label>
                <select className={inputCls} value={scheduleForm.type} onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}>
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Document</option>
                  <option value="BLOG">Blog Post</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Linked Project</label>
                <select className={inputCls} value={scheduleForm.projectId} onChange={e => setScheduleForm({ ...scheduleForm, projectId: e.target.value })}>
                  <option value="">No Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Day</label>
              <input type="number" className={inputCls} min="1" max={daysInMonth}
                value={selectedDay || ''} onChange={e => setSelectedDay(parseInt(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={3} placeholder="Additional notes or description..." className={inputCls}
                value={scheduleForm.notes} onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })} />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#aaabb0] bg-[#23262c] hover:text-[#f6f6fc] transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all">Schedule</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ContentCalendarPage;
