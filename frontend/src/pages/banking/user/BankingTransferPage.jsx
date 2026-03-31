import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../services/api';
import ExternalTransferForm from '../../../components/banking/ExternalTransferForm';

const BankingTransferPage = () => {
  const [accounts, setAccounts]   = useState([]);
  const [fromAcc, setFromAcc]     = useState('');
  const [toAcc, setToAcc]         = useState('');
  const [amount, setAmount]       = useState('');
  const [description, setDesc]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [activeTab, setActiveTab]   = useState('internal');

  useEffect(() => {
    api.get('/sectors/banking/my-accounts')
      .then(res => {
        const data = res.data ?? [];
        setAccounts(data);
        if (data.length > 0) setFromAcc(data[0].accountNumber);
        if (data.length > 1) setToAcc(data[1].accountNumber);
      })
      .catch(() => toast.error('Could not load your accounts.'))
      .finally(() => setLoadingAcc(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fromAcc || !toAcc || !amount) return toast.error('Please fill in all fields.');
    if (fromAcc === toAcc) return toast.error('Source and destination must differ.');
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return toast.error('Enter a valid amount.');

    setSubmitting(true);
    try {
      const res = await api.post('/sectors/banking/my-transfer', {
        fromAccount: fromAcc,
        toAccount:   toAcc,
        amount:      amt,
        description: description || 'Transfer',
      });
      toast.success(`Transfer successful! Ref: ${res.data.reference}`);
      setAmount('');
      setDesc('');
      // Refresh balances
      api.get('/sectors/banking/my-accounts').then(r => setAccounts(r.data ?? []));
    } catch (e) {
      const msg = e.response?.data?.error || 'Transfer failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fromBalance = accounts.find(a => a.accountNumber === fromAcc)?.balance ?? 0;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transfer Money</h1>
        <p className="text-base-content/60 mt-1">Move funds between accounts easily</p>
      </div>

      <div className="tabs tabs-boxed">
        <a 
          className={`tab ${activeTab === 'internal' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('internal')}
        >
          Internal Transfer
        </a>
        <a 
          className={`tab ${activeTab === 'external' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('external')}
        >
          External Transfer
        </a>
      </div>

      {loadingAcc ? (
        <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg" /></div>
      ) : activeTab === 'internal' ? (
        accounts.length < 2 ? (
          <div className="alert alert-warning">You need at least 2 accounts to make an internal transfer.</div>
        ) : (
          <form onSubmit={handleSubmit} className="card bg-base-100 border border-base-200 shadow-sm p-6 space-y-5">
            {/* From */}
            <div className="form-control">
            <label className="label"><span className="label-text font-medium">From Account</span></label>
            <select
              className="select select-bordered w-full"
              value={fromAcc}
              onChange={e => setFromAcc(e.target.value)}
            >
              {accounts.map(a => (
                <option key={a.id} value={a.accountNumber}>
                  {a.accountNumber} — {a.accountType} (${Number(a.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })})
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Available balance: <b className="text-success">${Number(fromBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
              </span>
            </label>
          </div>

          {/* To */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">To Account</span></label>
            <select
              className="select select-bordered w-full"
              value={toAcc}
              onChange={e => setToAcc(e.target.value)}
            >
              {accounts.filter(a => a.accountNumber !== fromAcc).map(a => (
                <option key={a.id} value={a.accountNumber}>
                  {a.accountNumber} — {a.accountType}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Amount ($)</span></label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="input input-bordered w-full"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label"><span className="label-text font-medium">Description (optional)</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Savings for rent"
              value={description}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Confirm Transfer'}
          </button>
        </form>
        ) 
      ) : (
        <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
            <ExternalTransferForm 
                accounts={accounts} 
                onTransferComplete={() => {
                    api.get('/sectors/banking/my-accounts').then(r => setAccounts(r.data ?? []));
                }} 
            />
        </div>
      )}
    </div>
  );
};

export default BankingTransferPage;
