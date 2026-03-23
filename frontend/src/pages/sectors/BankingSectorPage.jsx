import { Link } from "react-router-dom";
const BankingSectorPage = () => {
  const features = [
    {
      title: "Account Management",
      description:
        "Comprehensive account lifecycle management with automated workflows",
      icon: "💳",
    },
    {
      title: "Transaction Tracking",
      description:
        "Real-time transaction monitoring with fraud detection capabilities",
      icon: "💰",
    },
    {
      title: "Compliance Tools",
      description: "Built-in regulatory compliance with automated reporting",
      icon: "⚖️",
    },
    {
      title: "Risk Assessment",
      description: "Advanced risk analytics and credit scoring algorithms",
      icon: "📊",
    },
    {
      title: "Customer Onboarding",
      description: "Streamlined KYC/AML processes with digital verification",
      icon: "👤",
    },
    {
      title: "Loan Management",
      description:
        "End-to-end loan processing from application to disbursement",
      icon: "🏠",
    },
  ];

  const benefits = [
    "Reduce operational costs by up to 40%",
    "Improve customer satisfaction scores",
    "Ensure 100% regulatory compliance",
    "Accelerate loan processing by 60%",
    "Real-time fraud detection and prevention",
    "Seamless integration with core banking systems",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Operations, Metro Bank",
      content:
        "The CMS platform transformed our customer management process. We've seen a 35% improvement in operational efficiency.",
      avatar: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "IT Director, First National",
      content:
        "Implementation was seamless and the compliance features saved us months of development time.",
      avatar: "👨‍💻",
    },
  ];

  return (
    <div className="min-h-screen">
      

      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="text-6xl mb-6">🏦</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Banking & Finance
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                CMS Solution
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Comprehensive customer management for banks, credit unions, and
              financial institutions with advanced compliance and risk
              management features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/demo"
                className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-600"
              >
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
              Powerful Features for
              <span className="text-blue-600"> Banking Excellence</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Everything you need to manage banking operations efficiently and
              securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="card-body text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="card-title justify-center mb-4 text-blue-600">
                    {feature.title}
                  </h3>
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
                Why Choose Our
                <span className="text-blue-600"> Banking Solution?</span>
              </h2>
              <p className="text-xl text-base-content/70 mb-8">
                Our platform is specifically designed for the banking industry
                with features that address the unique challenges of financial
                institutions.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      className="w-6 h-6 text-success mr-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-6">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">40%</div>
                    <div className="text-sm opacity-70">Cost Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">60%</div>
                    <div className="text-sm opacity-70">Faster Processing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      99.9%
                    </div>
                    <div className="text-sm opacity-70">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">100%</div>
                    <div className="text-sm opacity-70">Compliance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              What Our Banking Clients Say
            </h2>
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
                  <p className="text-base-content/80 italic">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Banking Operations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading financial institutions already using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-blue-600"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankingSectorPage;
