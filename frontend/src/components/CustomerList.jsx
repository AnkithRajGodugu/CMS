import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get('/customers');
                setCustomers(response.data);
            } catch (err) {
                console.error('Failed to fetch customers:', err);
                setError('Failed to fetch customers.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customers</h1>
                <button 
                    onClick={() => navigate('/customers/new')}
                    className="btn btn-primary"
                >
                    Add Customer
                </button>
            </div>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {customers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-base-content/70">No customers found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Sector</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer.id}>
                                            <td>
                                                <div className="font-bold">
                                                    {customer.firstName} {customer.lastName}
                                                </div>
                                            </td>
                                            <td>{customer.email}</td>
                                            <td>
                                                <span className="badge badge-outline">
                                                    {customer.sector?.name || 'No Sector'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button className="btn btn-sm btn-outline">
                                                        Edit
                                                    </button>
                                                    <button className="btn btn-sm btn-error btn-outline">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
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

export default CustomerList;