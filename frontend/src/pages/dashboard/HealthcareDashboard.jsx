import { Link } from 'react-router-dom';
import { FaHospital, FaUserMd, FaCalendarCheck, FaFileMedical, FaShieldAlt } from 'react-icons/fa';
import ReportExportButtons from '../../components/shared/ReportExportButtons';

const HealthcareDashboard = () => {
  const stats = [
    { label: 'Total Patients', value: '1,234', change: '+12%', icon: FaUserMd, color: 'text-success' },
    { label: 'Appointments Today', value: '45', change: '+5%', icon: FaCalendarCheck, color: 'text-info' },
    { label: 'Active Cases', value: '89', change: '-3%', icon: FaFileMedical, color: 'text-warning' },
    { label: 'Compliance Score', value: '98%', change: '+2%', icon: FaShieldAlt, color: 'text-success' },
  ];

  const quickActions = [
    { title: 'Patient Records', path: '/healthcare/PatientRecordsPage', icon: FaUserMd, color: 'bg-success' },
    { title: 'Appointments', path: '/healthcare/AppointmentSchedulingPage', icon: FaCalendarCheck, color: 'bg-info' },
    { title: 'Medical History', path: '/healthcare/MedicalHistoryPage', icon: FaFileMedical, color: 'bg-warning' },
    { title: 'Insurance', path: '/healthcare/InsuranceManagementPage', icon: FaShieldAlt, color: 'bg-error' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-6">
        {/* Header */}
          <div className="flex justify-between items-end mb-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaHospital className="text-4xl text-success" />
                <h1 className="text-4xl font-bold">Healthcare Dashboard</h1>
              </div>
              <p className="text-base-content/70">Manage patients, appointments, and medical records</p>
            </div>
            <ReportExportButtons sectorCode="HEALTHCARE" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Appointment Scheduled</td>
                    <td>10 minutes ago</td>
                    <td><span className="badge badge-success">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Medical Record Updated</td>
                    <td>1 hour ago</td>
                    <td><span className="badge badge-info">Updated</span></td>
                  </tr>
                  <tr>
                    <td>Bob Johnson</td>
                    <td>Prescription Issued</td>
                    <td>2 hours ago</td>
                    <td><span className="badge badge-success">Completed</span></td>
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

export default HealthcareDashboard;
