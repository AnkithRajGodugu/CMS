import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const LogisticsSectorPage = () => {
  const features = [
    {
      title: 'Shipment Tracking',
      description: 'Real-time tracking with GPS integration and delivery notifications',
      icon: '📦'
    },
    {
      title: 'Inventory Management',
      description: 'Smart inventory control with automated reordering and forecasting',
      icon: '📋'
    },
    {
      title: 'Route Optimization',
      description: 'AI-powered route planning to minimize costs and delivery times',
      icon: '🗺️'
    },
    {
      title: 'Vendor Relations',
      description: 'Comprehensive vendor management with performance tracking',
      icon: '🏢'
    },
    {
      title: 'Warehouse Management',
      description: 'Complete warehouse operations with barcode scanning and automation',
      icon: '🏭'
    },
    {
      title: 'Fleet Management',
      description: 'Vehicle tracking, maintenance scheduling, and driver management',
      icon: '🚛'
    }
  ];

  const benefits = [
    'Reduce shipping costs by up to 30%',
    'Improve delivery times and accuracy',
    'Optimize warehouse operations',
    'Enhance supply chain visibility',
    'Automate inventory management',
    'Streamline vendor communications'
  ];

  const testimonials = [
    {
      name: 'Robert Martinez',
      role: 'Operations Director, Global Logistics Inc.',
      content: 'The route optimization feature alone saved us 25% on fuel costs. The real-time tracking keeps our customers happy.',
      avatar: '👨‍💼'
    },
    {
      name: 'Lisa Thompson',
      role: 'Supply Chain Manager, FastShip Co.',
      content: 'Inventory management has never been easier. The automated reordering prevents stockouts and reduces carrying costs.',
      avatar: '👩‍💼'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-orange-500 to-orange-700">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="text-6xl mb-6">🚛</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Logistics & Supply Chain
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">
                Management Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Streamline operations for shipping, warehousing, and supply chain management 
              with intelligent automation and real-time visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-orange-600">
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Tools for
              <span className="text-orange-600"> Supply Chain Excellence</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Complete logistics management solution with advanced automation and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              // Map feature titles to their respective page routes
              const pageRoutes = {
                'Shipment Tracking': '/logistics-&-supply/LogisticsShipmentTrackingPage',
                'Inventory Management': '/logistics-&-supply/LogisticsInventoryManagementPage',
                'Route Optimization': '/logistics-&-supply/LogisticsRouteOptimizationPage',
                'Vendor Relations': '/logistics-&-supply/LogisticsVendorRelationsPage',
                'Warehouse Management': '/logistics-&-supply/LogisticsWarehouseManagementPage',
                'Fleet Management': '/logistics-&-supply/LogisticsFleetManagementPage',
              };
              const route = pageRoutes[feature.title];
              return (
                <Link to={route} key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="card-body text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="card-title justify-center mb-4 text-orange-600">{feature.title}</h3>
                    <p className="text-base-content/70">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Logistics Companies
                <span className="text-orange-600"> Trust Our Platform?</span>
              </h2>
              <p className="text-xl text-base-content/70 mb-8">
                Our logistics CMS is designed to handle the complexity of modern supply chains 
                while providing the visibility and control you need.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-6 h-6 text-success mr-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-6">Logistics Performance</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">30%</div>
                    <div className="text-sm opacity-70">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">45%</div>
                    <div className="text-sm opacity-70">Faster Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">98%</div>
                    <div className="text-sm opacity-70">On-Time Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">100%</div>
                    <div className="text-sm opacity-70">Shipment Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Advanced Logistics Technology</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Powered by AI and machine learning for intelligent supply chain optimization.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="card-title justify-center mb-4">AI Route Optimization</h3>
                <p className="text-base-content/70">Machine learning algorithms optimize routes in real-time based on traffic, weather, and delivery priorities.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="card-title justify-center mb-4">Mobile Integration</h3>
                <p className="text-base-content/70">Native mobile apps for drivers and warehouse staff with offline capabilities and real-time sync.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="card-title justify-center mb-4">API Integration</h3>
                <p className="text-base-content/70">Seamless integration with existing ERP, WMS, and TMS systems through robust APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Logistics Leaders Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm opacity-70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-base-content/80 italic">"{testimonial.content}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Optimize Your Supply Chain?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join logistics companies that have transformed their operations with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-orange-600">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LogisticsSectorPage;