import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AssetManagementPage = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'content') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300">
        <Header />
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-purple-700">Content Login Required</h2>
          <p className="mb-6 text-purple-900/80">Please log in with your content-creation credentials to view asset management details.</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-purple-700">Asset Management</h1>
            <p className="text-xl text-purple-900/70 max-w-3xl mx-auto">Centralized digital asset library with tagging and search capabilities.</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/616/616494.png" alt="Asset Management" className="rounded-lg mb-4 w-32 h-32 object-cover border" />
            <div className="bg-white rounded-xl shadow-lg p-8 w-full md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Digital Assets</h2>
              <ul className="list-disc ml-6 text-purple-900/80">
                <li>Logo.png - Tags: branding, logo</li>
                <li>ProductVideo.mp4 - Tags: demo, product</li>
                <li>Brochure.pdf - Tags: marketing, brochure</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AssetManagementPage;
