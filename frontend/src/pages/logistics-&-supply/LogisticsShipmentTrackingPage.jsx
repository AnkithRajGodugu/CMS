import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const LogisticsShipmentTrackingPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'logistics') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Logistics Login Required</h2>
          <p className="mb-6 text-blue-900/80">Please log in with your logistics credentials to view shipment tracking details.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <Header />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-700">
              Shipment Tracking
            </h1>
            <p className="text-xl text-blue-900/70 max-w-3xl mx-auto">
              Real-time tracking with GPS integration and delivery notifications.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2">
              <div className="text-9xl mb-4 text-blue-600">📦</div>
              <h2 className="text-2xl font-bold mb-4">Current Location: New York, NY</h2>
              <div className="mb-6">
                <img src="https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=10&size=400x200&maptype=roadmap&markers=color:blue%7Clabel:S%7CNew+York,NY" alt="Shipment Map" className="rounded-lg border" />
              </div>
              <p className="text-lg text-blue-900/80 mb-2">Estimated Delivery: 2 days</p>
              <p className="text-lg text-blue-900/80">Delivery History: Los Angeles → Chicago → New York</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Delivery Timeline</h2>
              <ul className="timeline timeline-vertical">
                <li className="timeline-item">
                  <div className="timeline-marker bg-blue-600"></div>
                  <div className="timeline-content">Picked up in Los Angeles</div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-marker bg-blue-600"></div>
                  <div className="timeline-content">Arrived in Chicago</div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-marker bg-blue-600"></div>
                  <div className="timeline-content">In transit to New York</div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-marker bg-blue-600"></div>
                  <div className="timeline-content">Out for delivery</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LogisticsShipmentTrackingPage;
