import { Link } from 'react-router-dom';

const WorkingLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to CMS Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive management system for banking, healthcare, logistics, and content creation sectors.
          </p>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="btn btn-primary btn-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/signup" 
              className="btn btn-outline btn-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card bg-white shadow-lg">
            <div className="card-body text-center">
              <h3 className="card-title">Banking</h3>
              <p>Manage loans, accounts, and financial services</p>
              <div className="card-actions justify-center">
                <Link to="/sectors/banking" className="btn btn-primary btn-sm">
                  Explore
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body text-center">
              <h3 className="card-title">Healthcare</h3>
              <p>Patient management and medical records</p>
              <div className="card-actions justify-center">
                <Link to="/sectors/healthcare" className="btn btn-primary btn-sm">
                  Explore
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body text-center">
              <h3 className="card-title">Logistics</h3>
              <p>Supply chain and inventory management</p>
              <div className="card-actions justify-center">
                <Link to="/sectors/logistics" className="btn btn-primary btn-sm">
                  Explore
                </Link>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body text-center">
              <h3 className="card-title">Content</h3>
              <p>Content creation and project management</p>
              <div className="card-actions justify-center">
                <Link to="/sectors/content" className="btn btn-primary btn-sm">
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Test Links */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Test Features</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/counter" className="btn btn-outline">Redux Counter Test</Link>
            <Link to="/theme-test" className="btn btn-outline">Theme Test</Link>
            <Link to="/about" className="btn btn-outline">About Page</Link>
            <Link to="/docs" className="btn btn-outline">Documentation</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingLandingPage;