import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        sector: { id: '' },
    });
    const [sectors, setSectors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/sectors')
            .then((response) => setSectors(response.data))
            .catch(() => setError('Failed to fetch sectors.'));
    }, []);

    const handleSubmit = async () => {
        try {
            await api.post('/customers', formData);
            navigate('/customers');
        } catch {
            setError('Failed to create customer.');
        }
    };

    return (
        <div>
            <h2>Add Customer</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First Name"
            />
            <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last Name"
            />
            <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
            />
            <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Phone"
            />
            <select
                value={formData.sector.id}
                onChange={(e) => setFormData({ ...formData, sector: { id: e.target.value } })}
            >
                <option value="">Select Sector</option>
                {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>{sector.name}</option>
                ))}
            </select>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default CustomerForm;