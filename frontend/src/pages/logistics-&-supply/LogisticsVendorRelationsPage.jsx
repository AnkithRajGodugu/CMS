import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const LogisticsVendorRelationsPage = () => {
  const { user } = useAuth();
  const vendors = [
    { name: 'Acme Corp', performance: 'Excellent', contract: 'Active' },
    { name: 'Global Supplies', performance: 'Good', contract: 'Expiring Soon' },
    { name: 'LogiTech', performance: 'Average', contract: 'Active' },
    { name: 'FastTrack', performance: 'Excellent', contract: 'Active' },
  ];

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-yellow-700">Logistics Login Required</h2>
          <p className="mb-6 text-yellow-900/80">Please log in with your logistics credentials to view vendor relations details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-yellow-700">
              Vendor Relations
            </h1>
            <p className="text-xl text-yellow-900/70 max-w-3xl mx-auto">
              Comprehensive vendor management with performance tracking.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-2/3">
              <div className="text-9xl mb-4 text-yellow-600">🏢</div>
              <h2 className="text-2xl font-bold mb-4">Vendor Performance</h2>
              <table className="table-auto w-full mb-6 border">
                <thead>
                  <tr className="bg-yellow-200">
                    <th className="px-4 py-2">Vendor</th>
                    <th className="px-4 py-2">Performance</th>
                    <th className="px-4 py-2">Contract Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((row, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border px-4 py-2">{row.name}</td>
                      <td className="border px-4 py-2">{row.performance}</td>
                      <td className="border px-4 py-2">{row.contract}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2 text-yellow-700">Contract Management</h3>
                <ul className="list-disc ml-6 text-yellow-900/80">
                  <li>Track contract status and renewal dates</li>
                  <li>Monitor vendor performance trends</li>
                  <li>Automated alerts for expiring contracts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LogisticsVendorRelationsPage;
