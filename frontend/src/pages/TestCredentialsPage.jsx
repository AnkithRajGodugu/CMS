import { Link } from 'react-router-dom';

const TestCredentialsPage = () => {
  const testCredentials = [
    {
      role: 'Admin',
      username: 'admin@example.com',
      password: 'Admin123!',
      sector: 'All Sectors',
      description: 'Full system access (Login with Email or Username: admin)'
    },
    {
      role: 'Banking User',
      username: 'banking@example.com',
      password: 'Banking123!',
      sector: 'Banking',
      description: 'Banking sector access'
    },
    {
      role: 'Healthcare User',
      username: 'healthcare@example.com',
      password: 'Healthcare123!',
      sector: 'Healthcare',
      description: 'Healthcare sector access'
    },
    {
      role: 'Logistics User',
      username: 'logistics@example.com',
      password: 'Logistics123!',
      sector: 'Logistics',
      description: 'Logistics sector access'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Credentials</h1>
          <p className="text-gray-600 mb-6">
            Use these credentials to test different user roles and access levels
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testCredentials.map((cred, index) => (
            <div key={index} className="card bg-white shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg font-semibold text-primary">
                  {cred.role}
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Username:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                      {cred.username}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Password:</span>
                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                      {cred.password}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Sector:</span>
                    <span className="ml-2 badge badge-outline">{cred.sector}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{cred.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Note:</h3>
              <p className="text-sm">
                These are test credentials for development and demonstration purposes only. 
                In a production environment, users would register through the signup process 
                and receive proper authentication tokens.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCredentialsPage;