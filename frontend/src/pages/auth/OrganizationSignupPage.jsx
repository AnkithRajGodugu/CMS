import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:8081/api';

const OrganizationSignupPage = () => {
    const [formData, setFormData] = useState({
        organizationName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        sectorId: ''
    });
    const [sectors, setSectors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await fetch(`${API_BASE}/public/sectors`);
                const data = await res.json();
                setSectors(Array.isArray(data) ? data : data.data || []);
            } catch {
                toast.error('Failed to load sectors');
            }
        };
        fetchSectors();
    }, []);

    const validate = () => {
        const e = {};
        if (!formData.organizationName.trim()) e.organizationName = 'Organization name is required';
        if (!formData.username.trim()) e.username = 'Username is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
        if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!formData.sectorId) e.sectorId = 'Please select a sector';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/register/organization`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    organizationName: formData.organizationName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    sectorId: formData.sectorId
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');
            toast.success('Organization registered! Please verify your email and log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const Field = ({ label, name, type = 'text', placeholder }) => (
        <div className="form-control w-full">
            <label className="label"><span className="label-text font-medium">{label}</span></label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={isLoading}
                className={`input input-bordered w-full ${errors[name] ? 'input-error' : ''}`}
            />
            {errors[name] && <label className="label"><span className="label-text-alt text-error">{errors[name]}</span></label>}
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold gradient-text">CMS Platform</Link>
                    <h1 className="text-2xl font-bold mt-4 mb-1">Register Organization</h1>
                    <p className="text-base-content/60 text-sm">Set up your organization&apos;s CMS account</p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-8 space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <Field label="Organization Name" name="organizationName" placeholder="Acme Corp" />
                            <Field label="Admin Username" name="username" placeholder="admin_acme" />
                            <Field label="Email Address" name="email" type="email" placeholder="admin@acme.com" />

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Password" name="password" type="password" placeholder="••••••••" />
                                <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label"><span className="label-text font-medium">Sector</span></label>
                                <select
                                    name="sectorId"
                                    value={formData.sectorId}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`select select-bordered w-full ${errors.sectorId ? 'select-error' : ''}`}
                                >
                                    <option value="">Select your sector...</option>
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.sectorId && <label className="label"><span className="label-text-alt text-error">{errors.sectorId}</span></label>}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                                >
                                    {isLoading ? 'Creating Organization...' : 'Create Organization'}
                                </button>
                            </div>
                        </form>

                        <div className="divider">Already registered?</div>
                        <div className="text-center">
                            <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationSignupPage;
