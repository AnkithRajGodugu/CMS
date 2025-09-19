import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SectorList = () => {
    const [sectors, setSectors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/sectors')
            .then((response) => setSectors(response.data))
            .catch((err) => {
                setError('Failed to fetch sectors.');
                if (err.response && err.response.status === 403) {
                    navigate('/login');
                }
            });
    }, [navigate]);

    return (
        <div>
            <h2>Sectors</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {sectors.map((sector) => (
                    <li key={sector.id}>{sector.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SectorList;