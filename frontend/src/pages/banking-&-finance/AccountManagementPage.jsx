import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const AccountManagementPage = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'banking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Banking Login Required</h2>
          <p className="mb-6 text-blue-900/80">Please log in with your banking credentials to access account management.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const accounts = [
    { id: 'ACC001', type: 'Checking', balance: 15420.50, status: 'Active', customer: 'John Doe' },
    { id: 'ACC002', type: 'Savings', balance: 45230.75, status: 'Active', customer: 'Jane Smith' },
    { id: 'ACC003', type: 'Business', balance: 125000.00, status: 'Active', customer: 'ABC Corp' },
    { id: 'ACC004', type: 'Credit', balance: -2500.00, status: 'Active', customer: 'Mike Johnson' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
              Account Management
            </h1>
            <p className="text-xl text-blue-900/70 max-w-3xl mx-auto">
              Comprehensive customer management for banks, credit unions, and financial institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-green-600">💰</div>
              <h3 className="text-xl font-bold mb-2">Total Deposits</h3>
              <p className="text-3xl font-bold text-green-600">$185,651.25</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-blue-600">🏦</div>
              <h3 className="text-xl font-bold mb-2">Active Accounts</h3>
              <p className="text-3xl font-bold text-blue-600">247</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-4xl mb-4 text-orange-600">📈</div>
              <h3 className="text-xl font-bold mb-2">Monthly Growth</h3>
              <p className="text-3xl font-bold text-orange-600">+12.5%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-700">Customer Accounts</h2>
              <button className="btn btn-primary">Add New Account</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Account ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td className="font-mono">{account.id}</td>
                      <td className="font-semibold">{account.customer}</td>
                      <td>
                        <span className="badge badge-outline">{account.type}</span>
                      </td>
                      <td className={`font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <span className="badge badge-success">{account.status}</span>
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
      <Footer />
    </div>
  );
};

export default AccountManagementPage;