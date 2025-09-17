import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { sector } = useParams();
  const navigate = useNavigate();

  const sectorConfig = {
    banking: {
      name: 'Banking & Finance',
      icon: '🏦',
      color: 'text-blue-600',
      menuItems: [
        { name: 'Dashboard', path: '/dashboard/banking', icon: '📊' },
        { name: 'Accounts', path: '/dashboard/banking/accounts', icon: '💳' },
        { name: 'Transactions', path: '/dashboard/banking/transactions', icon: '💰' },
        { name: 'Customers', path: '/dashboard/banking/customers', icon: '👥' },
        { name: 'Reports', path: '/dashboard/banking/reports', icon: '📈' },
        { name: 'Compliance', path: '/dashboard/banking/compliance', icon: '⚖️' }
      ]
    },
    healthcare: {
      name: 'Healthcare',
      icon: '🏥',
      color: 'text-green-600',
      menuItems: [
        { name: 'Dashboard', path: '/dashboard/healthcare', icon: '📊' },
        { name: 'Patients', path: '/dashboard/healthcare/patients', icon: '🏥' },
        { name: 'Appointments', path: '/dashboard/healthcare/appointments', icon: '📅' },
        { name: 'Medical Records', path: '/dashboard/healthcare/records', icon: '📋' },
        { name: 'Staff', path: '/dashboard/healthcare/staff', icon: '👨‍⚕️' },
        { name: 'Reports', path: '/dashboard/healthcare/reports', icon: '📈' }
      ]
    },
    logistics: {
      name: 'Logistics',
      icon: '🚛',
      color: 'text-orange-600',
      menuItems: [
        { name: 'Dashboard', path: '/dashboard/logistics', icon: '📊' },
        { name: 'Shipments', path: '/dashboard/logistics/shipments', icon: '📦' },
        { name: 'Inventory', path: '/dashboard/logistics/inventory', icon: '📋' },
        { name: 'Routes', path: '/dashboard/logistics/routes', icon: '🗺️' },
        { name: 'Vendors', path: '/dashboard/logistics/vendors', icon: '🏢' },
        { name: 'Reports', path: '/dashboard/logistics/reports', icon: '📈' }
      ]
    },
    content: {
      name: 'Content Creation',
      icon: '🎨',
      color: 'text-purple-600',
      menuItems: [
        { name: 'Dashboard', path: '/dashboard/content', icon: '📊' },
        { name: 'Projects', path: '/dashboard/content/projects', icon: '📁' },
        { name: 'Clients', path: '/dashboard/content/clients', icon: '👥' },
        { name: 'Content', path: '/dashboard/content/content', icon: '📝' },
        { name: 'Calendar', path: '/dashboard/content/calendar', icon: '📅' },
        { name: 'Reports', path: '/dashboard/content/reports', icon: '📈' }
      ]
    }
  };

  const currentSector = sectorConfig[sector] || sectorConfig.banking;

  const handleLogout = () => {
    // Clear auth data
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Mobile menu overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentSector.icon}</span>
            <div>
              <h2 className="font-bold text-lg">CMS Platform</h2>
              <p className={`text-sm ${currentSector.color}`}>{currentSector.name}</p>
            </div>
          </div>
          <button 
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {currentSector.menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="dropdown dropdown-top w-full">
            <div tabIndex={0} role="button" className="btn btn-ghost w-full justify-start">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span className="text-xs">JD</span>
                </div>
              </div>
              <div className="text-left">
                <div className="font-medium">John Doe</div>
                <div className="text-xs opacity-60">Admin</div>
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-base-100 shadow-sm border-b">
          <div className="flex items-center justify-between p-4">
            <button
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="form-control">
                <input type="text" placeholder="Search..." className="input input-bordered input-sm w-64" />
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="btn btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z" />
                  </svg>
                </button>
                <button className="btn btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;