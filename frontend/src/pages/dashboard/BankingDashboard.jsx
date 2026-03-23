import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getBankingDashboardStats,
  getRecentTransactions
} from '../../services/bankingService';
import ReportExportButtons from '../../components/shared/ReportExportButtons';

const BankingDashboard = () => {

  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchTransactions();
  }, []);

  /**
   * Fetch dashboard statistics
   */
  const fetchDashboard = async () => {
    try {
      const res = await getBankingDashboardStats();
      const data = res.data || {};

      // Convert backend object → frontend cards
      const formattedStats = [
        {
          title: 'Active Accounts',
          value: data.activeAccounts ?? 0,
          change: '',
          icon: '🏦'
        },
        {
          title: 'Total Deposits',
          value: `$${data.totalDeposits ?? 0}`,
          change: '',
          icon: '💰'
        },
        {
          title: 'Pending Transactions',
          value: data.pendingTransactions ?? 0,
          change: '',
          icon: '⏳'
        },
        {
          title: 'Failed Transactions',
          value: data.failedTransactions ?? 0,
          change: '',
          icon: '⚠️'
        }
      ];

      setStats(formattedStats);

    } catch (error) {
      console.error('Failed to load dashboard stats', error);
    } finally {
      setLoadingStats(false);
    }
  };

  /**
   * Fetch recent transactions
   */
  const fetchTransactions = async () => {
    try {
      const res = await getRecentTransactions(0, 5);

      // Supports both pageable and normal responses
      const data = res.data?.content || res.data || [];

      setTransactions(data);

    } catch (error) {
      console.error('Failed to load transactions', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">

        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Banking Dashboard</h1>
            <p className="text-base-content/70">
              Real-time banking analytics overview
            </p>
          </div>

          <div className="flex space-x-2">
            <ReportExportButtons sectorCode="BANKING" />
            <button className="btn btn-primary">New Account</button>
          </div>
        </div>

        {/* Stats Cards */}
        {loadingStats ? (
          <div className="flex justify-center p-6">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {stats.map((stat, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-base-content/70 text-sm">
                        {stat.title}
                      </p>

                      <p className="text-2xl font-bold">
                        {stat.value}
                      </p>

                      {stat.change && (
                        <p className="text-success text-sm">
                          {stat.change}
                        </p>
                      )}
                    </div>

                    <div className="text-3xl">
                      {stat.icon}
                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 mt-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/dashboard/banking/accounts">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <div className="card-body items-center text-center">
                  <div className="p-4 rounded-full bg-primary text-white mb-2 text-2xl">💳</div>
                  <h3 className="card-title text-sm">Accounts</h3>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/banking/transactions">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <div className="card-body items-center text-center">
                  <div className="p-4 rounded-full bg-success text-white mb-2 text-2xl">💰</div>
                  <h3 className="card-title text-sm">Transactions</h3>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/banking/customers">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <div className="card-body items-center text-center">
                  <div className="p-4 rounded-full bg-info text-white mb-2 text-2xl">👥</div>
                  <h3 className="card-title text-sm">Customers</h3>
                </div>
              </div>
            </Link>
            <Link to="/dashboard/banking/compliance">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                <div className="card-body items-center text-center">
                  <div className="p-4 rounded-full bg-warning text-white mb-2 text-2xl">⚖️</div>
                  <h3 className="card-title text-sm">Compliance</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">

            <h3 className="card-title">Recent Transactions</h3>

            {loadingTransactions ? (
              <div className="flex justify-center p-6">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : (
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

                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((transaction) => (
                        <tr key={transaction.id}>

                          <td>
                            {transaction.customerName || 'Unknown'}
                          </td>

                          <td className="font-semibold">
                            ${transaction.amount}
                          </td>

                          <td>
                            {transaction.type}
                          </td>

                          <td>

                            <span
                              className={`badge ${
                                transaction.status === 'COMPLETED'
                                  ? 'badge-success'
                                  : transaction.status === 'PENDING'
                                  ? 'badge-warning'
                                  : 'badge-error'
                              }`}
                            >
                              {transaction.status}
                            </span>

                          </td>

                        </tr>
                      ))
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default BankingDashboard;
