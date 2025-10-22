import { Link } from 'react-router-dom';
import { FaEdit, FaProjectDiagram, FaUsers, FaCalendarAlt, FaFileAlt, FaClock } from 'react-icons/fa';

const ContentDashboard = () => {
  const stats = [
    { label: 'Active Projects', value: '24', change: '+8%', icon: FaProjectDiagram, color: 'text-primary' },
    { label: 'Total Clients', value: '156', change: '+12%', icon: FaUsers, color: 'text-success' },
    { label: 'Content Pieces', value: '342', change: '+25%', icon: FaFileAlt, color: 'text-info' },
    { label: 'Hours Tracked', value: '1,234', change: '+15%', icon: FaClock, color: 'text-warning' },
  ];

  const quickActions = [
    { title: 'Project Management', path: '/content-creation/ProjectManagementPage', icon: FaProjectDiagram, color: 'bg-primary' },
    { title: 'Client Portal', path: '/content-creation/ClientPortalPage', icon: FaUsers, color: 'bg-success' },
    { title: 'Content Calendar', path: '/content-creation/ContentCalendarPage', icon: FaCalendarAlt, color: 'bg-info' },
    { title: 'Collaboration', path: '/content-creation/CollaborationToolsPage', icon: FaEdit, color: 'bg-warning' },
    { title: 'Asset Management', path: '/content-creation/AssetManagementPage', icon: FaFileAlt, color: 'bg-error' },
    { title: 'Time Tracking', path: '/content-creation/TimeTrackingPage', icon: FaClock, color: 'bg-secondary' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaEdit className="text-4xl text-primary" />
            <h1 className="text-4xl font-bold">Content Creation Dashboard</h1>
          </div>
          <p className="text-base-content/70">Manage projects, clients, and creative workflows</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-base-content/70">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path}>
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  <div className="card-body items-center text-center">
                    <div className={`p-4 rounded-full ${action.color} text-white mb-2`}>
                      <action.icon className="text-3xl" />
                    </div>
                    <h3 className="card-title text-lg">{action.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Projects</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Brand Campaign 2024</td>
                    <td>Acme Corp</td>
                    <td><span className="badge badge-info">In Progress</span></td>
                    <td>Dec 15, 2024</td>
                  </tr>
                  <tr>
                    <td>Social Media Content</td>
                    <td>TechStart Inc</td>
                    <td><span className="badge badge-success">Completed</span></td>
                    <td>Oct 20, 2024</td>
                  </tr>
                  <tr>
                    <td>Website Redesign</td>
                    <td>Global Solutions</td>
                    <td><span className="badge badge-warning">Review</span></td>
                    <td>Nov 30, 2024</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;
