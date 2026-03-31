import { Link } from 'react-router-dom';
import { FaUniversity, FaHospital, FaTruck, FaEdit, FaCheckCircle, FaShieldAlt, FaChartLine, FaUsers } from 'react-icons/fa';

const ProfessionalLandingPage = () => {
  const sectors = [
    {
      icon: FaUniversity,
      title: 'Banking & Finance',
      description: 'Comprehensive customer management for banks and financial institutions',
      color: 'from-blue-500 to-blue-700',
      features: ['Account Management', 'Transaction Tracking', 'Risk Assessment', 'Compliance Tools']
    },
    {
      icon: FaHospital,
      title: 'Healthcare',
      description: 'Patient management system for hospitals and healthcare providers',
      color: 'from-green-500 to-green-700',
      features: ['Patient Records', 'Appointments', 'Medical History', 'Insurance Management']
    },
    {
      icon: FaTruck,
      title: 'Logistics & Supply Chain',
      description: 'Streamline operations for shipping and supply chain management',
      color: 'from-orange-500 to-orange-700',
      features: ['Shipment Tracking', 'Inventory', 'Fleet Management', 'Route Optimization']
    },
    {
      icon: FaEdit,
      title: 'Content Creation',
      description: 'Manage clients, projects, and workflows for creative agencies',
      color: 'from-purple-500 to-purple-700',
      features: ['Project Management', 'Client Portal', 'Content Calendar', 'Collaboration']
    }
  ];

  const benefits = [
    { icon: FaShieldAlt, title: 'Enterprise Security', description: 'Bank-level encryption and security protocols' },
    { icon: FaChartLine, title: 'Real-time Analytics', description: 'Comprehensive insights and reporting' },
    { icon: FaUsers, title: 'Multi-tenant Support', description: 'Manage multiple organizations seamlessly' },
    { icon: FaCheckCircle, title: 'Compliance Ready', description: 'Built-in compliance and audit tools' }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Enterprise CMS Platform
              <span className="block text-yellow-300 mt-2">Built for Your Industry</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Sector-specific solutions for Banking, Healthcare, Logistics, and Content Creation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none">
                Start Free Trial
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-base-100"/>
          </svg>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Industry-Specific Solutions</h2>
            <p className="text-xl text-base-content/70">Tailored features for your sector's unique needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sectors.map((sector, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300">
                <div className="card-body">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${sector.color} flex items-center justify-center mb-4`}>
                    <sector.icon className="text-3xl text-white" />
                  </div>
                  <h3 className="card-title text-xl mb-2">{sector.title}</h3>
                  <p className="text-base-content/70 mb-4">{sector.description}</p>
                  <ul className="space-y-2">
                    {sector.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <FaCheckCircle className="text-success mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-base-content/70">Enterprise-grade features for modern businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white mb-4">
                  <benefit.icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-base-content/70">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-base-content/70">Active Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-success mb-2">4</div>
              <div className="text-base-content/70">Industry Sectors</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-warning mb-2">99.9%</div>
              <div className="text-base-content/70">Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-error mb-2">24/7</div>
              <div className="text-base-content/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of businesses using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none">
              Start Free Trial
            </Link>
            <Link to="/test-credentials" className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
              View Demo Credentials
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-8">
        <div className="container mx-auto px-6 text-center text-base-content/70">
          <p>&copy; 2024 CMS Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfessionalLandingPage;
