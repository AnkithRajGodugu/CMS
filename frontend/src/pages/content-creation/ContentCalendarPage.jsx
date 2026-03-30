import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaCalendarAlt, FaPlus, FaExclamationTriangle, FaVideo, FaFileAlt, FaNewspaper, FaImage, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { toast } from 'sonner';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const getTypeIcon = (type) => {
  switch ((type || '').toUpperCase()) {
    case 'VIDEO': return <FaVideo className="text-error" />;
    case 'IMAGE': return <FaImage className="text-info" />;
    case 'DOCUMENT': return <FaFileAlt className="text-warning" />;
    default: return <FaNewspaper className="text-success" />;
  }
};

const ContentCalendarPage = () => {
  const { user, sector } = useAuth();
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ title: '', type: 'IMAGE', projectId: '', notes: '' });
  const [scheduledItems, setScheduledItems] = useState({});

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      Promise.all([api.get('/content/assets'), api.get('/content/projects')])
        .then(([aRes, pRes]) => {
          setAssets(aRes.data?.data?.content || aRes.data?.data || []);
          setProjects(pRes.data?.data?.content || pRes.data?.data || []);
        })
        .catch(() => toast.error('Failed to load content data'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const navigateMonth = (dir) => {
    let m = selectedMonth + dir;
    let y = selectedYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDay) return;
    const key = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    setScheduledItems(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { ...scheduleForm, id: Date.now() }]
    }));
    toast.success(`Content scheduled for ${MONTHS[selectedMonth]} ${selectedDay}!`);
    setIsScheduleModalOpen(false);
    setScheduleForm({ title: '', type: 'IMAGE', projectId: '', notes: '' });
    setSelectedDay(null);
  };

  const openScheduleForDay = (day) => {
    setSelectedDay(day);
    setIsScheduleModalOpen(true);
  };

  if (!user || sector?.code?.toLowerCase() !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 text-center max-w-md mx-auto mt-20">
          <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Content Sector Access Only</h2>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today = new Date();

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaCalendarAlt className="text-info" /> Content Calendar
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Plan, schedule, and track your content pipeline. Click any day to schedule.</p>
            </div>
            <button className="btn btn-info text-white gap-2" onClick={() => { setSelectedDay(today.getDate()); setIsScheduleModalOpen(true); }}>
              <FaPlus /> Schedule Content
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <button className="btn btn-ghost btn-sm btn-circle" onClick={() => navigateMonth(-1)}><FaChevronLeft /></button>
                  <h2 className="card-title text-xl font-black">{MONTHS[selectedMonth]} {selectedYear}</h2>
                  <button className="btn btn-ghost btn-sm btn-circle" onClick={() => navigateMonth(1)}><FaChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(d => <div key={d} className="text-center text-xs font-bold opacity-50 pb-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, idx) => {
                    const key = `${selectedYear}-${selectedMonth}-${day}`;
                    const items = scheduledItems[key] || [];
                    const isToday = day === today.getDate() && selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
                    return (
                      <div
                        key={idx}
                        className={`min-h-16 rounded-lg p-1 text-xs transition-colors ${day ? 'bg-base-200 hover:bg-base-300 cursor-pointer' : ''} ${isToday ? 'ring-2 ring-info bg-info/10' : ''}`}
                        onClick={() => day && openScheduleForDay(day)}
                      >
                        {day && (
                          <>
                            <span className={`font-bold ${isToday ? 'text-info' : 'opacity-60'}`}>{day}</span>
                            {items.map((item, i) => (
                              <div key={i} className="mt-1 bg-info/20 text-info rounded px-1 truncate text-[10px]">{item.title}</div>
                            ))}
                            {assets.filter((_, ai) => day === (ai + 3) % daysInMonth + 1).slice(0,1).map((a, i) => (
                              <div key={`asset-${i}`} className="mt-1 bg-primary/10 text-primary rounded px-1 truncate text-[10px]">{a.title}</div>
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
              {/* Scheduled Items from state */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4 text-sm opacity-50 uppercase tracking-widest">Scheduled This Month</h2>
                  {Object.keys(scheduledItems).length === 0 ? (
                    <p className="opacity-30 italic text-center py-4 text-sm">Click a day to schedule content.</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(scheduledItems).map(([key, items]) =>
                        items.map((item, i) => (
                          <div key={`${key}-${i}`} className="flex items-center gap-3 p-3 bg-base-200/60 rounded-xl">
                            <div className="text-lg">{getTypeIcon(item.type)}</div>
                            <div className="flex-grow">
                              <p className="font-bold text-sm truncate">{item.title}</p>
                              <p className="text-xs opacity-40">{key.split('-').slice(2).join('/')} {MONTHS[selectedMonth]}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Schedule */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4 text-sm opacity-50 uppercase tracking-widest">Asset Library</h2>
                  {loading ? (
                    <span className="loading loading-dots text-info"></span>
                  ) : assets.length === 0 ? (
                    <p className="opacity-30 italic text-center py-8">No assets found.</p>
                  ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {assets.map((a, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-base-200/60 rounded-xl hover:bg-base-200 transition-colors">
                          <div className="text-xl">{getTypeIcon(a.type)}</div>
                          <div className="flex-grow">
                            <p className="font-bold text-sm truncate">{a.title}</p>
                            <p className="text-xs opacity-40">{a.project?.projectName || 'No Project'}</p>
                          </div>
                          <span className="badge badge-xs badge-ghost">{a.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Content Modal */}
      {isScheduleModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaCalendarAlt className="text-info" /> Schedule Content
                {selectedDay && <span className="text-info">— {MONTHS[selectedMonth]} {selectedDay}</span>}
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setIsScheduleModalOpen(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">Content Title</label>
                <input type="text" className="input input-bordered" required placeholder="e.g. Summer Brand Campaign Reel"
                  value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Content Type</label>
                  <select className="select select-bordered"
                    value={scheduleForm.type} onChange={e => setScheduleForm({...scheduleForm, type: e.target.value})}>
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENT">Document</option>
                    <option value="BLOG">Blog Post</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Linked Project</label>
                  <select className="select select-bordered"
                    value={scheduleForm.projectId} onChange={e => setScheduleForm({...scheduleForm, projectId: e.target.value})}>
                    <option value="">No Project</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.projectName}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label">Day</label>
                <input type="number" className="input input-bordered" min="1" max={daysInMonth}
                  value={selectedDay || ''} onChange={e => setSelectedDay(parseInt(e.target.value))} />
              </div>
              <div className="form-control">
                <label className="label">Notes</label>
                <textarea className="textarea textarea-bordered" placeholder="Additional notes or description..."
                  value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})} />
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setIsScheduleModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-info text-white gap-2"><FaCalendarAlt /> Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendarPage;
