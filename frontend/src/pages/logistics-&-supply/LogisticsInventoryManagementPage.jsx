import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LogisticsInventoryManagementPage = () => {
  const { user } = useAuth();
  const inventory = [
    { item: 'Laptops', stock: 120, reorder: 30, forecast: 'Stable' },
    { item: 'Monitors', stock: 80, reorder: 20, forecast: 'Increasing' },
    { item: 'Keyboards', stock: 200, reorder: 50, forecast: 'Stable' },
    { item: 'Printers', stock: 40, reorder: 10, forecast: 'Decreasing' },
  ];

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-green-700">Logistics Login Required</h2>
          <p className="mb-6 text-green-900/80">Please log in with your logistics credentials to view inventory management details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-700">
              Inventory Management
            </h1>
            <p className="text-xl text-green-900/70 max-w-3xl mx-auto">
              Smart inventory control with automated reordering and forecasting.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-2/3">
              <div className="text-9xl mb-4 text-green-600">📋</div>
              <h2 className="text-2xl font-bold mb-4">Inventory Overview</h2>
              <table className="table-auto w-full mb-6 border">
                <thead>
                  <tr className="bg-green-200">
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Reorder Point</th>
                    <th className="px-4 py-2">Forecast</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((row, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border px-4 py-2">{row.item}</td>
                      <td className="border px-4 py-2">{row.stock}</td>
                      <td className="border px-4 py-2">{row.reorder}</td>
                      <td className="border px-4 py-2">{row.forecast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2 text-green-700">Analytics</h3>
                <ul className="list-disc ml-6 text-green-900/80">
                  <li>Automated reordering prevents stockouts</li>
                  <li>Forecasting helps optimize inventory levels</li>
                  <li>Stable items require less frequent review</li>
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

export default LogisticsInventoryManagementPage;
