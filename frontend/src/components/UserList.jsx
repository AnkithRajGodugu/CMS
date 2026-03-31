import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/users')
            .then((response) => setUsers(response.data))
            .catch((err) => {
                setError('Failed to fetch users.');
                if (err.response && err.response.status === 403) {
                    navigate('/login');
                }
            });
    }, [navigate]);

    return (
        <div>
            <h2>Users</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username} - {user.role} ({user.sector?.name || 'No Sector'})</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;