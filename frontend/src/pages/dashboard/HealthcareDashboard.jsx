import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaCalendarCheck, FaFileMedical, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import { useAuth } from '../../hooks/useAuth';
import SystemMetricsWidget from '../../components/shared/SystemMetricsWidget';
import AppointmentCalendarView from '../../components/healthcare/AppointmentCalendarView';
import { getHealthcareAdminStats, getRecentHealthcareActivity } from '../../services/healthcareService';

const HealthcareDashboard = () => {
  const { user, sector } = useAuth();
  const [adminStats, setAdminStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          getHealthcareAdminStats(),
          getRecentHealthcareActivity()
        ]);
        setAdminStats(statsRes.data?.data || statsRes.data);
        setRecentActivity(activityRes.data?.data || activityRes.data || []);
      } catch (error) {
        console.error('Error fetching healthcare admin data', error);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch — sector check below handles rendering
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user || sector?.code?.toLowerCase() !== 'healthcare') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-6xl mb-4 text-warning"><FaExclamationTriangle /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          This area is restricted to Healthcare sector personnel.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  const stats = [
    { label: 'Total Patients', value: adminStats?.totalPatients || '0', change: '+12%', icon: FaUserMd, color: 'text-success' },
    { label: 'Appointments Today', value: adminStats?.todaysAppointments || '0', change: '+5%', icon: FaCalendarCheck, color: 'text-info' },
    { label: 'Active Cases', value: adminStats?.activeCases || '0', change: '-3%', icon: FaFileMedical, color: 'text-warning' },
    { label: 'Pending Appointments', value: adminStats?.pendingAppointments || '0', change: '+2%', icon: FaShieldAlt, color: 'text-success' },
  ];

  const quickActions = [
    { title: 'Patient Records', path: '/dashboard/healthcare/patients', icon: FaUserMd, color: 'bg-success' },
    { title: 'Appointments', path: '/dashboard/healthcare/appointments', icon: FaCalendarCheck, color: 'bg-info' },
    { title: 'Medical History', path: '/dashboard/healthcare/medical-history', icon: FaFileMedical, color: 'bg-warning' },
    { title: 'Insurance', path: '/dashboard/healthcare/insurance', icon: FaShieldAlt, color: 'bg-error' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'COMPLETED': return 'badge-info';
      case 'URGENT': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6">
        
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaHospital className="text-4xl text-success" />
                <h1 className="text-4xl font-bold">Healthcare Dashboard</h1>
              </div>
              <p className="text-base-content/70">Manage patients, appointments, and medical records</p>
            </div>
            <ReportExportButtons sectorCode="HEALTHCARE" />
          </div>

        {user?.role === 'ADMIN' && <SystemMetricsWidget />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Appointment Scheduling */}
        <div className="mb-8">
            <AppointmentCalendarView />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  <div className="card-body items-center text-center">
                    <div className={`p-4 rounded-full ${action.color} text-white mb-2`}>
                      <action.icon className="text-3xl" />
                    </div>
                    <h3 className="card-title text-lg">{action.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Appointments</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? recentActivity.map((activity, idx) => (
                    <tr key={idx}>
                      <td>{activity.patientName || 'Unknown Patient'}</td>
                      <td>{(activity.type || 'General')} Appointment</td>
                      <td>{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}</td>
                      <td><span className={`badge ${getStatusBadge(activity.status)}`}>{activity.status || 'PENDING'}</span></td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan="4" className="text-center opacity-50 py-4">No recent activity found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcareDashboard;
