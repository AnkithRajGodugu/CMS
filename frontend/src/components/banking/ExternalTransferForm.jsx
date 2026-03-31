import React, { useState } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

const ExternalTransferForm = ({ accounts, onTransferComplete }) => {
    const [formData, setFormData] = useState({
        fromAccount: '',
        routingNumber: '',
        externalAccount: '',
        amount: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [feeWarning, setFeeWarning] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'amount') {
            const amt = parseFloat(value);
            setFeeWarning(amt && amt > 0 ? (amt * 0.005).toFixed(2) : 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fromAccount) {
            toast.error('Please select a source account.');
            return;
        }
        
        if (!formData.routingNumber.match(/^\d{9}$/)) {
            toast.error('Routing number must be exactly 9 digits.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/sectors/banking/my-external-transfer', formData);
            toast.success('External transfer initiated successfully.');
            setFormData({
                fromAccount: '',
                routingNumber: '',
                externalAccount: '',
                amount: '',
                description: ''
            });
            setFeeWarning(0);
            if (onTransferComplete) {
                onTransferComplete(res.data);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to process external transfer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
                <label className="label"><span className="label-text">From Account</span></label>
                <select 
                    className="select select-bordered w-full" 
                    name="fromAccount" 
                    value={formData.fromAccount} 
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Select Source Account</option>
                    {accounts.map(acc => (
                        <option key={acc.accountNumber} value={acc.accountNumber}>
                            {acc.accountNumber} - ₹{parseFloat(acc.balance).toLocaleString()} 
                            ({acc.status})
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Routing Number (9 Digits)</span>
                    </label>
                    <input 
                        type="text" 
                        name="routingNumber" 
                        placeholder="123456789"
                        className="input input-bordered w-full font-mono tracking-widest" 
                        value={formData.routingNumber} 
                        onChange={handleChange}
                        maxLength="9"
                        required 
                    />
                </div>
                
                <div className="form-control">
                    <label className="label"><span className="label-text">Destination Account</span></label>
                    <input 
                        type="text" 
                        name="externalAccount" 
                        placeholder="Account Number"
                        className="input input-bordered w-full font-mono" 
                        value={formData.externalAccount} 
                        onChange={handleChange}
                        required 
                    />
                </div>
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text">Amount (₹)</span></label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50">₹</span>
                    <input 
                        type="number" 
                        name="amount" 
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        className="input input-bordered w-full pl-8" 
                        value={formData.amount} 
                        onChange={handleChange}
                        required 
                    />
                </div>
                {feeWarning > 0 && (
                    <label className="label">
                        <span className="label-text-alt text-warning">
                            * A 0.5% protocol fee (₹{feeWarning}) will be deducted from your balance. Total deduction: ₹{(parseFloat(formData.amount) + parseFloat(feeWarning)).toFixed(2)}
                        </span>
                    </label>
                )}
            </div>

            <div className="form-control">
                <label className="label"><span className="label-text">Description / Note</span></label>
                <input 
                    type="text" 
                    name="description" 
                    placeholder="e.g. Rent Payment, Invoice #1234"
                    className="input input-bordered w-full" 
                    value={formData.description} 
                    onChange={handleChange}
                />
            </div>

            <div className="form-control mt-6">
                <button 
                    type="submit" 
                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : 'Transfer to External Account'}
                </button>
            </div>
        </form>
    );
};

export default ExternalTransferForm;
