import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const RiskAssessmentPage = () => {
  const { user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  
  if (!user || user.role !== 'banking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Banking Login Required</h2>
          <p className="mb-6 text-blue-900/80">Please log in with your banking credentials to access risk assessment tools.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const riskProfiles = [
    { id: 'CUST001', name: 'John Doe', riskScore: 25, level: 'Low', factors: ['Stable Income', 'Good Credit'] },
    { id: 'CUST002', name: 'Jane Smith', riskScore: 65, level: 'Medium', factors: ['High Transaction Volume', 'New Customer'] },
    { id: 'CUST003', name: 'ABC Corp', riskScore: 85, level: 'High', factors: ['Cash-Intensive Business', 'Multiple Jurisdictions'] },
    { id: 'CUST004', name: 'Mike Johnson', riskScore: 45, level: 'Medium', factors: ['Irregular Deposits', 'Self-Employed'] },
  ];

  const riskFactors = [
    { category: 'Geographic Risk', score: 15, description: 'Customer location and transaction origins' },
    { category: 'Transaction Patterns', score: 35, description: 'Unusual transaction amounts or frequency' },
    { category: 'Customer Profile', score: 25, description: 'Industry, occupation, and business type' },
    { category: 'Regulatory History', score: 10, description: 'Previous compliance issues or sanctions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
              Risk Assessment
            </h1>
            <p className="text-xl text-blue-900/70 max-w-3xl mx-auto">
              Advanced risk scoring and monitoring for comprehensive financial risk management.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-green-600">🟢</div>
              <h3 className="text-xl font-bold mb-2">Low Risk</h3>
              <p className="text-3xl font-bold text-green-600">156</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-yellow-600">🟡</div>
              <h3 className="text-xl font-bold mb-2">Medium Risk</h3>
              <p className="text-3xl font-bold text-yellow-600">47</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-red-600">🔴</div>
              <h3 className="text-xl font-bold mb-2">High Risk</h3>
              <p className="text-3xl font-bold text-red-600">12</p>
              <p className="text-sm text-gray-600">Customers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Risk Factors Analysis</h2>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{factor.category}</h3>
                      <span className={`text-lg font-bold ${
                        factor.score >= 30 ? 'text-red-600' :
                        factor.score >= 20 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {factor.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{factor.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          factor.score >= 30 ? 'bg-red-500' :
                          factor.score >= 20 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Risk Assessment Tools</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Customer for Assessment</label>
                  <select 
                    className="select select-bordered w-full"
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                  >
                    <option value="">Choose a customer...</option>
                    {riskProfiles.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="btn btn-primary">Run Assessment</button>
                  <button className="btn btn-outline">Generate Report</button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="btn btn-sm btn-outline w-full">Bulk Risk Screening</button>
                    <button className="btn btn-sm btn-outline w-full">Export Risk Matrix</button>
                    <button className="btn btn-sm btn-outline w-full">Schedule Assessment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Customer Risk Profiles</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Customer ID</th>
                    <th>Name</th>
                    <th>Risk Score</th>
                    <th>Risk Level</th>
                    <th>Key Factors</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {riskProfiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="font-mono">{profile.id}</td>
                      <td className="font-semibold">{profile.name}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{profile.riskScore}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                profile.riskScore >= 70 ? 'bg-red-500' :
                                profile.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${profile.riskScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          profile.level === 'High' ? 'badge-error' :
                          profile.level === 'Medium' ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {profile.level}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {profile.factors.map((factor, index) => (
                            <span key={index} className="badge badge-outline badge-sm">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline">Review</button>
                          <button className="btn btn-sm btn-primary">Update</button>
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

export default RiskAssessmentPage;