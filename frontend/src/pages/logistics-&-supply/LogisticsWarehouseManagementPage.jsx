import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LogisticsWarehouseManagementPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-700">Logistics Login Required</h2>
          <p className="mb-6 text-gray-900/80">Please log in with your logistics credentials to view warehouse management details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-700">
              Warehouse Management
            </h1>
            <p className="text-xl text-gray-900/70 max-w-3xl mx-auto">
              Complete warehouse operations with barcode scanning and automation.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-2/3">
              <div className="text-9xl mb-4 text-gray-600">🏭</div>
              <h2 className="text-2xl font-bold mb-4">Warehouse Layout</h2>
              <img src="https://images.unsplash.com/photo-1515165562835-cf7747d3b6b5?auto=format&fit=crop&w=400&q=80" alt="Warehouse Layout" className="rounded-lg border mb-6" />
              <p className="text-lg text-gray-900/80 mb-2">Automated barcode scanning in all zones</p>
              <p className="text-lg text-gray-900/80">Robotic automation for picking and sorting</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/3">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Automation Summary</h2>
              <ul className="list-disc ml-6 text-gray-900/80">
                <li>Barcode scanning reduces errors by 95%</li>
                <li>Robotic automation increases throughput</li>
                <li>Real-time inventory updates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LogisticsWarehouseManagementPage;
