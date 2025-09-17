import DashboardLayout from '../../components/dashboard/DashboardLayout';

const BankingDashboard = () => {
  const stats = [
    { title: 'Total Accounts', value: '12,543', change: '+12%', icon: '💳' },
    { title: 'Active Customers', value: '8,921', change: '+8%', icon: '👥' },
    { title: 'Monthly Transactions', value: '$2.4M', change: '+15%', icon: '💰' },
    { title: 'Loan Applications', value: '234', change: '+5%', icon: '📋' }
  ];

  const recentTransactions = [
    { id: 1, customer: 'John Smith', amount: '$1,250.00', type: 'Transfer', status: 'Completed' },
    { id: 2, customer: 'Sarah Johnson', amount: '$850.00', type: 'Deposit', status: 'Pending' },
    { id: 3, customer: 'Mike Davis', amount: '$2,100.00', type: 'Withdrawal', status: 'Completed' },
    { id: 4, customer: 'Emily Brown', amount: '$500.00', type: 'Transfer', status: 'Failed' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Banking Dashboard</h1>
            <p className="text-base-content/70">Welcome back! Here's what's happening with your bank today.</p>
          </div>
          <div className="flex space-x-2">
            <button className="btn btn-outline">Export Report</button>
            <button className="btn btn-primary">New Account</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base-content/70 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-success text-sm">{stat.change} from last month</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.customer}</td>
                        <td className="font-semibold">{transaction.amount}</td>
                        <td>{transaction.type}</td>
                        <td>
                          <span className={`badge ${
                            transaction.status === 'Completed' ? 'badge-success' :
                            transaction.status === 'Pending' ? 'badge-warning' :
                            'badge-error'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="btn btn-outline">
                  <span className="mr-2">👤</span>
                  New Customer
                </button>
                <button className="btn btn-outline">
                  <span className="mr-2">💳</span>
                  Open Account
                </button>
                <button className="btn btn-outline">
                  <span className="mr-2">💰</span>
                  Process Loan
                </button>
                <button className="btn btn-outline">
                  <span className="mr-2">📊</span>
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">System Alerts</h3>
            <div className="space-y-3">
              <div className="alert alert-warning">
                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>5 loan applications require immediate review</span>
              </div>
              <div className="alert alert-info">
                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>System maintenance scheduled for tonight at 2 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BankingDashboard;