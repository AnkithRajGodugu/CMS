import { Link } from 'react-router-dom';
const HealthcareSectorPage = () => {
  const features = [
    {
      title: 'Patient Records',
      description: 'Secure electronic health records with HIPAA compliance',
      icon: '📋'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Intelligent scheduling system with automated reminders',
      icon: '📅'
    },
    {
      title: 'Medical History',
      description: 'Comprehensive patient history tracking and analytics',
      icon: '🩺'
    },
    {
      title: 'Insurance Management',
      description: 'Streamlined insurance verification and claims processing',
      icon: '🏥'
    },
    {
      title: 'Prescription Management',
      description: 'Digital prescription system with drug interaction alerts',
      icon: '💊'
    },
    {
      title: 'Telemedicine Integration',
      description: 'Built-in video consultation and remote monitoring',
      icon: '💻'
    }
  ];

  const benefits = [
    'Reduce patient wait times by 50%',
    'Improve care coordination across departments',
    'Ensure HIPAA and healthcare compliance',
    'Increase patient satisfaction scores',
    'Streamline billing and insurance processes',
    'Enable remote patient monitoring'
  ];

  const testimonials = [
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Chief Medical Officer, City General Hospital',
      content: 'Our patient care quality has improved significantly since implementing this system. The integrated approach saves us hours daily.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'James Wilson',
      role: 'IT Manager, HealthCare Plus',
      content: 'The HIPAA compliance features and security measures give us complete peace of mind when handling sensitive patient data.',
      avatar: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen">
      
      
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-green-500 to-green-700">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="text-6xl mb-6">🏥</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Healthcare
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Patient management system designed for hospitals, clinics, and healthcare providers 
              with comprehensive care coordination and compliance features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-green-600">
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
              Advanced Features for
              <span className="text-green-600"> Better Patient Care</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Comprehensive healthcare management tools designed to improve patient outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="card-title justify-center mb-4 text-green-600">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Healthcare Providers
                <span className="text-green-600"> Choose Us?</span>
              </h2>
              <p className="text-xl text-base-content/70 mb-8">
                Our healthcare CMS is built with patient care at its core, ensuring compliance 
                while improving operational efficiency.
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
                <h3 className="card-title text-2xl mb-6">Healthcare Impact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">50%</div>
                    <div className="text-sm opacity-70">Reduced Wait Times</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">95%</div>
                    <div className="text-sm opacity-70">Patient Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">100%</div>
                    <div className="text-sm opacity-70">HIPAA Compliant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">24/7</div>
                    <div className="text-sm opacity-70">System Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Healthcare Compliance & Security</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Built with healthcare regulations in mind, ensuring your practice stays compliant.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="card-title justify-center mb-4">HIPAA Compliant</h3>
                <p className="text-base-content/70">Full HIPAA compliance with encrypted data storage and secure access controls.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="card-title justify-center mb-4">Data Security</h3>
                <p className="text-base-content/70">Enterprise-grade security with end-to-end encryption and audit trails.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="card-title justify-center mb-4">Reporting</h3>
                <p className="text-base-content/70">Comprehensive reporting for quality measures and regulatory requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Healthcare Professionals Say</h2>
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
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Improve Patient Care?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join healthcare providers who trust our platform for better patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-green-600">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthcareSectorPage;
