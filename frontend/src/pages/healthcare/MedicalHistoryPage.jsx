import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const MedicalHistoryPage = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState('PAT001');
  
  if (!user || user.role !== 'healthcare') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Healthcare Login Required</h2>
          <p className="mb-6 text-green-900/80">Please log in with your healthcare credentials to access medical history.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  const medicalHistory = [
    { date: '2024-01-15', diagnosis: 'Hypertension', treatment: 'Lisinopril 10mg', doctor: 'Dr. Smith', notes: 'Blood pressure controlled' },
    { date: '2023-12-20', diagnosis: 'Annual Check-up', treatment: 'Routine screening', doctor: 'Dr. Brown', notes: 'All vitals normal' },
    { date: '2023-11-10', diagnosis: 'Flu', treatment: 'Tamiflu, Rest', doctor: 'Dr. Wilson', notes: 'Full recovery in 7 days' },
    { date: '2023-09-05', diagnosis: 'Allergic Reaction', treatment: 'Antihistamine', doctor: 'Dr. Johnson', notes: 'Reaction to shellfish' },
  ];

  const medications = [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', prescriber: 'Dr. Smith', startDate: '2024-01-15' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescriber: 'Dr. Brown', startDate: '2023-08-10' },
    { name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Once daily', prescriber: 'Dr. Wilson', startDate: '2023-06-01' },
  ];

  const allergies = [
    { allergen: 'Shellfish', reaction: 'Hives, Swelling', severity: 'Moderate', discovered: '2023-09-05' },
    { allergen: 'Penicillin', reaction: 'Rash', severity: 'Mild', discovered: '2020-03-15' },
  ];

  const labResults = [
    { test: 'Complete Blood Count', date: '2024-01-15', result: 'Normal', reference: 'Within range' },
    { test: 'Cholesterol Panel', date: '2024-01-15', result: 'Elevated', reference: 'LDL: 145 mg/dL (High)' },
    { test: 'Blood Glucose', date: '2024-01-15', result: 'Normal', reference: '95 mg/dL' },
    { test: 'Thyroid Function', date: '2023-12-20', result: 'Normal', reference: 'TSH: 2.1 mIU/L' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
              Medical History
            </h1>
            <p className="text-xl text-green-900/70 max-w-3xl mx-auto">
              Comprehensive medical history tracking and management system.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Patient Selection</h2>
              <select 
                className="select select-bordered"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="PAT001">Sarah Johnson (PAT001)</option>
                <option value="PAT002">Michael Chen (PAT002)</option>
                <option value="PAT003">Emily Davis (PAT003)</option>
                <option value="PAT004">Robert Wilson (PAT004)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-sm text-blue-800">Total Visits</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-green-800">Active Medications</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-yellow-800">Known Allergies</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-sm text-purple-800">Lab Results</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Current Medications</h2>
              <div className="space-y-4">
                {medications.map((med, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{med.name}</h3>
                      <span className="badge badge-primary">{med.dosage}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Frequency: {med.frequency}</p>
                    <p className="text-sm text-gray-600 mb-1">Prescribed by: {med.prescriber}</p>
                    <p className="text-sm text-gray-600">Started: {med.startDate}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Allergies & Reactions</h2>
              <div className="space-y-4">
                {allergies.map((allergy, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-red-800">{allergy.allergen}</h3>
                      <span className={`badge ${
                        allergy.severity === 'Severe' ? 'badge-error' :
                        allergy.severity === 'Moderate' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {allergy.severity}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-1">Reaction: {allergy.reaction}</p>
                    <p className="text-sm text-red-700">Discovered: {allergy.discovered}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Recent Lab Results</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Date</th>
                    <th>Result</th>
                    <th>Reference/Notes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((lab, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{lab.test}</td>
                      <td>{lab.date}</td>
                      <td>
                        <span className={`badge ${
                          lab.result === 'Elevated' || lab.result === 'High' ? 'badge-warning' :
                          lab.result === 'Low' ? 'badge-error' :
                          'badge-success'
                        }`}>
                          {lab.result}
                        </span>
                      </td>
                      <td className="text-sm">{lab.reference}</td>
                      <td>
                        <button className="btn btn-sm btn-outline">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-green-700">Medical History Timeline</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Diagnosis</th>
                    <th>Treatment</th>
                    <th>Doctor</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalHistory.map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td className="font-semibold">{record.diagnosis}</td>
                      <td>{record.treatment}</td>
                      <td>{record.doctor}</td>
                      <td className="text-sm">{record.notes}</td>
                      <td>
                        <button className="btn btn-sm btn-outline">View Full Record</button>
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

export default MedicalHistoryPage;
