import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserHealthcareDashboardStats, getMyAppointments } from '../../../services/healthcareService';

const HealthcareUserDashboard = () => {
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsRes, apptsRes] = await Promise.all([
                    getUserHealthcareDashboardStats(),
                    getMyAppointments()
                ]);

                // Backend returns data directly (no .success wrapper)
                setStats(statsRes.data?.data ?? statsRes.data ?? {});
                const apptList = apptsRes.data?.content ?? apptsRes.data ?? [];
                setAppointments(Array.isArray(apptList) ? apptList : []);
            } catch (err) {
                console.error('Error fetching healthcare dashboard data:', err);
                setError('Failed to load healthcare data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const nextAppointment = appointments.find(a => ['CONFIRMED', 'PENDING', 'URGENT'].includes(a.status));
    const vitals = stats?.latestVitals || {};

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Patient Dashboard</h1>
                    <p className="text-base-content/60">Welcome back. Stay on top of your health and {appointments.length} appointments.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/user/healthcare/appointments" className="btn btn-primary shadow-lg shadow-primary/30">
                        Book Appointment
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Vitals Summary Card */}
                <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-1">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">Latest Vitals</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 border-base-200">
                                <span className="text-base-content/60">Blood Pressure</span>
                                <span className="font-bold text-success">{vitals.bloodPressure || '--/--'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2 border-base-200">
                                <span className="text-base-content/60">Heart Rate</span>
                                <span className="font-bold">{vitals.heartRate || '-- bpm'}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2 border-base-200">
                                <span className="text-base-content/60">Weight</span>
                                <span className="font-bold">{vitals.weight || '--'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-base-content/60">Last Updated</span>
                                <span className="text-sm">{vitals.lastUpdated || 'N/A'}</span>
                            </div>
                        </div>
                        <Link to="/user/healthcare/records" className="btn btn-outline btn-sm mt-4">Full Health Record</Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-1 md:col-span-3 space-y-6">
                    
                    {/* Upcoming Appointment Alert */}
                    {nextAppointment ? (
                        <div className="alert bg-primary/10 border-primary text-primary-content shadow-sm flex flex-col sm:flex-row shadow-primary/10 border border-l-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="p-3 bg-primary text-white rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-base-content">Upcoming Appointment</h3>
                                    <p className="text-sm text-base-content/80">
                                        {nextAppointment.type || nextAppointment.notes || 'Routine Checkup'} • {new Date(nextAppointment.appointmentTime).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-none mt-4 sm:mt-0 w-full sm:w-auto">
                                <button className="btn btn-sm btn-primary w-full sm:w-auto">View Details</button>
                            </div>
                        </div>
                    ) : (
                        <div className="alert bg-base-200 text-base-content opacity-70">
                            <span>No upcoming appointments scheduled.</span>
                            <Link to="/user/healthcare/appointments" className="btn btn-sm btn-ghost">Schedule One</Link>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Summary Stats */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <h2 className="card-title text-lg mb-2">My Overview</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                    <div className="bg-base-200/50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-primary">{stats?.totalAppointments || 0}</div>
                                        <div className="text-xs uppercase opacity-70">Total Visists</div>
                                    </div>
                                    <div className="bg-base-200/50 p-4 rounded-xl text-center">
                                        <div className="text-2xl font-bold text-secondary">{stats?.pendingAppointments || 0}</div>
                                        <div className="text-xs uppercase opacity-70">Scheduled</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Appointments List */}
                        <div className="card bg-base-100 shadow-xl border border-base-200">
                            <div className="card-body">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="card-title text-lg">Past Appointments</h2>
                                    <Link to="/user/healthcare/records" className="btn btn-ghost btn-xs">History</Link>
                                </div>
                                <div className="space-y-3 mt-2">
                                    {appointments.slice(0, 2).map((appt) => (
                                        <div key={appt.id} className="flex justify-between items-center p-3 border border-base-200 rounded-lg">
                                            <div>
                                                <h4 className="font-semibold">{appt.type || appt.notes || 'Appointment'}</h4>
                                                <p className="text-xs text-base-content/60">{new Date(appt.appointmentTime).toLocaleDateString()}</p>
                                            </div>
                                            <div className={`badge badge-sm ${appt.status === 'COMPLETED' ? 'badge-success' : 'badge-ghost'}`}>
                                                {appt.status}
                                            </div>
                                        </div>
                                    ))}
                                    {appointments.length === 0 && (
                                        <p className="text-sm text-center opacity-40 py-4">No appointment history found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthcareUserDashboard;
