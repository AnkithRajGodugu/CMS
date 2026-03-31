import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Report = () => {
    const [sectorName, setSectorName] = useState('Retail');
    const [count, setCount] = useState(null);
    const [error, setError] = useState('');

    const fetchReport = async () => {
        try {
            const response = await api.get(`/reports/customers-in-sector-this-month?sectorName=${sectorName}`);
            setCount(response.data);
        } catch {
            setError('Failed to fetch report.');
        }
    };

    const chartData = {
        labels: [sectorName],
        datasets: [
            {
                label: 'Customers This Month',
                data: [count],
                backgroundColor: '#36A2EB',
            },
        ],
    };

    return (
        <div>
            <h2>Customer Report</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                value={sectorName}
                onChange={(e) => setSectorName(e.target.value)}
                placeholder="Sector Name"
            />
            <button onClick={fetchReport}>Get Report</button>
            {count !== null && (
                <div>
                    <p>Customers in {sectorName} this month: {count}</p>
                    <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
                </div>
            )}
        </div>
    );
};

export default Report;