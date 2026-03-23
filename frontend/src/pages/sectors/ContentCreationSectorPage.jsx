import { Link } from 'react-router-dom';
const ContentCreationSectorPage = () => {
  const features = [
    {
      title: 'Project Management',
      description: 'Comprehensive project tracking with timelines, milestones, and deliverables',
      icon: '📁'
    },
    {
      title: 'Client Portal',
      description: 'Dedicated client portals for feedback, approvals, and collaboration',
      icon: '👥'
    },
    {
      title: 'Content Calendar',
      description: 'Visual content planning with scheduling and publishing automation',
      icon: '📅'
    },
    {
      title: 'Collaboration Tools',
      description: 'Real-time collaboration with comments, reviews, and version control',
      icon: '🤝'
    },
    {
      title: 'Asset Management',
      description: 'Centralized digital asset library with tagging and search capabilities',
      icon: '🎨'
    },
    {
      title: 'Time Tracking',
      description: 'Accurate time tracking and billing with detailed reporting',
      icon: '⏰'
    }
  ];

  const benefits = [
    'Increase project delivery speed by 40%',
    'Improve client satisfaction and retention',
    'Streamline creative workflows',
    'Enhance team collaboration',
    'Automate billing and invoicing',
    'Centralize all creative assets'
  ];

  const testimonials = [
    {
      name: 'Alex Rivera',
      role: 'Creative Director, Pixel Perfect Agency',
      content: 'This platform revolutionized how we manage creative projects. Client feedback is seamless and our team productivity has skyrocketed.',
      avatar: '👨‍🎨'
    },
    {
      name: 'Maria Santos',
      role: 'Freelance Content Creator',
      content: 'As a freelancer, the client portal and time tracking features help me stay organized and professional with all my clients.',
      avatar: '👩‍💻'
    }
  ];

  return (
    <div className="min-h-screen">
      
      
      {/* Hero Section */}
      <section className="hero min-h-[60vh] bg-gradient-to-r from-purple-500 to-purple-700">
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <div className="text-6xl mb-6">🎨</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Content Creation
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
                Management Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Manage clients, projects, and content workflows for creative agencies and freelancers 
              with powerful collaboration and project management tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/demo" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-purple-600">
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
              Creative Tools for
              <span className="text-purple-600"> Content Excellence</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Everything creative professionals need to manage projects and deliver outstanding content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const pageRoutes = {
                'Project Management': '/content-creation/ProjectManagementPage',
                'Client Portal': '/content-creation/ClientPortalPage',
                'Content Calendar': '/content-creation/ContentCalendarPage',
                'Collaboration Tools': '/content-creation/CollaborationToolsPage',
                'Asset Management': '/content-creation/AssetManagementPage',
                'Time Tracking': '/content-creation/TimeTrackingPage',
              };
              const route = pageRoutes[feature.title];
              return (
                <Link to={route} key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="card-body text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="card-title justify-center mb-4 text-purple-600">{feature.title}</h3>
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
                Why Creative Professionals
                <span className="text-purple-600"> Love Our Platform?</span>
              </h2>
              <p className="text-xl text-base-content/70 mb-8">
                Built specifically for creative workflows, our platform understands the unique 
                challenges of content creation and client management.
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
                <h3 className="card-title text-2xl mb-6">Creative Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">40%</div>
                    <div className="text-sm opacity-70">Faster Delivery</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">90%</div>
                    <div className="text-sm opacity-70">Client Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">60%</div>
                    <div className="text-sm opacity-70">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">100%</div>
                    <div className="text-sm opacity-70">Project Visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Streamlined Creative Workflow</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              From initial brief to final delivery, manage every step of your creative process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="card-title justify-center mb-4">Brief & Planning</h3>
                <p className="text-base-content/70">Capture client requirements and create detailed project plans with timelines.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🎨</div>
                <h3 className="card-title justify-center mb-4">Create & Collaborate</h3>
                <p className="text-base-content/70">Work with your team using built-in collaboration tools and version control.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">👀</div>
                <h3 className="card-title justify-center mb-4">Review & Approve</h3>
                <p className="text-base-content/70">Get client feedback and approvals through dedicated review portals.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="card-title justify-center mb-4">Deliver & Invoice</h3>
                <p className="text-base-content/70">Deliver final assets and automatically generate invoices based on tracked time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Creative Professionals Say</h2>
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

      {/* Pricing Preview */}
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Perfect for Every Creative</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Whether you're a freelancer or running a creative agency, we have the right plan for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-2xl mb-4">Freelancer</h3>
                <div className="text-4xl font-bold text-purple-600 mb-4">$29/mo</div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Up to 5 projects</li>
                  <li>✓ 3 client portals</li>
                  <li>✓ Basic time tracking</li>
                  <li>✓ 10GB storage</li>
                </ul>
                <Link to="/signup" className="btn btn-outline btn-block">Get Started</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl border-2 border-purple-600">
              <div className="card-body text-center">
                <div className="badge badge-purple mb-2">Most Popular</div>
                <h3 className="card-title justify-center text-2xl mb-4">Agency</h3>
                <div className="text-4xl font-bold text-purple-600 mb-4">$99/mo</div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Unlimited projects</li>
                  <li>✓ Unlimited client portals</li>
                  <li>✓ Advanced collaboration</li>
                  <li>✓ 100GB storage</li>
                  <li>✓ Team management</li>
                </ul>
                <Link to="/signup" className="btn btn-primary btn-block">Get Started</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-2xl mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-purple-600 mb-4">Custom</div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Everything in Agency</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ Unlimited storage</li>
                  <li>✓ White-label options</li>
                </ul>
                <Link to="/contact" className="btn btn-outline btn-block">Contact Sales</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Elevate Your Creative Process?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creative professionals who trust our platform for project success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-purple-600">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentCreationSectorPage;
