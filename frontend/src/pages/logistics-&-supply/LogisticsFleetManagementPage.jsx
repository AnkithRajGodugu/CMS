import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const LogisticsFleetManagementPage = () => {
  const { user } = useAuth();
  const fleet = [
    { vehicle: 'Truck 1', status: 'Active', driver: 'John Doe', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
    { vehicle: 'Truck 2', status: 'Maintenance', driver: 'Jane Smith', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80' },
    { vehicle: 'Van 1', status: 'Active', driver: 'Mike Brown', image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=400&q=80' },
    { vehicle: 'Truck 3', status: 'Inactive', driver: 'Anna Lee', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80' },
  ];

  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Logistics Login Required</h2>
          <p className="mb-6 text-indigo-900/80">Please log in with your logistics credentials to view fleet management details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-700">Fleet Management</h1>
            <p className="text-xl text-indigo-900/70 max-w-3xl mx-auto">Vehicle tracking, maintenance scheduling, and driver management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
            {fleet.map((row, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <img src={row.image} alt={row.vehicle} className="rounded-lg mb-4 w-64 h-40 object-cover border" />
                <div className="text-3xl mb-2 text-indigo-600">🚛</div>
                <h2 className="text-xl font-bold mb-2">{row.vehicle}</h2>
                <p className="text-lg mb-1">Status: <span className="font-semibold">{row.status}</span></p>
                <p className="text-lg mb-1">Driver: <span className="font-semibold">{row.driver}</span></p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold mb-2 text-indigo-700">Driver Management</h3>
            <ul className="list-disc ml-6 text-indigo-900/80">
              <li>Assign drivers to vehicles</li>
              <li>Track maintenance schedules</li>
              <li>Monitor vehicle status in real-time</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LogisticsFleetManagementPage;
