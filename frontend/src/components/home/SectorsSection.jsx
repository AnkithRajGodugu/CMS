import { Link } from 'react-router-dom';

const SectorsSection = () => {
  const sectors = [
    {
      id: 'banking',
      title: 'Banking & Finance',
      description: 'Comprehensive customer management for banks, credit unions, and financial institutions.',
      icon: '🏦',
      features: ['Account Management', 'Transaction Tracking', 'Compliance Tools', 'Risk Assessment'],
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      description: 'Patient management system designed for hospitals, clinics, and healthcare providers.',
      icon: '🏥',
      features: ['Patient Records', 'Appointment Scheduling', 'Medical History', 'Insurance Management'],
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'logistics',
      title: 'Logistics & Supply Chain',
      description: 'Streamline operations for shipping, warehousing, and supply chain management.',
      icon: '🚛',
      features: ['Shipment Tracking', 'Inventory Management', 'Route Optimization', 'Vendor Relations'],
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'content',
      title: 'Content Creation',
      description: 'Manage clients, projects, and content workflows for creative agencies and freelancers.',
      icon: '🎨',
      features: ['Project Management', 'Client Portal', 'Content Calendar', 'Collaboration Tools'],
      color: 'from-purple-500 to-purple-700'
    }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tailored Solutions for
            <span className="gradient-text"> Every Industry</span>
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Our CMS platform adapts to your sector's unique needs with specialized features and workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectors.map((sector) => (
            <div key={sector.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="card-body">
                <div className={`text-6xl mb-4 p-4 rounded-full bg-gradient-to-r ${sector.color} w-fit mx-auto`}>
                  {sector.icon}
                </div>
                <h3 className="card-title text-center justify-center mb-4">{sector.title}</h3>
                <p className="text-center text-base-content/70 mb-6">{sector.description}</p>
                
                <div className="space-y-2 mb-6">
                  {sector.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-center">
                  <Link 
                    to={`/sectors/${sector.id}`} 
                    className="btn btn-primary btn-sm group-hover:btn-outline transition-all duration-300"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/sectors" className="btn btn-outline btn-lg">
            Explore All Sectors
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;