import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

const BankingUserDashboard = () => {
  const [stats, setStats]         = useState(null);
  const [accounts, setAccounts]   = useState([]);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [statsRes, accountsRes, txnRes] = await Promise.all([
          api.get('/sectors/banking/my-dashboard'),
          api.get('/sectors/banking/my-accounts'),
          api.get('/sectors/banking/my-transactions', { params: { page: 0, size: 5 } }),
        ]);
        setStats(statsRes.data);
        setAccounts(accountsRes.data ?? []);
        setRecentTxns(txnRes.data?.content ?? []);
      } catch (e) {
        setError('Failed to load your banking dashboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  if (error) return <div className="alert alert-error m-6">{error}</div>;

  const typeColor = (t) => ({ DEPOSIT: 'text-success', WITHDRAWAL: 'text-error', TRANSFER: 'text-info', PAYMENT: 'text-warning' }[t] || '');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Banking Dashboard</h1>
          <p className="text-base-content/60">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} · 
            Total balance: <span className="font-semibold text-success">
              ${Number(stats?.totalBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/user/banking/transfer" className="btn btn-primary">Transfer Money</Link>
          <Link to="/user/banking/statements" className="btn btn-outline">Statements</Link>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-primary text-primary-content shadow-lg p-5">
          <p className="text-sm opacity-80">Total Balance</p>
          <p className="text-3xl font-extrabold mt-1">
            ${Number(stats?.totalBalance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
          <p className="text-sm text-base-content/60">Total Accounts</p>
          <p className="text-3xl font-extrabold mt-1">{stats?.accountCount ?? 0}</p>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
          <p className="text-sm text-base-content/60">Active Accounts</p>
          <p className="text-3xl font-extrabold mt-1 text-success">{stats?.activeAccounts ?? 0}</p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.length === 0 ? (
          <div className="col-span-3 card bg-base-100 border border-dashed border-base-300 p-8 text-center text-base-content/40">
            No accounts assigned to your profile yet.
          </div>
        ) : accounts.map((acc, i) => (
          <div key={acc.id} className={`card shadow-md p-5 ${i === 0 ? 'bg-gradient-to-br from-primary to-blue-700 text-primary-content' : 'bg-base-100 border border-base-200'}`}>
            <p className={`text-xs font-medium ${i === 0 ? 'opacity-70' : 'text-base-content/50'}`}>{acc.accountType ?? 'Account'}</p>
            <p className={`font-mono text-sm mt-1 ${i === 0 ? 'opacity-80' : 'text-base-content/60'}`}>{acc.accountNumber}</p>
            <p className="text-2xl font-extrabold mt-2">
              ${Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <span className={`badge badge-sm mt-2 ${acc.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{acc.status}</span>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between items-center mb-3">
            <h2 className="card-title text-lg">Recent Activity</h2>
            <Link to="/user/banking/transactions" className="btn btn-sm btn-ghost">View All →</Link>
          </div>
          {recentTxns.length === 0 ? (
            <p className="text-center py-8 text-base-content/40">No transactions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr><th>Account</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {recentTxns.map(t => (
                    <tr key={t.id}>
                      <td className="font-mono text-sm">{t.accountNumber}</td>
                      <td className={`font-semibold ${typeColor(t.type)}`}>{t.type}</td>
                      <td className="font-bold">${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td><span className={`badge badge-sm ${t.status === 'COMPLETED' ? 'badge-success' : t.status === 'PENDING' ? 'badge-warning' : 'badge-error'}`}>{t.status}</span></td>
                      <td className="text-sm text-base-content/60">{new Date(t.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingUserDashboard;
