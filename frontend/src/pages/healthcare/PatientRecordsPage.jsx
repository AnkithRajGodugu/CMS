import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const PatientRecordsPage = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState('');
  
  if (!user || user.role !== 'healthcare') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Healthcare Login Required</h2>
          <p className="mb-6 text-green-900/80">Please log in with your healthcare credentials to access patient records.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const patients = [
    { 
      id: 'PAT001', 
      name: 'Sarah Johnson', 
      age: 34, 
      condition: 'Hypertension', 
      lastVisit: '2024-01-15',
      status: 'Stable'
    },
    { 
      id: 'PAT002', 
      name: 'Michael Chen', 
      age: 67, 
      condition: 'Diabetes Type 2', 
      lastVisit: '2024-01-12',
      status: 'Monitoring'
    },
    { 
      id: 'PAT003', 
      name: 'Emily Davis', 
      age: 28, 
      condition: 'Asthma', 
      lastVisit: '2024-01-10',
      status: 'Stable'
    },
    { 
      id: 'PAT004', 
      name: 'Robert Wilson', 
      age: 45, 
      condition: 'Heart Disease', 
      lastVisit: '2024-01-08',
      status: 'Critical'
    },
  ];

  const vitalSigns = [
    { parameter: 'Blood Pressure', value: '120/80 mmHg', status: 'Normal', trend: '↔️' },
    { parameter: 'Heart Rate', value: '72 bpm', status: 'Normal', trend: '↔️' },
    { parameter: 'Temperature', value: '98.6°F', status: 'Normal', trend: '↔️' },
    { parameter: 'Oxygen Saturation', value: '98%', status: 'Normal', trend: '↗️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
              Patient Records
            </h1>
            <p className="text-xl text-green-900/70 max-w-3xl mx-auto">
              Comprehensive electronic health records system for hospitals, clinics, and healthcare providers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-blue-600">👥</div>
              <h3 className="text-lg font-bold mb-2">Total Patients</h3>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-green-600">✅</div>
              <h3 className="text-lg font-bold mb-2">Active Cases</h3>
              <p className="text-2xl font-bold text-green-600">856</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-orange-600">⚠️</div>
              <h3 className="text-lg font-bold mb-2">Critical</h3>
              <p className="text-2xl font-bold text-orange-600">12</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-purple-600">📅</div>
              <h3 className="text-lg font-bold mb-2">Today's Visits</h3>
              <p className="text-2xl font-bold text-purple-600">47</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Patient Search</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Search by name, ID, or condition..." 
                  className="input input-bordered w-full"
                />
                <select 
                  className="select select-bordered w-full"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Select a patient...</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.id})
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <button className="btn btn-primary">View Record</button>
                  <button className="btn btn-outline">New Patient</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Vital Signs Monitor</h2>
              <div className="space-y-4">
                {vitalSigns.map((vital, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{vital.parameter}</h3>
                      <p className="text-sm text-gray-600">{vital.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{vital.value}</div>
                      <div className="text-lg">{vital.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Patient Directory</h2>
              <button className="btn btn-primary">Add New Patient</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Condition</th>
                    <th>Last Visit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-mono">{patient.id}</td>
                      <td className="font-semibold">{patient.name}</td>
                      <td>{patient.age}</td>
                      <td>{patient.condition}</td>
                      <td>{patient.lastVisit}</td>
                      <td>
                        <span className={`badge ${
                          patient.status === 'Critical' ? 'badge-error' :
                          patient.status === 'Monitoring' ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Edit</button>
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

export default PatientRecordsPage;
