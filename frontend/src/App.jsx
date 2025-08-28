import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import SectorList from './components/SectorList';
import UserList from './components/UserList';
import Report from './components/Report';
import './App.css';

function App() {
    return (
        <Router>
            <div>
                <h1>CMS Dashboard</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/customers" element={<CustomerList />} />
                    <Route path="/customers/new" element={<CustomerForm />} />
                    <Route path="/sectors" element={<SectorList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/reports" element={<Report />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;