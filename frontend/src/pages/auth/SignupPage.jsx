import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const SignupPage = () => {
    const navigate = useNavigate();

    const [signupType, setSignupType] = useState('INDIVIDUAL'); // 'INDIVIDUAL' or 'ORGANIZATION'
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        organizationName: '',
        sectorId: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) { setError('Email is required'); return; }
        if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return; }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (!formData.sectorId) { setError('Sector is required'); return; }

        if (signupType === 'INDIVIDUAL' && !formData.role) {
            setError('Please select a role');
            return;
        }

        if (signupType === 'ORGANIZATION' && !formData.organizationName) {
            setError('Organization name is required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let response;
            if (signupType === 'INDIVIDUAL') {
                const payload = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    sectorId: Number(formData.sectorId)
                };
                response = await api.post('/auth/register', payload);
            } else {
                const payload = {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    organizationName: formData.organizationName,
                    sectorId: Number(formData.sectorId)
                };
                response = await api.post('/auth/register/organization', payload);
            }

            if (response.data.success || response.data.user) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                setError(response.data.message || 'Registration failed');
            }

        } catch (err) {
            setError(err.userMessage || 'Registration failed. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="card w-full max-w-md bg-white shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-3xl font-extrabold text-gray-900 mb-2">Create an Account</h2>
                    
                    <div className="tabs tabs-boxed mb-6 justify-center">
                        <button 
                            className={`tab ${signupType === 'INDIVIDUAL' ? 'tab-active' : ''}`}
                            onClick={() => setSignupType('INDIVIDUAL')}
                            type="button"
                        >
                            Individual
                        </button>
                        <button 
                            className={`tab ${signupType === 'ORGANIZATION' ? 'tab-active' : ''}`}
                            onClick={() => setSignupType('ORGANIZATION')}
                            type="button"
                        >
                            Organization
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-error mb-4 shadow-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mb-4 shadow-sm">
                            <span>{success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {signupType === 'ORGANIZATION' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Organization Name</span>
                                </label>
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    placeholder="Company XYZ"
                                    required={signupType === 'ORGANIZATION'}
                                />
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">
                                    {signupType === 'ORGANIZATION' ? 'Admin Username' : 'Username'}
                                </span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder="johndoe"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">
                                    {signupType === 'ORGANIZATION' ? 'Admin Email' : 'Email'}
                                </span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {signupType === 'INDIVIDUAL' && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Role</span>
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                    required={signupType === 'INDIVIDUAL'}
                                >
                                    <option value="">Select Role</option>
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                        )}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">
                                    {signupType === 'ORGANIZATION' ? 'Organization Sector' : 'Sector'}
                                </span>
                            </label>
                            <select
                                name="sectorId"
                                value={formData.sectorId}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="">Select Sector</option>
                                <option value="1">Banking & Finance</option>
                                <option value="2">Healthcare Services</option>
                                <option value="3">Logistics & Supply Chain</option>
                                <option value="4">Content Creation</option>
                            </select>
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : (signupType === 'ORGANIZATION' ? 'Register Organization' : 'Sign Up')}
                            </button>
                        </div>

                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-primary-focus">
                                Sign In here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SignupPage;
