import { Link } from 'react-router-dom';
const SectorsOverviewPage = () => {
  const sectors = [
    {
      id: 'banking',
      title: 'Banking & Finance',
      description: 'Comprehensive customer management for banks, credit unions, and financial institutions with advanced compliance and risk management.',
      icon: '🏦',
      features: ['Account Management', 'Transaction Tracking', 'Compliance Tools', 'Risk Assessment'],
      color: 'from-blue-500 to-blue-700',
      stats: { users: '2,500+', satisfaction: '98%', savings: '40%' }
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Patient management system designed for hospitals, clinics, and healthcare providers with comprehensive care coordination.',
      icon: '🏥',
      features: ['Patient Records', 'Appointment Scheduling', 'Medical History', 'Insurance Management'],
      color: 'from-green-500 to-green-700',
      stats: { users: '1,800+', satisfaction: '95%', savings: '50%' }
    },
    {
      id: 'logistics',
      title: 'Logistics & Supply Chain',
      description: 'Streamline operations for shipping, warehousing, and supply chain management with intelligent automation.',
      icon: '🚛',
      features: ['Shipment Tracking', 'Inventory Management', 'Route Optimization', 'Vendor Relations'],
      color: 'from-orange-500 to-orange-700',
      stats: { users: '3,200+', satisfaction: '97%', savings: '30%' }
    },
    {
      id: 'content',
      title: 'Content Creation',
      description: 'Manage clients, projects, and content workflows for creative agencies and freelancers with powerful collaboration tools.',
      icon: '🎨',
      features: ['Project Management', 'Client Portal', 'Content Calendar', 'Collaboration Tools'],
      color: 'from-purple-500 to-purple-700',
      stats: { users: '4,100+', satisfaction: '92%', savings: '40%' }
    }
  ];

  return (
    <div className="min-h-screen">
      
      
      {/* Hero Section */}
      <section className="hero min-h-[50vh] gradient-bg">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Industry-Specific
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                CMS Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Discover how our platform adapts to your industry's unique needs with specialized 
              features and workflows designed for maximum efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your
              <span className="gradient-text"> Industry Solution</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Each sector solution is tailored with specific features, workflows, and compliance requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectors.map((sector) => (
              <div key={sector.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`text-5xl p-4 rounded-full bg-gradient-to-r ${sector.color} text-white`}>
                        {sector.icon}
                      </div>
                      <div>
                        <h3 className="card-title text-2xl mb-2">{sector.title}</h3>
                        <div className="flex space-x-4 text-sm text-base-content/60">
                          <span>{sector.stats.users} users</span>
                          <span>{sector.stats.satisfaction} satisfaction</span>
                          <span>{sector.stats.savings} cost savings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-base-content/70 mb-6">{sector.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {sector.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="card-actions justify-between items-center">
                    <Link 
                      to={`/sectors/${sector.id}`} 
                      className="btn btn-primary group-hover:btn-outline transition-all duration-300"
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link 
                      to="/signup" 
                      className="btn btn-ghost text-primary hover:bg-primary hover:text-white"
                    >
                      Start Free Trial
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose Sector-Specific Solutions?</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Generic CMS platforms force you to adapt. Our sector-specific solutions adapt to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="card-title justify-center mb-4">Industry-Focused</h3>
                <p className="text-base-content/70">
                  Built specifically for your industry with features that address your unique challenges and requirements.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="card-title justify-center mb-4">Faster Implementation</h3>
                <p className="text-base-content/70">
                  Pre-configured workflows and templates mean you can get up and running in days, not months.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="card-title justify-center mb-4">Compliance Ready</h3>
                <p className="text-base-content/70">
                  Built-in compliance features for your industry regulations, from HIPAA to SOX to GDPR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Industry Operations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your sector and discover how our specialized platform can revolutionize your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectorsOverviewPage;
