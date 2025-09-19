import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TestCredentialsPage = () => {
  const credentials = [
    {
      sector: 'Banking & Finance',
      color: 'text-blue-600',
      users: [
        { username: 'banking_admin', password: 'password123', role: 'Admin' },
        { username: 'banking_manager', password: 'password123', role: 'Manager' },
        { username: 'banking_user', password: 'password123', role: 'User' }
      ]
    },
    {
      sector: 'Healthcare',
      color: 'text-green-600',
      users: [
        { username: 'healthcare_admin', password: 'password123', role: 'Admin' },
        { username: 'healthcare_manager', password: 'password123', role: 'Manager' },
        { username: 'healthcare_user', password: 'password123', role: 'User' }
      ]
    },
    {
      sector: 'Logistics & Supply Chain',
      color: 'text-orange-600',
      users: [
        { username: 'logistics_admin', password: 'password123', role: 'Admin' },
        { username: 'logistics_manager', password: 'password123', role: 'Manager' },
        { username: 'logistics_user', password: 'password123', role: 'User' }
      ]
    },
    {
      sector: 'Content Creation',
      color: 'text-purple-600',
      users: [
        { username: 'content_admin', password: 'password123', role: 'Admin' },
        { username: 'content_manager', password: 'password123', role: 'Manager' },
        { username: 'content_user', password: 'password123', role: 'User' }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Test Login
              <span className="gradient-text"> Credentials</span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Use these credentials to test the login functionality for different sectors and roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {credentials.map((sector, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className={`card-title text-2xl mb-6 ${sector.color}`}>
                    {sector.sector}
                  </h2>
                  
                  <div className="space-y-4">
                    {sector.users.map((user, userIndex) => (
                      <div key={userIndex} className="p-4 bg-base-200 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{user.role}</span>
                          <span className="badge badge-outline">{user.username}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div><strong>Username:</strong> {user.username}</div>
                          <div><strong>Password:</strong> {user.password}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-actions justify-center mt-6">
                    <Link to="/login" className="btn btn-primary">
                      Go to Login
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="alert alert-info max-w-2xl mx-auto">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">How to Test:</h3>
                <div className="text-sm">
                  1. Choose any username and password from above<br/>
                  2. Go to the login page<br/>
                  3. Enter the credentials<br/>
                  4. You'll be redirected to the appropriate sector dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TestCredentialsPage;