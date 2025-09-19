import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const InsuranceManagementPage = () => {
  const { user } = useAuth();
  const [selectedClaim, setSelectedClaim] = useState('');
  
  if (!user || user.role !== 'healthcare') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Healthcare Login Required</h2>
          <p className="mb-6 text-green-900/80">Please log in with your healthcare credentials to access insurance management.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const insuranceClaims = [
    { 
      id: 'CLM001', 
      patient: 'Sarah Johnson', 
      provider: 'Blue Cross', 
      amount: 1250.00, 
      status: 'Approved', 
      date: '2024-01-15',
      service: 'Consultation'
    },
    { 
      id: 'CLM002', 
      patient: 'Michael Chen', 
      provider: 'Aetna', 
      amount: 850.00, 
      status: 'Pending', 
      date: '2024-01-12',
      service: 'Lab Tests'
    },
    { 
      id: 'CLM003', 
      patient: 'Emily Davis', 
      provider: 'Cigna', 
      amount: 2100.00, 
      status: 'Under Review', 
      date: '2024-01-10',
      service: 'Surgery'
    },
    { 
      id: 'CLM004', 
      patient: 'Robert Wilson', 
      provider: 'United Health', 
      amount: 450.00, 
      status: 'Denied', 
      date: '2024-01-08',
      service: 'Emergency Visit'
    },
  ];

  const insuranceProviders = [
    { name: 'Blue Cross Blue Shield', coverage: '45%', claims: 156, avgProcessing: '7 days' },
    { name: 'Aetna', coverage: '25%', claims: 89, avgProcessing: '5 days' },
    { name: 'Cigna', coverage: '15%', claims: 67, avgProcessing: '6 days' },
    { name: 'United Healthcare', coverage: '15%', claims: 78, avgProcessing: '8 days' },
  ];

  const preAuthRequests = [
    { id: 'PA001', patient: 'John Smith', procedure: 'MRI Scan', provider: 'Blue Cross', status: 'Approved', urgency: 'Routine' },
    { id: 'PA002', patient: 'Lisa Brown', procedure: 'CT Scan', provider: 'Aetna', status: 'Pending', urgency: 'Urgent' },
    { id: 'PA003', patient: 'David Lee', procedure: 'Surgery', provider: 'Cigna', status: 'Under Review', urgency: 'Elective' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
              Insurance Management
            </h1>
            <p className="text-xl text-green-900/70 max-w-3xl mx-auto">
              Comprehensive insurance claims processing and provider management system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-green-600">✅</div>
              <h3 className="text-lg font-bold mb-2">Approved Claims</h3>
              <p className="text-2xl font-bold text-green-600">$45,230</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-orange-600">⏳</div>
              <h3 className="text-lg font-bold mb-2">Pending Claims</h3>
              <p className="text-2xl font-bold text-orange-600">$12,850</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-red-600">❌</div>
              <h3 className="text-lg font-bold mb-2">Denied Claims</h3>
              <p className="text-2xl font-bold text-red-600">$3,450</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-blue-600">📊</div>
              <h3 className="text-lg font-bold mb-2">Success Rate</h3>
              <p className="text-2xl font-bold text-blue-600">87.5%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Insurance Providers</h2>
              <div className="space-y-4">
                {insuranceProviders.map((provider, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <span className="text-lg font-bold text-blue-600">{provider.coverage}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>Claims: {provider.claims}</div>
                      <div>Avg Processing: {provider.avgProcessing}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: provider.coverage }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Pre-Authorization Requests</h2>
              <div className="space-y-4">
                {preAuthRequests.map((request, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{request.id}</h3>
                      <span className={`badge ${
                        request.status === 'Approved' ? 'badge-success' :
                        request.status === 'Pending' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Patient: {request.patient}</p>
                    <p className="text-sm text-gray-600 mb-1">Procedure: {request.procedure}</p>
                    <p className="text-sm text-gray-600 mb-1">Provider: {request.provider}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`badge badge-sm ${
                        request.urgency === 'Urgent' ? 'badge-error' :
                        request.urgency === 'Routine' ? 'badge-info' :
                        'badge-outline'
                      }`}>
                        {request.urgency}
                      </span>
                      <button className="btn btn-xs btn-outline">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Insurance Claims</h2>
              <div className="flex gap-4">
                <select 
                  className="select select-bordered"
                  value={selectedClaim}
                  onChange={(e) => setSelectedClaim(e.target.value)}
                >
                  <option value="">All Claims</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="denied">Denied</option>
                </select>
                <button className="btn btn-primary">New Claim</button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Patient</th>
                    <th>Provider</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {insuranceClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="font-mono">{claim.id}</td>
                      <td className="font-semibold">{claim.patient}</td>
                      <td>{claim.provider}</td>
                      <td>{claim.service}</td>
                      <td className="font-bold">${claim.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>{claim.date}</td>
                      <td>
                        <span className={`badge ${
                          claim.status === 'Approved' ? 'badge-success' :
                          claim.status === 'Denied' ? 'badge-error' :
                          claim.status === 'Pending' ? 'badge-warning' :
                          'badge-info'
                        }`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Process</button>
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
      <Footer />
    </div>
  );
};

export default InsuranceManagementPage;