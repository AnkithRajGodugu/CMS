import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const TransactionTrackingPage = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  if (!user || user.role !== 'banking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Banking Login Required</h2>
          <p className="mb-6 text-blue-900/80">Please log in with your banking credentials to view transaction tracking.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const transactions = [
    { id: 'TXN001', type: 'Deposit', amount: 2500.00, account: 'ACC001', time: '09:15 AM', status: 'Completed' },
    { id: 'TXN002', type: 'Withdrawal', amount: -150.00, account: 'ACC002', time: '10:30 AM', status: 'Completed' },
    { id: 'TXN003', type: 'Transfer', amount: -1000.00, account: 'ACC003', time: '11:45 AM', status: 'Pending' },
    { id: 'TXN004', type: 'Payment', amount: -75.50, account: 'ACC001', time: '02:20 PM', status: 'Completed' },
    { id: 'TXN005', type: 'Deposit', amount: 5000.00, account: 'ACC004', time: '03:15 PM', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
              Transaction Tracking
            </h1>
            <p className="text-xl text-blue-900/70 max-w-3xl mx-auto">
              Real-time monitoring and analysis of all financial transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-green-600">💸</div>
              <h3 className="text-lg font-bold mb-2">Today's Volume</h3>
              <p className="text-2xl font-bold text-green-600">$127,450</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-blue-600">🔄</div>
              <h3 className="text-lg font-bold mb-2">Transactions</h3>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-orange-600">⏳</div>
              <h3 className="text-lg font-bold mb-2">Pending</h3>
              <p className="text-2xl font-bold text-orange-600">23</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-3xl mb-3 text-red-600">⚠️</div>
              <h3 className="text-lg font-bold mb-2">Failed</h3>
              <p className="text-2xl font-bold text-red-600">5</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Recent Transactions</h2>
              <select 
                className="select select-bordered"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Account</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="font-mono">{txn.id}</td>
                      <td>
                        <span className="badge badge-outline">{txn.type}</span>
                      </td>
                      <td className={`font-bold ${txn.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="font-mono">{txn.account}</td>
                      <td>{txn.time}</td>
                      <td>
                        <span className={`badge ${
                          txn.status === 'Completed' ? 'badge-success' :
                          txn.status === 'Pending' ? 'badge-warning' :
                          'badge-info'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="btn btn-sm btn-outline">Details</button>
                          <button className="btn btn-sm btn-primary">Receipt</button>
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

export default TransactionTrackingPage;