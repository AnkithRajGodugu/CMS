import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const AppointmentSchedulingPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('2024-01-20');
  
  if (!user || user.role !== 'healthcare') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Healthcare Login Required</h2>
          <p className="mb-6 text-green-900/80">Please log in with your healthcare credentials to access appointment scheduling.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const appointments = [
    { id: 'APT001', patient: 'Sarah Johnson', doctor: 'Dr. Smith', time: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
    { id: 'APT002', patient: 'Michael Chen', doctor: 'Dr. Brown', time: '10:30 AM', type: 'Follow-up', status: 'Confirmed' },
    { id: 'APT003', patient: 'Emily Davis', doctor: 'Dr. Wilson', time: '02:00 PM', type: 'Check-up', status: 'Pending' },
    { id: 'APT004', patient: 'Robert Wilson', doctor: 'Dr. Johnson', time: '03:30 PM', type: 'Emergency', status: 'Urgent' },
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
              Appointment Scheduling
            </h1>
            <p className="text-xl text-green-900/70 max-w-3xl mx-auto">
              Efficient appointment management system for healthcare providers and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-blue-600">📅</div>
              <h3 className="text-lg font-bold mb-2">Today's Appointments</h3>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-green-600">✅</div>
              <h3 className="text-lg font-bold mb-2">Confirmed</h3>
              <p className="text-2xl font-bold text-green-600">18</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-orange-600">⏳</div>
              <h3 className="text-lg font-bold mb-2">Pending</h3>
              <p className="text-2xl font-bold text-orange-600">4</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-red-600">🚨</div>
              <h3 className="text-lg font-bold mb-2">Urgent</h3>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Schedule New Appointment</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Patient name..." 
                  className="input input-bordered w-full"
                />
                <select className="select select-bordered w-full">
                  <option value="">Select Doctor</option>
                  <option value="dr-smith">Dr. Smith - Cardiology</option>
                  <option value="dr-brown">Dr. Brown - Internal Medicine</option>
                  <option value="dr-wilson">Dr. Wilson - Pediatrics</option>
                  <option value="dr-johnson">Dr. Johnson - Emergency</option>
                </select>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input input-bordered w-full"
                />
                <select className="select select-bordered w-full">
                  <option value="">Select Time</option>
                  {timeSlots.map((time, index) => (
                    <option key={index} value={time}>{time}</option>
                  ))}
                </select>
                <select className="select select-bordered w-full">
                  <option value="">Appointment Type</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="check-up">Check-up</option>
                  <option value="emergency">Emergency</option>
                </select>
                <button className="btn btn-primary w-full">Schedule Appointment</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Calendar View</h2>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold p-2 bg-gray-100 rounded">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // Start from previous month
                  const isToday = day === 20;
                  const hasAppointments = [15, 18, 20, 22, 25].includes(day);
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-2 text-center rounded cursor-pointer ${
                        isToday ? 'bg-green-500 text-white' :
                        hasAppointments ? 'bg-blue-100 text-blue-800' :
                        day > 0 && day <= 31 ? 'hover:bg-gray-100' : 'text-gray-300'
                      }`}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                      {hasAppointments && day > 0 && day <= 31 && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Today's Schedule</h2>
              <select className="select select-bordered">
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="font-mono">{appointment.id}</td>
                      <td className="font-semibold">{appointment.patient}</td>
                      <td>{appointment.doctor}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className="badge badge-outline">{appointment.type}</span>
                      </td>
                      <td>
                        <span className={`badge ${
                          appointment.status === 'Urgent' ? 'badge-error' :
                          appointment.status === 'Pending' ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline">Edit</button>
                          <button className="btn btn-sm btn-primary">Confirm</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentSchedulingPage;
