import React from 'react';
import { useTheme } from '../../../context/SectorThemeProvider';

const ContentDashboard = () => {
  

  const projects = [
    { name: 'Brand Campaign 2024', progress: 85, status: 'In Progress', deadline: '2 days' },
    { name: 'Website Redesign', progress: 60, status: 'In Progress', deadline: '1 week' },
    { name: 'Social Media Assets', progress: 100, status: 'Completed', deadline: 'Done' },
    { name: 'Product Launch Video', progress: 30, status: 'Planning', deadline: '2 weeks' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'In Progress': return 'badge-warning';
      case 'Planning': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'progress-success';
    if (progress >= 50) return 'progress-warning';
    return 'progress-error';
  };

  return (
    <div className="space-y-6">
      {/* Creative Stats */}
      <div className="stats shadow w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="stat">
          <div className="stat-figure text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div className="stat-title text-white opacity-80">Active Projects</div>
          <div className="stat-value text-white">12</div>
          <div className="stat-desc text-white opacity-70">3 launching this week</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="stat-title text-white opacity-80">Team Members</div>
          <div className="stat-value text-white">24</div>
          <div className="stat-desc text-white opacity-70">↗︎ 2 new this month</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="stat-title text-white opacity-80">Assets Created</div>
          <div className="stat-value text-white">1,247</div>
          <div className="stat-desc text-white opacity-70">↗︎ 18% increase</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-purple-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Project Progress
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{project.name}</span>
                    <div className={`badge ${getStatusColor(project.status)}`}>
                      {project.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <progress 
                      className={`progress ${getProgressColor(project.progress)} flex-1`} 
                      value={project.progress} 
                      max="100"
                    ></progress>
                    <span className="text-sm font-semibold">{project.progress}%</span>
                  </div>
                  <div className="text-sm text-base-content/70">
                    Deadline: {project.deadline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Creative Tools */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              Creative Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="btn btn-outline btn-primary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Design
              </div>
              <div className="btn btn-outline btn-secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video
              </div>
              <div className="btn btn-outline btn-accent">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Audio
              </div>
              <div className="btn btn-outline btn-warning">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Content
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Calendar */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-violet-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Content Calendar - This Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="bg-base-200 rounded-lg p-3">
                <div className="font-semibold text-center mb-2">{day}</div>
                <div className="space-y-1">
                  {index < 5 && (
                    <div className="badge badge-primary badge-sm w-full">
                      Post #{index + 1}
                    </div>
                  )}
                  {index === 2 && (
                    <div className="badge badge-secondary badge-sm w-full">
                      Video Edit
                    </div>
                  )}
                  {index === 4 && (
                    <div className="badge badge-accent badge-sm w-full">
                      Client Review
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;