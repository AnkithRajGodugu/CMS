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
  VIDEO:    { color: 'text-red-600 bg-red-500/15',     Icon: Video },
  IMAGE:    { color: 'text-sky-600 bg-sky-500/15',     Icon: Image },
  DOCUMENT: { color: 'text-amber-600 bg-amber-500/15', Icon: FileText },
  BLOG:     { color: 'text-emerald-600 bg-emerald-500/15', Icon: Newspaper },
};
const getTypeMeta = (t) => TYPE_META[(t || '').toUpperCase()] || TYPE_META.BLOG;

const inputCls  = "w-full bg-[#F7F9FC] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-[#99a8ff]/20 transition-all";
const labelCls  = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";

/* ─── Modal shell ────────────────────────────────────────────────────── */
const Modal = ({ onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white rounded-3xl border border-gray-200 w-full max-w-lg shadow-2xl shadow-black/50">
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
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-6 text-center p-10 bg-white rounded-3xl border border-gray-200 max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-600" />
          <h2 className="text-2xl font-bold text-[#1F2937]">Content Sector Access Only</h2>
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
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937] font-sans">
      

      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pt-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-60">Content Creation</span>
              <span className="text-gray-400">/</span>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600">Calendar</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter text-[#1F2937] mb-3">Content Calendar</h1>
            <p className="text-gray-500 max-w-lg">Plan, schedule, and track your content pipeline. Click any day to schedule content.</p>
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
            { label: 'Total Assets', value: assets.length,    color: 'text-violet-700 bg-violet-50 border-violet-200', Icon: Image },
            { label: 'Projects',     value: projects.length,  color: 'text-sky-700 bg-sky-50 border-sky-200',         Icon: FileText },
            { label: 'Scheduled',    value: totalScheduled,   color: 'text-emerald-700 bg-emerald-50 border-emerald-200', Icon: Clock },
            { label: 'This Month',   value: MONTHS_SHORT[selectedMonth], color: 'text-amber-700 bg-amber-50 border-amber-200', Icon: CalendarDays },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
              <div className={cx('p-2.5 rounded-xl border', color.split(' ').slice(1).join(' '))}>
                <Icon className={cx('w-5 h-5', color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F2937]">{value}</p>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <button onClick={() => navigateMonth(-1)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-black text-[#1F2937] tracking-tight">{MONTHS[selectedMonth]} {selectedYear}</h2>
              <button onClick={() => navigateMonth(1)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-3">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 py-2">{d}</div>
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
                        day && !isToday ? 'bg-[#F7F9FC] hover:bg-gray-50' : '',
                        isToday ? 'bg-[#99a8ff]/10 ring-1 ring-[#99a8ff]/30' : '',
                        hasContent ? 'border border-violet-300' : 'border border-transparent'
                      )}
                    >
                      {day && (
                        <>
                          <span className={cx('font-bold text-sm block mb-1', isToday ? 'text-violet-600' : 'text-gray-500')}>{day}</span>
                          {items.map((item, i) => {
                            const m = getTypeMeta(item.type);
                            return (
                              <div key={i} className={cx('rounded px-1 py-0.5 mb-0.5 truncate text-[9px] font-semibold', m.color)}>
                                {item.title}
                              </div>
                            );
                          })}
                          {assets.filter((_, ai) => day === (ai + 3) % daysInMonth + 1).slice(0, 1).map((a, i) => (
                            <div key={`a-${i}`} className="rounded px-1 py-0.5 truncate text-[9px] font-semibold text-violet-600 bg-violet-500/10">{a.title}</div>
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
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Scheduled This Month</h3>
              {Object.keys(scheduledItems).length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center py-6">Click a day to schedule content.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(scheduledItems).map(([key, items]) =>
                    items.map((item, i) => {
                      const m = getTypeMeta(item.type);
                      const Icon = m.Icon;
                      return (
                        <div key={`${key}-${i}`} className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl">
                          <div className={cx('p-1.5 rounded-lg', m.color.split(' ')[1])}>
                            <Icon className={cx('w-3.5 h-3.5', m.color.split(' ')[0])} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#1F2937] truncate">{item.title}</p>
                            <p className="text-xs text-gray-500">Day {key.split('-')[2]} · {MONTHS_SHORT[selectedMonth]}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Asset Library mini */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Asset Library</h3>
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 rounded-full border-2 border-violet-300 border-t-[#99a8ff] animate-spin" />
                </div>
              ) : assets.length === 0 ? (
                <p className="text-gray-400 text-sm italic text-center py-6">No assets found.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {assets.map((a, idx) => {
                    const m = getTypeMeta(a.type);
                    const Icon = m.Icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl hover:bg-gray-50 transition-colors">
                        <div className={cx('p-1.5 rounded-lg', m.color.split(' ')[1])}>
                          <Icon className={cx('w-3.5 h-3.5', m.color.split(' ')[0])} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-[#1F2937] truncate">{a.title}</p>
                          <p className="text-xs text-gray-500">{a.project?.projectName || 'No Project'}</p>
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-md shrink-0">{a.type}</span>
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
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#99a8ff]/10 rounded-xl border border-violet-300">
                <CalendarDays className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#1F2937] text-lg">Schedule Content</h3>
                {selectedDay && <p className="text-violet-600 text-xs">{MONTHS_SHORT[selectedMonth]} {selectedDay}, {selectedYear}</p>}
              </div>
            </div>
            <button onClick={() => setIsScheduleModalOpen(false)} className="p-2 rounded-xl text-gray-500 hover:text-[#1F2937] hover:bg-gray-100 transition-all">
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
              <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:text-[#1F2937] transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl text-sm font-bold text-[#000] bg-gradient-to-br from-[#99a8ff] to-[#4765f9] hover:shadow-lg hover:shadow-[#99a8ff]/20 active:scale-95 transition-all">Schedule</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ContentCalendarPage;
