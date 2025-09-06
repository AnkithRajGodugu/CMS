import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get('http://localhost:8080/api/customers', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setCustomers(response.data))
            .catch((err) => {
                setError('Failed to fetch customers.');
                if (err.response && err.response.status === 403) {
                    navigate('/login');
                }
            });
    }, [navigate]);

    return (
        <div>
            <h2>Customers</h2>
            <button onClick={() => navigate('/customers/new')}>Add Customer</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {customers.map((customer) => (
                    <li key={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.email} ({customer.sector?.name || 'No Sector'})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;