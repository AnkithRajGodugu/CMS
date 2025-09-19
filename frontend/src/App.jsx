import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import SectorList from './components/SectorList';
import UserList from './components/UserList';
import Report from './components/Report';
import Counter from './components/Counter';
import LoanPage from './pages/banking/loan';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <h1>CMS Dashboard</h1>
                <nav style={{ marginBottom: 12 }}>
                    <a href="/" style={{ marginRight: 8 }}>Home</a>
                    <a href="/banking/loan" style={{ marginRight: 8 }}>Loan</a>
                    <a href="/customers" style={{ marginRight: 8 }}>Customers</a>
                    <a href="/sectors" style={{ marginRight: 8 }}>Sectors</a>
                </nav>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/sectors" element={<SectorList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/reports" element={<Report />} />
                    <Route path="/counter" element={<Counter />} />
                    <Route path="/banking/loan" element={<LoanPage />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;