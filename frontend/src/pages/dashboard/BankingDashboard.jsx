import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getBankingDashboardStats,
  getRecentTransactions,
  createBankAccount
} from '../../services/bankingService';
import ReportExportButtons from '../../components/shared/ReportExportButtons';
import SystemMetricsWidget from '../../components/shared/SystemMetricsWidget';

const BankingDashboard = () => {

  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    payload.balance = parseFloat(payload.balance);
    try {
      await createBankAccount(payload);
      document.getElementById('new_account_modal').close();
      e.target.reset();
      fetchDashboard(); // refresh stats right after creation!
      
      // Show success feedback correctly
      setToastMessage(`Account ${payload.accountNumber} created successfully!`);
      setTimeout(() => setToastMessage(''), 4000);

    } catch (err) {
      console.error(err);
      alert('Failed to create account: ' + (err.response?.data?.error || err.response?.data?.message || err.message));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Success Toast */}
      {toastMessage && (
        <div className="toast toast-top toast-center z-[100]">
          <div className="alert alert-success text-white font-semibold shadow-xl border-none">
            <span>🎉 {toastMessage}</span>
          </div>
        </div>
      )}

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
            <button className="btn btn-primary" onClick={() => document.getElementById('new_account_modal').showModal()}>New Account</button>
          </div>
        </div>

        {/* System Metrics (Visible only to Admins) */}
        <SystemMetricsWidget />

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

        {/* New Account Modal */}
        <dialog id="new_account_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Account</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="form-control">
                <label className="label">Customer Name</label>
                <input type="text" name="customerName" required className="input input-bordered w-full" placeholder="Full Name" />
              </div>
              <div className="form-control">
                <label className="label">Account Number</label>
                <input type="text" name="accountNumber" required className="input input-bordered w-full" placeholder="e.g. ACC-12345" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">Account Type</label>
                  <select name="accountType" className="select select-bordered" required defaultValue="SAVINGS">
                    <option value="SAVINGS">Savings</option>
                    <option value="CHECKING">Checking</option>
                    <option value="BUSINESS">Business</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">Initial Balance ($)</label>
                  <input type="number" name="balance" step="0.01" required defaultValue="0.00" className="input input-bordered w-full" />
                </div>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => document.getElementById('new_account_modal').close()}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? <span className="loading loading-spinner"></span> : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

      </div>
    </div>
  );
};

export default BankingDashboard;
