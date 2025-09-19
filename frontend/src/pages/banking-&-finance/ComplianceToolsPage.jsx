import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const ComplianceToolsPage = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('aml');
  
  if (!user || user.role !== 'banking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Banking Login Required</h2>
          <p className="mb-6 text-blue-900/80">Please log in with your banking credentials to access compliance tools.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const complianceMetrics = [
    { name: 'AML Compliance', score: 98, status: 'Excellent', color: 'text-green-600' },
    { name: 'KYC Verification', score: 95, status: 'Good', color: 'text-green-600' },
    { name: 'Risk Assessment', score: 87, status: 'Satisfactory', color: 'text-yellow-600' },
    { name: 'Regulatory Reporting', score: 92, status: 'Good', color: 'text-green-600' },
  ];

  const auditTrail = [
    { id: 'AUD001', action: 'KYC Document Verified', user: 'John Smith', time: '2 hours ago', risk: 'Low' },
    { id: 'AUD002', action: 'Large Transaction Flagged', user: 'System', time: '4 hours ago', risk: 'Medium' },
    { id: 'AUD003', action: 'Compliance Report Generated', user: 'Jane Doe', time: '6 hours ago', risk: 'Low' },
    { id: 'AUD004', action: 'Suspicious Activity Detected', user: 'System', time: '8 hours ago', risk: 'High' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
              Compliance Tools
            </h1>
            <p className="text-xl text-blue-900/70 max-w-3xl mx-auto">
              Comprehensive compliance monitoring and regulatory reporting tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Compliance Dashboard</h2>
              <div className="space-y-4">
                {complianceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{metric.name}</h3>
                      <p className={`text-sm ${metric.color}`}>{metric.status}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.score}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.score >= 95 ? 'bg-green-500' :
                            metric.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Regulatory Reports</h2>
              <div className="space-y-4">
                <select 
                  className="select select-bordered w-full"
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                >
                  <option value="aml">AML Report</option>
                  <option value="kyc">KYC Report</option>
                  <option value="sar">SAR Report</option>
                  <option value="ctr">CTR Report</option>
                </select>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">247</div>
                    <div className="text-sm text-blue-800">Cases Reviewed</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm text-green-800">Reports Filed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">5</div>
                    <div className="text-sm text-yellow-800">Pending Review</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-sm text-red-800">High Risk</div>
                  </div>
                </div>
                
                <button className="btn btn-primary w-full">Generate Report</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Audit Trail</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Audit ID</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Time</th>
                    <th>Risk Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((audit) => (
                    <tr key={audit.id}>
                      <td className="font-mono">{audit.id}</td>
                      <td>{audit.action}</td>
                      <td>{audit.user}</td>
                      <td>{audit.time}</td>
                      <td>
                        <span className={`badge ${
                          audit.risk === 'High' ? 'badge-error' :
                          audit.risk === 'Medium' ? 'badge-warning' :
                          'badge-success'
                        }`}>
                          {audit.risk}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline">View Details</button>
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

export default ComplianceToolsPage;