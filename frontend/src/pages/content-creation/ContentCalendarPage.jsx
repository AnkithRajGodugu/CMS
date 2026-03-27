import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaCalendarAlt, FaPlus, FaExclamationTriangle, FaVideo, FaFileAlt, FaNewspaper, FaImage } from 'react-icons/fa';
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
  const [selectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (sector?.code?.toLowerCase() === 'content') {
      Promise.all([api.get('/content/assets'), api.get('/content/projects')])
        .then(([aRes, pRes]) => {
          setAssets(Array.isArray(aRes.data?.data) ? aRes.data.data : []);
          setProjects(Array.isArray(pRes.data?.data) ? pRes.data.data : []);
        })
        .catch(() => toast.error('Failed to load content data'))
        .finally(() => setLoading(false));
    }
  }, [user]);

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

  // Build a simple month grid
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      
      <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold flex items-center gap-4">
                <FaCalendarAlt className="text-info" /> Content Calendar
              </h1>
              <p className="text-base-content/60 mt-2 text-lg">Plan, schedule, and track your content pipeline for {MONTHS[selectedMonth]} {selectedYear}.</p>
            </div>
            <button className="btn btn-info text-white gap-2">
              <FaPlus /> Schedule Content
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2 card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">{MONTHS[selectedMonth]} {selectedYear}</h2>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAYS.map(d => <div key={d} className="text-center text-xs font-bold opacity-50">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((day, idx) => (
                    <div key={idx} className={`min-h-14 rounded-lg p-1 text-xs ${day ? 'bg-base-200 hover:bg-base-300 transition-colors cursor-pointer' : ''} ${day === new Date().getDate() && selectedMonth === new Date().getMonth() ? 'ring-2 ring-info' : ''}`}>
                      {day && (
                        <>
                          <span className="font-bold opacity-60">{day}</span>
                          {assets.slice(0, 1).map((a, i) => day === (i + 5) && (
                            <div key={i} className="mt-1 bg-info/20 text-info rounded px-1 truncate">{a.title}</div>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Asset Schedule List */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4 text-sm opacity-50 uppercase tracking-widest">Scheduled Assets</h2>
                {loading ? (
                  <span className="loading loading-dots text-info"></span>
                ) : assets.length === 0 ? (
                  <p className="opacity-30 italic text-center py-8">No assets scheduled.</p>
                ) : (
                  <div className="space-y-4">
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
      </main>
    </div>
  );
};

export default ContentCalendarPage;
