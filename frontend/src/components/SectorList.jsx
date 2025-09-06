import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SectorList = () => {
    const [sectors, setSectors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios
            .get('http://localhost:8080/api/sectors', {
                headers: { Authorization: `Bearer ${token}` },
            })
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