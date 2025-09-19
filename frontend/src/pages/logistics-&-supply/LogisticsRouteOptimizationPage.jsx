import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LogisticsRouteOptimizationPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-700">Logistics Login Required</h2>
          <p className="mb-6 text-purple-900/80">Please log in with your logistics credentials to view route optimization details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-700">
              Route Optimization
            </h1>
            <p className="text-xl text-purple-900/70 max-w-3xl mx-auto">
              AI-powered route planning to minimize costs and delivery times.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-2/3">
              <div className="text-9xl mb-4 text-purple-600">🗺️</div>
              <h2 className="text-2xl font-bold mb-4">Optimized Route</h2>
              <img src="https://maps.googleapis.com/maps/api/staticmap?size=400x200&maptype=roadmap&path=color:purple|weight:5|Los+Angeles,CA|Chicago,IL|New+York,NY" alt="Route Map" className="rounded-lg border mb-6" />
              <p className="text-lg text-purple-900/80 mb-2">Stops: Los Angeles → Chicago → New York</p>
              <p className="text-lg text-purple-900/80">Estimated Time: 36 hours</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/3">
              <h2 className="text-xl font-bold mb-4 text-purple-700">Optimization Summary</h2>
              <ul className="list-disc ml-6 text-purple-900/80">
                <li>AI selected fastest route based on traffic and weather</li>
                <li>Estimated cost savings: 18%</li>
                <li>Real-time rerouting available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LogisticsRouteOptimizationPage;
